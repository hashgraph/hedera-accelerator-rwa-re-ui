'use client'

import { useState } from "react"

export type AvatarSize = 'lg' | 'md' | 'sm' | 'extra-lg';

type Props = {
    imageSource?: string;
    imageAlt: string;
    size?: AvatarSize;
    isRounded?: boolean;
    isCircleCorners?: boolean;
    isFocusAvailable?: boolean;
    onFocusStateChange?: (state: boolean) => void;
}

const sizes = {
    lg: 'w-32',
    md: 'w-28',
    sm: 'w-24',
    'extra-lg': 'w-48'
}

export const ReusableAvatar = ({
    isRounded = false,
    isCircleCorners = false,
    isFocusAvailable = true,
    size,
    imageSource = '/assets/dome.jpeg',
    imageAlt,
    onFocusStateChange,
}: Props) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="avatar" onMouseEnter={() => {
            setIsFocused(true)
            onFocusStateChange?.(true)
        }} onMouseLeave={() => {
            setIsFocused(false)
            onFocusStateChange?.(false)
        }}>
            <div className={`${isRounded ? 'rounded' : ''} ${isCircleCorners ? 'rounded-full' : ''} ${sizes[size ?? "md"]} ${isFocusAvailable ? isFocused ? 'ring ring-primary' : '' : ''}`}>
                <img src={imageSource} alt={imageAlt} />
            </div>
        </div>
    )
}
