import { MetamaskContext } from "@/context/MetamaskContext";
import { useWalletInterface } from "@/services/useWalletInterface";
import { shortEvmAddress } from "@/services/util";
import { connectToMetamask } from "@/services/wallets/metamask/MetaMaskClient";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/WalletConnectClient";
import { useContext } from "react";
import { Button, Modal } from "react-daisyui";

export function WalletConnectModal() {
	const { Dialog, handleShow, handleHide } = Modal.useDialog();
	const { accountId, walletInterface } = useWalletInterface();
	const metaMaskCtx = useContext(MetamaskContext);

	return (
		<>
			{accountId ? (
				<>
					<div className={"line-clamp-1 mx-4"}>
						{shortEvmAddress(accountId)}
					</div>
					<Button
						color={"primary"}
						onClick={() => {
							walletInterface?.disconnect();
							metaMaskCtx.setMetamaskAccountAddress("");
						}}
					>
						Disconnect
					</Button>
				</>
			) : (
				<>
					<Button color={"primary"} onClick={handleShow}>
						Connect Wallet
					</Button>

					<Dialog responsive={true}>
						<Modal.Header className="font-bold">Connect Wallet</Modal.Header>
						<Modal.Body>
							<div className={"flex flex-col gap-8 items-center"}>
								<Button
									className={"w-60"}
									color={"primary"}
									onClick={() => {
										connectToMetamask();
										handleHide();
									}}
								>
									MetaMask
								</Button>
								<Button
									className={"w-60"}
									color={"primary"}
									onClick={() => {
										openWalletConnectModal();
										handleHide();
									}}
								>
									HashPack
								</Button>
							</div>
						</Modal.Body>
						<Modal.Actions>
							<form method="dialog">
								<Button>Close</Button>
							</form>
						</Modal.Actions>
					</Dialog>
				</>
			)}
		</>
	);
}
