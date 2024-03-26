import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h1-bold flex-center min-h-screen flex-col gap-9">
      Home
      <SignedOut>
        <Link href="/sign-up">Sign Up</Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default page;
