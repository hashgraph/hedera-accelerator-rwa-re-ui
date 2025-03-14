"use client";

import Link from "next/link";

interface PlayButtonProps {
  href: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="absolute bottom-4 right-4 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center hover:bg-purple-200 transition"
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-gray-700"
      >
        <path
          fillRule="evenodd"
          d="M4.5 3.75a.75.75 0 0 1 1.11-.65l15 8.25a.75.75 0 0 1 0 1.3l-15 8.25A.75.75 0 0 1 4.5 20.25V3.75z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
};
