import type { TransactionExtended } from "@/types/common";
import {
  useAssociateTokens,
  useWatchTransactionReceipt,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import * as React from "react";

export function AssociateTokenForm() {
  const { associateTokens } = useAssociateTokens();
  const { watch } = useWatchTransactionReceipt();

  const [loading, setLoading] = useState(false);

  const associateTokensSubmit = async (tokenAddress: string) => {
    try {
      setLoading(true);
      const hashOrTransactionId = await associateTokens([tokenAddress]);

      if (!hashOrTransactionId) {
        throw new Error("hashOrTransactionId not found");
      }

      watch(hashOrTransactionId as string, {
        onSuccess: (transaction) => {
          console.log(transaction);

          const txUrl = `https://hashscan.io/testnet/transaction/${(transaction as TransactionExtended).consensus_timestamp}`;

          const label = (
            <div>
              <div>SUCCESS: </div>
              <a href={txUrl} target="_blank" rel="noreferrer">
                {txUrl}
              </a>
            </div>
          );

          toast.success(label, {
            icon: "✅",
            style: { maxWidth: "unset" },
          });

          setLoading(false);

          return transaction;
        },
        onError: (transaction) => {
          console.log(transaction);

          const txUrl = `https://hashscan.io/testnet/transaction/${(transaction as TransactionExtended).consensus_timestamp}`;

          const label = (
            <div>
              <div>FAILED: {(transaction as TransactionExtended).result}</div>
              <a href={txUrl} target="_blank" rel="noreferrer">
                {txUrl}
              </a>
            </div>
          );

          toast.error(label, {
            icon: "❌",
            style: { maxWidth: "unset" },
          });

          setLoading(false);

          return transaction;
        },
      });
    } catch (e) {
      const jError = JSON.parse(JSON.stringify(e));
      console.log(jError);

      toast.error(jError.shortMessage || jError.status, {
        icon: "❌",
        style: { maxWidth: "unset" },
      });

      setLoading(false);
    }
  };

  return (
    <>
      <h3>Associate token</h3>
      <Formik
        initialValues={{
          tokenAddress: "",
        }}
        //@TODO add validation for tokenId and EVM address formats
        validationSchema={Yup.object({
          tokenAddress: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("L114 values ===", values);

          await associateTokensSubmit(values.tokenAddress);
          setSubmitting(false);
        }}
      >
        <Form>
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="tokenAddress">
              <span className="label-text">Token ID or token EVM address</span>
            </label>
            <Field
              name="tokenAddress"
              type="text"
              className="input w-full max-w-xs"
            />
            <label className="label" htmlFor="tokenAddress">
              <ErrorMessage name="tokenAddress">
                {(error) => (
                  <span className="label-text-alt text-red-700">{error}</span>
                )}
              </ErrorMessage>
            </label>

            <button className="btn btn-primary" type="submit">
              {loading ? <span className="loading loading-spinner"/> : "Submit"}
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
