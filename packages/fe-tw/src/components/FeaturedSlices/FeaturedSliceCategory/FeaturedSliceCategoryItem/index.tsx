import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { TimeLabel } from "@/components/Typography/TimeLabel";
import type {
	BuildingSliceCategoryData,
	BuildingSliceData,
} from "@/types/erc3643/types";

type Props = {
	item: BuildingSliceData;
	category: BuildingSliceCategoryData;
};

export const FeaturedSliceCategoryItem = ({ item, category }: Props) => {
	return (
		<div key={item.name} className="flex flex-col">
			<ReusableAvatar
				key={item.name}
				isRounded
				size={category.itemsSize}
				imageAlt={item.name}
				imageSource={item.imageUrl}
			/>
			<p className="my-2">{item.name}</p>
			<div className="flex flex-row">
				<span className="text-sky-500 text-xs">
					Est price: {item.estimatedPrice}
				</span>
				<TimeLabel date={item.endsAt} prefix="Ends" formatType="dateAsTimeRange" />
			</div>
		</div>
	);
};
