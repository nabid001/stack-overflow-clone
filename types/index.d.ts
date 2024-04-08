import { BADGE_CRITERIA } from "@/constants";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export type CreateUserProps = {
  clerkId: string,
  name: string,
  username: string,
  email: string,
  picture: string
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export type TagProps = {
  _id: string;
  name: string;
};

export type VoteProps = {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupvote: boolean;
  downvotes: number;
  hasdownvote: boolean;
  hasSaved?: boolean;
};

export type ToggleSaveQuestionProps = {
  userId: string;
  questionId: string;
  hasSaved: boolean;
  path: string;
}