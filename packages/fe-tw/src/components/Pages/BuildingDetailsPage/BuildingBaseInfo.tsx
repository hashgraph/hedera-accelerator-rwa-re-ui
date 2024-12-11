import { BuildingData } from "@/types/erc3643/types"
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { TimeLabel } from "@/components/Typography/TimeLabel";

export const BuildingBaseInfo = ({ imageUrl, title, purchasedAt, description }: BuildingData) => {
    return (
        <div className="flex flex-row bg-indigo-100 p-4">
            <ReusableAvatar size="extra-lg" imageSource={imageUrl} imageAlt={title} isRounded isFocusAvailable={false} />
            <div className="flex flex-col ml-20">
                <article className="prose">
                    <h1>{title}</h1>
                    <p>
                        <TimeLabel date={purchasedAt} formatType="dateWithTime" prefix="Purchased at" />
                    </p>
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
