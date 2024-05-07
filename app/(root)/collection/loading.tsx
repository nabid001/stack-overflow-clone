import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="background-light5_dark5 h-14 flex-1" />
        <Skeleton className="background-light5_dark5 h-14 w-28" />
      </div>

      <div className="mt-11 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="background-light5_dark5 h-48 w-full rounded-xl"
          />
        ))}
      </div>
    </section>
  );
};

export default loading;
