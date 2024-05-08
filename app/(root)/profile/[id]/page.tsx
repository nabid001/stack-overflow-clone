import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import { redirect } from "next/navigation";
import { URLProps } from "@/types";

const Profile = async ({ params: { id }, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    redirect("/sign-up");
  }
  const result = await getUserInfo({ userId: id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={result?.user.picture}
            width={140}
            height={140}
            alt={result?.user.username}
            className="cursor-pointer rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {result.user.name}
            </h2>
            <p className="text-dark200_light800 paragraph-medium">
              @{result.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {result.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={result.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {result.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={result.user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(result.user.joinedAt)}
              />
            </div>
            {result.user.bio && (
              <p className="text-dark400_light800 paragraph-semibold mt-5">
                {result.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === result.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium text-dark300_light900 btn-secondary min-h-[47px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={result.totalQuestions}
        totalAnswers={result.totalAnswers}
        badgeCount={result.badgeCounts}
        reputation={result.user.reputation}
      />

      <div className=" mt-11 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              clerkId={clerkId}
              searchParams={searchParams}
              userId={result.user._id}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              clerkId={clerkId}
              searchParams={searchParams}
              userId={result.user._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
