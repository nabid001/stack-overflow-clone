/* eslint-disable @typescript-eslint/no-explicit-any */
import Filters from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/card/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";

import { getSavedQuestion } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const Collection = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const result = await getSavedQuestion({ clerkId: userId as string });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <Filters
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-11 flex w-full flex-col gap-6">
        {result?.question?.length > 0 ? (
          result.question.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              author={question?.author}
              tags={question.tags}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="You haven't saved any questions yet."
            description="Save questions to see them here."
            link="/"
            linkTitle="Explore Questions"
          />
        )}
      </div>
    </>
  );
};

export default Collection;
