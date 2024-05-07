import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <section>
      <Skeleton className="background-light5_dark5 h-11 w-48" />
    </section>
  );
};

export default loading;
