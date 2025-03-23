import { PollOption } from "./Post";

export interface CreatePostDto {
  orgId: number;
  title: string;
  content: string;
  tags?: string[];
  pollData?: {
    options: PollOption[];
  } | null;
}
