import {
	useAssociateTokens,
	useWatchTransactionReceipt,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

type TransactionExtended = {
	transaction_id: string;
	consensus_timestamp?: string;
	result?: string;
};

export function AssociateTokenForm() {
	const { associateTokens } = useAssociateTokens();
	const { watch } = useWatchTransactionReceipt();

	const [tokenAddress, setTokenAddress] = useState("");
	const [loading, setLoading] = useState(false);

	const associateTokensSubmit = async (tokenAddress: string) => {
		try {
			setLoading(true);
			const hashOrTransactionId = await associateTokens([tokenAddress]);
			console.log({ hashOrTransactionId });

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
								txUrl
							</a>
						</div>
					);

					toast.success(label, {
						icon: "✅",
						style: { maxWidth: "unset" },
					});

					// updateBalance();
					// updateTokensBalance();
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
								txUrl
							</a>
						</div>
					);

					toast.error(label, {
						icon: "❌",
						style: { maxWidth: "unset" },
					});

					// updateBalance();
					// updateTokensBalance();
					setLoading(false);

					return transaction;
				},
			});
		} catch (e) {
			console.log("L85 e ===", e);
			const jError = JSON.parse(JSON.stringify(e));
			console.log(jError);

			toast.error(jError.shortMessage || jError.status, {
				icon: "❌",
				style: { maxWidth: "unset" },
			});

			// updateBalance();
			// updateTokensBalance();
			setLoading(false);
		}
	};

	return (
		<>
			<Formik
				initialValues={{
					tokenAddress: "",
				}}
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
					<label htmlFor="tokenAddress">Token Address</label>
					<Field name="tokenAddress" type="text" />
					<ErrorMessage name="tokenAddress" />

					<button type="submit">Submit</button>
				</Form>
			</Formik>
		</>
	);
}
