import React from "react";
import Filters from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import Link from "next/link";
import { getAnswerById } from "@/lib/actions/answer.action";
import Image from "next/image";
import ParseHTML from "./ParseHTML";
import { getTimestamp } from "@/lib/utils";
import Votes from "./Votes";
import Pagination from "./Pagination";

type Props = {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
};

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
}: Props) => {
  const result = await getAnswerById({
    questionId: JSON.parse(questionId),
    page: page ? +page : 1,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filters filters={AnswerFilters} />
      </div>

      <>
        {result?.answers?.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  width={18}
                  height={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>

                  <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                    - answered {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>

              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasupvote={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasdownvote={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </>

      <div className="mt-10">
        <Pagination isNext={result?.isNext} pageNumber={page ? +page : 1} />
      </div>
    </div>
  );
};

export default AllAnswers;
