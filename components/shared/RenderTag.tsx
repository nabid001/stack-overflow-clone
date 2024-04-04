import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = {
  _id: string;
  name: string;
  topQuestions?: number;
  showCount?: boolean;
};

const RenderTag = ({ _id, name, topQuestions, showCount }: Props) => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="flex items-center justify-between gap-7"
    >
      <Badge className="subtle-medium background-light800_dark300 text-dark400_light500 rounded-md border-none px-4 py-2 uppercase shadow dark:shadow-none">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{topQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
