import { useContext, useState, useEffect } from "react";
import { MetamaskContext } from "@/context/MetamaskContext";
import { useWalletInterface } from "@/services/useWalletInterface";
import { shortEvmAddress } from "@/services/util";
import { connectToMetamask } from "@/services/wallets/metamask/MetaMaskClient";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/WalletConnectClient";
import { Button } from "react-daisyui";

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
        <>
          <div className="line-clamp-1 mx-4">{shortEvmAddress(accountId)}</div>
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
            onClick={() => {
              walletInterface?.disconnect();
              metaMaskCtx.setMetamaskAccountAddress("");
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
            onClick={handleOpenModal}
          >
            Connect Wallet
          </button>

          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={handleCloseModal}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold">Connect Wallet</h2>
                <div className="flex flex-col gap-4 mt-4">
                  <button
                    className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition w-60"
                    onClick={() => {
                      connectToMetamask();
                      handleCloseModal();
                    }}
                  >
                    MetaMask
                  </button>
                  <button
                    className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition w-60"
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
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
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
