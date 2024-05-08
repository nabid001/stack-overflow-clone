import Question from "@/components/shared/form/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Question | DevFlow",
  description:
    "DevFlow is a place where developers can ask questions and get answers.",
};

const AskQuestion = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const mongoId = await getUserById(userId as string);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <Question type="Create" mongoUserId={mongoId && mongoId} />
      </div>
    </div>
  );
};

export default AskQuestion;
