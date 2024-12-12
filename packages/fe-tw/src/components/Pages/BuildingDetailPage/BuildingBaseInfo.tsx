import { BuildingData } from "@/types/erc3643/types"
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import moment from "moment";

export const BuildingBaseInfo = ({ imageUrl, title, purchasedAt, description }: BuildingData) => {
    return (
        <div className="flex flex-row bg-purple-50 p-4">
            <ReusableAvatar size="extra-lg" imageSource={imageUrl} imageAlt={title} isRounded isFocusAvailable={false} />
            <div className="flex flex-col ml-20">
                <article className="prose">
                    <h1>{title}</h1>
                    <p className="text-sm text-slate-700">Purchased at: {moment(purchasedAt).format('YYYY-MM-DD')}</p>
                </article>
                <article className="mt-4">
                    {description.split('\\').map(line => (
                        <p className="mt-2" key={line}>{line}</p>
                    ))}
                </article>
            </div>
        </div>
    );
};
