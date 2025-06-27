import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
   onChangeValue: any,
   onSubmitDepositValue: any,
   depositEnabled?: boolean,
};

export const DepositToSliceForm = ({ onChangeValue, onSubmitDepositValue, depositEnabled }: Props) => {
   return (
      <div className="flex flex-row gap-2 pb-2">
         <div>
            <Input
               required
               placeholder="e.g. 100"
               onChange={(e) => onChangeValue(e.target.value)}
            />
         </div>
         <Button
            type="button"
            onClick={onSubmitDepositValue}
            disabled={depositEnabled}
         >
            Deposit
         </Button>
      </div>
   );
};
