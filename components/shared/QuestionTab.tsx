import { getQuestionByUserId } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";

import React from "react";
import NoResult from "./NoResult";
import QuestionCard from "./card/QuestionCard";

type Props = {
  clerkId: string;
  userId: string;
  searchParams: SearchParamsProps;
};

const QuestionTab = async ({ clerkId, userId, searchParams }: Props) => {
  const result = await getQuestionByUserId({
    userId,
    page: 1,
  });

  return (
    <>
      <div className="mt-11 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              clerkId={clerkId}
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
            title="There's no post to show"
            description="First Ask a Question to show here"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      {result.totalQuestions > 10 && <p>Pagination</p>}
    </>
  );
};

export default QuestionTab;
