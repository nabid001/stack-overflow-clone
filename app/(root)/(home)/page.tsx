import { SignedIn, UserProfile } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className=" flex-center min-h-screen flex-col gap-9">
      Home
      <SignedIn>
        <UserProfile />
      </SignedIn>
    </div>
  );
};

export default page;
