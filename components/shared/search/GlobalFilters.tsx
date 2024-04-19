"use client";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCLick = (value: string) => {
    if (searchParams.get("type") === value) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      {GlobalSearchFilters.map((item) => {
        const isActive = searchParams.get("type") === item.value;
        return (
          <Button
            key={item.value}
            onClick={() => handleCLick(item.value)}
            className={`light-border-2 small-regular rounded-xl px-4 py-1.5 capitalize dark:text-light-800 dark:hover:text-primary-500 ${isActive ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"}`}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default GlobalFilters;
