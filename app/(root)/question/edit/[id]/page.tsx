import Question from "@/components/shared/form/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type EditQuestionProps = {
  params: {
    id: string;
  };
};

const EditQuestion = async ({ params: { id } }: EditQuestionProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const mongoId = await getUserById(userId);
  const result = await getQuestionById(id);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoId)}
          questionDetails={JSON.stringify(result?.question)}
        />
      </div>
    </div>
  );
};

export default EditQuestion;
