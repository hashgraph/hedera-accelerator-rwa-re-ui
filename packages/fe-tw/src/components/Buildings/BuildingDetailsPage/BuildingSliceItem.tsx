"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { slices } from "@/consts/slices";
import { ClockIcon } from "@/resources/icons/ClockIcon";
import { slugify } from "@/utils/slugify";
import moment from "moment";
import Link from "next/link";

export const BuildingSlice = ({ sliceId }: { sliceId: `0x${string}` }) => {
  const slice = slices.find(({ id }) => sliceId === id);

  if (!slice) return null;

  return (
    <Link
      href={`/slices/${slugify(slice.id)}`}
      className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm transition"
    >
      <div className="flex flex-row mt-5">
        <ReusableAvatar
          imageAlt={slice.name}
          imageSource={slice.imageIpfsUrl}
          size="md"
          isRounded
        />
        <div className="flex flex-col ml-5 justify-between">
          <article>
            <p className="text-lg font-semibold">{slice.name}</p>
            <p>{slice.description}</p>
          </article>
          <div className="flex flex-row items-center">
            <ClockIcon />
            <span className="text-xs ml-2 text-slate-700">
              {moment(slice.endDate).format("dddd, LT")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
