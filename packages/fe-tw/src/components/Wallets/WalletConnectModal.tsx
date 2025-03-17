"use client";

import { MetamaskContext } from "@/context/MetamaskContext";
import { useWalletInterface } from "@/services/useWalletInterface";
import { shortEvmAddress } from "@/services/util";
import { connectToMetamask } from "@/services/wallets/metamask/MetaMaskClient";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/WalletConnectClient";
import { useContext, useEffect, useState } from "react";

export function WalletConnectModal() {
  const { accountId, walletInterface } = useWalletInterface();
  const metaMaskCtx = useContext(MetamaskContext);

  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!accountId) {
      metaMaskCtx.setMetamaskAccountAddress("");
    }
  }, [accountId, metaMaskCtx]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {accountId ? (
        <button
          type="button"
          className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition"
          onClick={() => {
            walletInterface?.disconnect();
            metaMaskCtx.setMetamaskAccountAddress("");
          }}
        >
          Disconnect: {shortEvmAddress(accountId)}
        </button>
      ) : (
        <>
          <button
            type="button"
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition"
            onClick={handleOpenModal}
          >
            Connect Wallet
          </button>

          {isModalOpen && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={handleCloseModal}
            >
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <div
                className="bg-white p-6 rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold">Connect Wallet</h2>
                <div className="flex flex-col gap-4 mt-4">
                  <button
                    type="button"
                    className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition w-60"
                    onClick={() => {
                      connectToMetamask();
                      handleCloseModal();
                    }}
                  >
                    MetaMask
                  </button>
                  <button
                    type="button"
                    className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition w-60"
                    onClick={() => {
                      openWalletConnectModal();
                      handleCloseModal();
                    }}
                  >
                    WalletConnect
                  </button>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300 transition"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
