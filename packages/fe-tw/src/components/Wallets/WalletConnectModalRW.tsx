import { shortEvmAddress } from "@/services/util";
import {
	useAccountId,
	useEvmAddress,
	useWallet,
} from "@buidlerlabs/hashgraph-react-wallets";
import {
	HashpackConnector,
	MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useTimeoutEffect } from "@react-hookz/web";
import { useState } from "react";
import { Alert, Button, Modal, Toast } from "react-daisyui";

export function WalletConnectModalRW() {
	const { Dialog, handleShow, handleHide } = Modal.useDialog();

	const {
		isExtensionRequired: isExtensionRequiredHashpack,
		extensionReady: extensionReadyHashpack,
		isConnected: isConnectedHashpack,
		connect: connectHashpack,
		disconnect: disconectHashpack,
	} = useWallet(HashpackConnector) || {};

	const {
		isExtensionRequired: isExtensionRequiredMetamask,
		extensionReady: extensionReadyMetamask,
		isConnected: isConnectedMetamask,
		connect: connectMetamask,
		disconnect: disconnectMetamask,
	} = useWallet(MetamaskConnector) || {};

	const { data: accountId } = useAccountId();
	const { data: evmAddress } = useEvmAddress();

	const timeoutValue = 5000;
	const [showError, setShowError] = useState(false);
	const [, reset] = useTimeoutEffect(
		() => {
			setShowError(false);
		},
		showError ? timeoutValue : undefined,
	);

	return (
		<>
			{isConnectedHashpack || isConnectedMetamask ? (
				<>
					<div className="hidden flex-none lg:block">
						<div className="badge">{accountId}</div>
						<div className="badge mr-2">{shortEvmAddress(evmAddress)}</div>
					</div>
					<Button
						color={"primary"}
						onClick={() => {
							if (isConnectedHashpack) {
								disconectHashpack();
							}

							if (isConnectedMetamask) {
								disconnectMetamask();
							}
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
						<Modal.Header className="font-bold text-primary-content">
							Connect Wallet
						</Modal.Header>
						<Modal.Body>
							<div className={"flex flex-col gap-8 items-center"}>
								<Button
									className={"w-60"}
									color={"primary"}
									onClick={() => {
										if (
											isExtensionRequiredHashpack &&
											!extensionReadyHashpack
										) {
											setShowError(true);
										} else {
											connectHashpack();
											handleHide();
										}
									}}
								>
									HashPack
								</Button>

								<Button
									className={"w-60"}
									color={"primary"}
									onClick={() => {
										if (
											isExtensionRequiredMetamask &&
											!extensionReadyMetamask
										) {
											setShowError(true);
										} else {
											connectMetamask();
											handleHide();
										}
									}}
								>
									MetaMask
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

			<Toast>
				{showError && (
					<Alert status={"error"}>
						<div className="w-full flex-row justify-between gap-2">
							<h3>Wallet is not installed!</h3>
						</div>
						<Button
							color="ghost"
							onClick={() => {
								setShowError(false);
								reset();
							}}
						>
							X
						</Button>
					</Alert>
				)}
			</Toast>
		</>
	);
}