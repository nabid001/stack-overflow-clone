"use client";

import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const HomeFilters = () => {
  const active = false;
  return (
    <div className="mt-11 flex flex-wrap gap-3 max-md:hidden">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }
            `}
        >
          <Badge>{item.name}</Badge>
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
