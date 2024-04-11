"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import { VoteProps } from "@/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestoins } from "@/lib/actions/interaction.action";

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupvote,
  downvotes,
  hasdownvote,
  hasSaved,
}: VoteProps) => {
  const { toast } = useToast();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const main = async () => {
      await viewQuestoins({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      });
    };

    main();
  }, [path, router, userId, itemId]);

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });
    }

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvote,
          hasupVoted: hasupvote,
          path,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvote,
          hasupVoted: hasupvote,
          path,
        });
      }

      return toast({
        title: `Upvote ${!hasupvote ? "successful" : "Removed"}`,
        variant: !hasupvote ? "default" : "destructive",
      });
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvote,
          hasupVoted: hasupvote,
          path,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasdownvote,
          hasupVoted: hasupvote,
          path,
        });
      }

      return toast({
        title: `Downvote ${!hasupvote ? "Successful" : "Removed"}`,
        variant: !hasupvote ? "default" : "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });
    }
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path,
    });

    return toast({
      title: `Question ${!hasSaved ? "Saved in" : "Removed from"} your collection`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupvote
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => {
              handleVote("upvote");
            }}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownvote
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => {
              handleVote("downvote");
            }}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
