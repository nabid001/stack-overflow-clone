import NoResult from "@/components/shared/NoResult";
import QuestionCard, {
  QuestionProps,
} from "@/components/shared/card/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionByTagId } from "@/lib/actions/tag.action";

import React from "react";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    q: string;
  };
};

const page = async ({ params: { id }, searchParams }: Props) => {
  /* TODO: add searchParams to getQuestionByTagId */
  const result = await getQuestionByTagId({
    tagId: id,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tags.name}</h1>

      <div className="mt-11 flex items-center justify-between gap-5">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions..."
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-11 flex w-full flex-col gap-6">
        {result?.tags?.questions.length > 0 ? (
          result.tags.questions.map((question: QuestionProps) => (
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
            title="There is no question to show"
            description="Save questions to see them here."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;
