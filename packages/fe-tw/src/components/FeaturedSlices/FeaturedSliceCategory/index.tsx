'use client'

import moment from 'moment'
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar"
import type { BuildingSliceCategoryData } from "@/types/erc3643/types"
import Link from "next/link";

export const FeaturedSliceCategory = (props: BuildingSliceCategoryData) => {
    return (
        <div>
            <article className="prose my-2">
                <Link href={`/dash/category/${props.name}`}>
                    <h2 className="text-stone-700">{props.title}</h2>
                </Link>
            </article>
            <div className="carousel rounded-box space-x-8 my-2 p-2">
                {props.items?.map(item => (
                    <div key={item.name} className="flex flex-col">
                        <ReusableAvatar
                            key={item.name}
                            isRounded
                            size={props.itemsSize}
                            imageAlt={item.name}
                            imageSource={item.imageUrl}
                        />
                        <p className="my-2">{item.name}</p>
                        <div className="flex flex-row">
                            <span className="text-sky-500 text-xs">Est price: {item.estimatedPrice}</span>
                            <span className="text-stone-500 text-xs mx-2">
                                Ends {moment().add('s', item.timeToEnd).endOf('day').fromNow()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
