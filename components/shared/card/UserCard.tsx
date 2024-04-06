import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { interactedTag } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";

type UserCardProps = {
  clerkId: string;
  name: string;
  username: string;
  imgUrl: string;
};

const UserCard = async ({ clerkId, name, username, imgUrl }: UserCardProps) => {
  const interactedTags = await interactedTag({ clerkId });
  return (
    <>
      <Link
        href={`/profile/${clerkId}`}
        className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
      >
        <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
          <Image
            src={imgUrl}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />

          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{username}
            </p>
          </div>

          <div className="mt-5">
            {interactedTags.length > 0 ? (
              <div className="flex items-center gap-2">
                {interactedTags.map((tag) => (
                  <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
              </div>
            ) : (
              <Badge>No tags yet</Badge>
            )}
          </div>
        </article>
      </Link>
    </>
  );
};

export default UserCard;
