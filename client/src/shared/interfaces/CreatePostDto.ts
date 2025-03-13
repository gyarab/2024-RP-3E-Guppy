export interface CreatePostDto {
  orgId: number;
  title: string;
  content: string;
  tags?: string[];
}
