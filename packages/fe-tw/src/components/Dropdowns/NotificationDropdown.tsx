"use client";
import React from "react";
import { usePopper } from "react-popper";

export default function NotificationDropdown() {
	// dropdown props

	const [referenceElement, _setReferenceElement] = React.useState(null);
	const [popperElement, _setPopperElement] = React.useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement);

	const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);

	const openDropdownPopover = () => {
		setDropdownPopoverShow(true);
	};
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};
	return (
		<>
			<button
				type="button"
				className="text-slate-500 block py-1 px-3"
				ref={referenceElement}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
				}}
			>
				<i className="fas fa-bell" />
			</button>
			<div
				ref={popperElement}
				className={`${dropdownPopoverShow ? "block " : "hidden "}bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48`}
				style={styles.popper}
				{...attributes.popper}
			>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Another action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Something else here
				</button>
				<div className="h-0 my-2 border border-solid border-slate-100" />
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Seprated link
				</button>
			</div>
		</>
	);
}
