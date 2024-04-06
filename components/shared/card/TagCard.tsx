import Link from "next/link";
import React from "react";

type Props = {
  _id: string;
  name: string;
  description: string;
  totalQuestions: number;
};

const TagCard = ({ _id, name, description, totalQuestions }: Props) => {
  return (
    <>
      <Link
        href={`/profile/${_id}`}
        className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
      >
        <article className="background-light900_dark200 light-border flex w-full flex-col items-start justify-center gap-5 rounded-2xl border p-8">
          <h3 className="paragraph-semibold text-dark300_light900 background-light800_dark400 px-4 py-1">
            {name}
          </h3>
          <p className="small-regular text-dark500_light700 max-w-sm text-wrap">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            maiores magnam quia at exercitationem nisi distinctio eum, iure sunt
            expedita nostrum, quis reprehenderit aliquam, dicta quod porro et
            necessitatibus libero?
          </p>

          <p className="body-semibold text-center text-primary-500">
            {totalQuestions}+{" "}
            <span className="small-medium text-dark400_light500">
              Questions
            </span>
          </p>
        </article>
      </Link>
    </>
  );
};

export default TagCard;
