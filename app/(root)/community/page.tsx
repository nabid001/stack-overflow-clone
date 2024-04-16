import Filters from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import UserCard from "@/components/shared/card/UserCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUser } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";

const page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUser({
    page: 1,
    pageSize: 20,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex items-center justify-between gap-5">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by username..."
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-11 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => (
            <UserCard
              key={user._id}
              clerkId={user.clerkId}
              imgUrl={user.picture}
              name={user.name}
              username={user.username}
            />
          ))
        ) : (
          <NoResult
            title="There's no users eat."
            description="Join to be the first 🚀"
            link="/sign-up"
            linkTitle="Create Account"
          />
        )}
      </section>
    </>
  );
};

export default page;
