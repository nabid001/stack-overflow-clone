import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <section className="">
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex items-center justify-between gap-5">
        <Skeleton className="background-light5_dark5 h-14 flex-1" />
        <Skeleton className="background-light5_dark5 h-14 w-28" />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="background-light5_dark5 h-60 w-full rounded-2xl sm:w-[260px]"
          />
        ))}
      </div>
    </section>
  );
};

export default loading;
