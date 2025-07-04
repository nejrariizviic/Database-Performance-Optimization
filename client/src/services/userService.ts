import type { UserType } from "../types/user.types";
import { apiClient } from "./postService";

export async function GetTopCommentators() {
  const res = await apiClient.get("users/popular-commentators");
  return res.data;
}

export async function CreateUserAsync(data: UserType) {
  const res = await apiClient.post("users/insert-with-default-post", data);
  return res.data;
}

export async function DeleteUserAsync(userId: number) {
  const res = await apiClient.delete(`users/delete-user/${userId}`);
  return res.data;
}
