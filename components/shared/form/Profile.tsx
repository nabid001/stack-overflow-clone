"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { ProfileEditSchema } from "@/lib/validation";

type Props = {
  userDetails: string;
  clerkId: string;
};
const Profile = ({ userDetails, clerkId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const parsedUserDetails = JSON.parse(userDetails) || "";

  const form = useForm<z.infer<typeof ProfileEditSchema>>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      fullName: parsedUserDetails.name || "",
      username: parsedUserDetails.username || "",
      portfolioLink: parsedUserDetails.portfolioWebsite || "",
      location: parsedUserDetails.location || "",
      bio: parsedUserDetails.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileEditSchema>) {
    try {
      setIsSubmitting(true);

      await updateUserProfile({
        clerkId: JSON.parse(clerkId),
        name: values.fullName,
        username: values.username,
        portfolioWebsite: values.portfolioLink,
        location: values.location,
        bio: values.bio,
        pathname,
      });

      form.reset();
      router.back();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Full Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="background-light800_dark300 no-focus paragraph-regular light-border-2 text-dark400_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="background-light800_dark300 no-focus paragraph-regular light-border-2 text-dark400_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  className="background-light800_dark300 no-focus paragraph-regular light-border-2 text-dark400_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Location <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="background-light800_dark300 no-focus paragraph-regular light-border-2 text-dark400_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="background-light800_dark300 no-focus paragraph-regular light-border-2 text-dark400_light700 min-h-[190px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end ">
          <Button
            type="submit"
            className="primary-gradient w-fit  !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
