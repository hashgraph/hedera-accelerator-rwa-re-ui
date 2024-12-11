"use client";

import { format, formatDistance } from "date-fns";

const formats = {
    dateAsDay: "dd",
    dateWithTime: "dd/MM/yyyy",
    dateAsTimeRange: '',
};

type Props = {
    date: number | Date,
    formatType: "dateWithTime" | "dateAsDay" | "dateAsTimeRange",
    prefix?: string
};

export const TimeLabel = ({ date, formatType, prefix }: Props) => {
    return (
        <span className="text-stone-500 text-xs mx-2">
            {formatType === "dateAsTimeRange" ? (
                <>
                    {prefix ? (prefix + '\n') : ""}
                    {formatDistance(new Date(date), new Date(), { addSuffix: true })}
                </>
            ) : (
                <>
                    {prefix ? (prefix + '\n') : ""} {format(new Date(date), formats[formatType] ?? "dd/MM/yyyy")}
                </>
            )}
        </span>
    );
};
