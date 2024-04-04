"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

type Props = {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
};

const LocalSearchbar = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: Props) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search Ico"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
        className="text-dark400_light700 paragraph-regular no-focus placeholder w-full border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search Ico"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
