import React, { use, Usable } from "react";

type Props = {
  isLoading: boolean;
};

export const LoadingView = ({ isLoading }: Props) => {
  return (
    isLoading && (
      <div className="flex justify-center py-40">
        <span className="loading loading-spinner text-accent loading-lg" />
      </div>
    )
  );
};
