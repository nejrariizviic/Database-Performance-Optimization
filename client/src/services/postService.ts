import axios from "axios";
import type { CreatePost } from "../types/posts.types";

export const apiClient = axios.create({
  baseURL: "https://localhost:7001/api/",
});

export async function GetTopPostsByYear() {
  const res = await apiClient.get("posts/popular-posts-by-year");
  return res.data;
}

export async function CreatePostAsync(userId: number, data: CreatePost) {
  const res = await apiClient.post("posts", data, {
    params: {
      userId,
    },
  });
  return res.data;
}

export async function DeletePostAsync(postId: number) {
  const res = await apiClient.delete(`posts/delete-post/${postId}`);
  return res.data;
}

export async function UpdatePostsViews() {
  const res = await apiClient.put("posts/update-views-on-posts-with-comments");
  return res.data;
}

export async function UpdatePostsScore() {
  const res = await apiClient.put("posts/update-posts-based-on-score");
  return res.data;
}
