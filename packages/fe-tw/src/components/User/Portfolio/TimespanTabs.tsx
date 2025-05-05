import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeFrame } from "./types";

interface TimespanTabsProps {
   value: TimeFrame;
   defaultValue?: TimeFrame;
   onChange: (value: TimeFrame) => void;
}

export const TimespanTabs = ({ value, defaultValue = "1M", onChange }: TimespanTabsProps) => {
   return (
      <Tabs
         className="self-end"
         value={value}
         defaultValue={defaultValue}
         onValueChange={onChange as (value: string) => void}
      >
         <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="6M">6M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
            <TabsTrigger value="ALL">ALL</TabsTrigger>
         </TabsList>
      </Tabs>
   );
};
