import { getUserAnswer } from "@/lib/actions/answer.action";
import { SearchParamsProps } from "@/types";

import AnswerCard from "./card/AnswerCard";
import NoResult from "./NoResult";

type Props = {
  clerkId: string;
  userId: string;
  searchParams: SearchParamsProps;
};
const AnswerTab = async ({ clerkId, userId, searchParams }: Props) => {
  const result = await getUserAnswer({
    userId,
    page: 1,
  });

  return (
    <>
      <div className="mt-11 flex w-full flex-col gap-6">
        {result.answers.length > 0 ? (
          result.answers.map((answer) => (
            <AnswerCard
              key={answer._id}
              _id={answer._id}
              clerkId={clerkId}
              author={answer.author}
              createdAt={answer.createdAt}
              question={answer.question}
              upvotes={answer.upvotes.length}
            />
          ))
        ) : (
          <NoResult
            title="There's no answer to show"
            description="First replay to someone question"
            link="/"
            linkTitle="Explore"
          />
        )}
      </div>
    </>
  );
};

export default AnswerTab;
