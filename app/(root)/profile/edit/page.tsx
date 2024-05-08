import React from "react";
import Profile from "@/components/shared/form/Profile";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";

const ProfileEdit = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById(userId as string);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-11">
        <Profile
          userDetails={JSON.stringify(mongoUser)}
          clerkId={JSON.stringify(userId)}
        />
      </div>
    </>
  );
};

export default ProfileEdit;
