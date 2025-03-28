"use client";

type CopeAdminUpdateButtonProps = {
   onClick: () => void;
   isLoading?: boolean;
};

export function CopeAdminUpdateButton({ onClick, isLoading }: CopeAdminUpdateButtonProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         disabled={isLoading}
         className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
      >
         {isLoading ? "Updating..." : "Update COPE Information"}
      </button>
   );
}
