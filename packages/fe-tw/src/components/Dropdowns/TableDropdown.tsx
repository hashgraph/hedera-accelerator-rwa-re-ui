import React from "react";
//import { createPopper } from "@popperjs/core";
import { usePopper } from "react-popper";

const NotificationDropdown = () => {
	// dropdown props
	const [referenceElement, _setReferenceElement] = React.useState(null);
	const [popperElement, _setPopperElement] = React.useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement);

	const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);

	const openDropdownPopover = () => {
		//    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
		//  placement: "left-start",
		//  });
		setDropdownPopoverShow(true);
	};
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};
	return (
		<>
			<button
				type="button"
				className="text-blueGray-500 py-1 px-3"
				ref={referenceElement}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
				}}
			>
				<i className="fas fa-ellipsis-v" />
			</button>
			<div
				ref={popperElement}
				className={`${dropdownPopoverShow ? "block " : "hidden "}bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
				style={styles.popper}
				{...attributes.popper}
			>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Another action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Something else here
				</button>
			</div>
		</>
	);
};

export default NotificationDropdown;
