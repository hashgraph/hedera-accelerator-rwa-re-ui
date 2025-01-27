"use client";

import { AccountBalance } from "@/components/Account/AccountBalance";
import { AccountOwnedTokensList } from "@/components/Account/AccountOwnedTokensList";
import { AssociateTokenForm } from "@/components/Forms/AssociateTokenForm";

export default function Home() {
	return (
		<>
			<div className="p-10">
				<AssociateTokenForm />
			</div>
			<div className="p-10">
				<AccountBalance />
			</div>
			<div className="p-10">
				<AccountOwnedTokensList />
			</div>
		</>
	);
}
