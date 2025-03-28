export const ClockIcon = ({ size = "20" }) => {
   return (
      // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="1.5"
         stroke="currentColor"
         className="size-6"
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
         />
      </svg>
   );
};
