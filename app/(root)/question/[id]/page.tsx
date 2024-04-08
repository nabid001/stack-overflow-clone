import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/shared/card/Answer";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { TagProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

type Props = {
  params: {
    id: string;
  };
};

const page = async ({ params: { id } }: Props) => {
  const { userId } = auth();
  const mongouser = await getUserById(userId as string);
  const result = await getQuestionById(id);

  const {
    _id,
    title,
    content,
    tags,
    views,
    upvotes,
    downvotes,
    author,
    answers,
    createdAt,
  } = result.question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={author.picture}
              width={22}
              height={22}
              alt="user photo"
              className="rounded-full object-contain"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {author.name}
            </p>
          </Link>

          <div className="flex items-center justify-end gap-3">
            <Votes
              type="Question"
              itemId={JSON.stringify(_id)}
              userId={JSON.stringify(mongouser?._id)}
              upvotes={upvotes.length}
              hasupvote={upvotes.includes(mongouser?._id)}
              downvotes={downvotes.length}
              hasdownvote={downvotes.includes(mongouser?._id)}
              hasSaved={mongouser?.saved.includes(_id)}
            />
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex w-full flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock time"
          value={`asked ${getTimestamp(createdAt)}`}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: TagProps) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={id}
        userId={mongouser?._id}
        totalAnswers={answers?.length}
      />

      <Answer questionId={_id.toString()} authorId={mongouser?._id} />
    </>
  );
};

export default page;
