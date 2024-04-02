import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/card/QuestionCard";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    tags: [
      { _id: "101", name: "Next.js" },
      { _id: "102", name: "React" },
    ],
    author: {
      _id: "201",
      name: "John Doe",
      picture: "/avatar.jpg",
      clerkId: "3828f2s",
    },
    upvotes: ["10"],
    views: 100,
    answers: [],
    createdAt: new Date("2024-03-12T12:00:00"),
  },
  {
    _id: "1",
    title: "How to center a div in CSS?",
    tags: [
      { _id: "101", name: "Next.js" },
      { _id: "102", name: "React" },
    ],
    author: {
      _id: "201",
      name: "John Doe",
      picture: "/avatar.jpg",
      clerkId: "3828f2",
    },
    upvotes: ["10"],
    views: 100,
    answers: [],
    createdAt: new Date("2024-03-12T12:00:00"),
  },
];

const page = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Question</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-11 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              author={question.author}
              tags={question.tags}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;
