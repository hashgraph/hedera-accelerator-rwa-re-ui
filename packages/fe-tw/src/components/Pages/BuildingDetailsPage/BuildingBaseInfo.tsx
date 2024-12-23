import { BuildingData } from "@/types/erc3643/types";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import moment from "moment";

export const BuildingBaseInfo = ({
  imageUrl,
  title,
  purchasedAt,
  description,
}: BuildingData) => {
  return (
    <div className="flex flex-col md:flex-row bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
      {/* Avatar */}
      <ReusableAvatar
        size="extra-lg"
        imageSource={imageUrl}
        imageAlt={title}
        isRounded
      />

      <div className="flex flex-col mt-6 md:mt-0 md:ml-10">
        <article className="prose">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
          <p className="text-sm text-slate-700 mt-2">
            Purchased at: {moment(purchasedAt).format("YYYY-MM-DD")}
          </p>
        </article>

        <article className="mt-4">
          {description.split("\\").map((line) => (
            <p className="mt-2 text-sm sm:text-base" key={line}>
              {line}
            </p>
          ))}
        </article>
      </div>
    </div>
  );
};
