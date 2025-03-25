import { BuildingSlice } from "./BuildingSliceItem";

export const BuildingSlices = (props: { slices?: `0x${string}`[] }) => {
   return (
      <div className="flex flex-col mt-20">
         <article className="prose">
            <h2>Part of the following Slices (Adv)</h2>
         </article>
         <div className="flex flex-col">
            {props.slices?.map((slice) => <BuildingSlice key={slice} sliceId={slice} />)}
         </div>
      </div>
   );
};
