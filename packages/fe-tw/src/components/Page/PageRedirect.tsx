'use client';

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export const PageRedirect = ({ notFound, children }: { notFound: boolean, children: React.ReactElement }) => {
    const { replace } = useRouter();

    useEffect(() => {
        if (notFound) {
            replace('/not-found');
        }
    }, [notFound]);

    return !notFound && children;
}
