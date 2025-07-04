import { useEffect, useState } from "react";
import type { PopularPosts } from "../types/posts.types";
import { GetTopPostsByYear } from "../services/postService";
import { Card, Spinner } from "flowbite-react";

const Posts = () => {
  const [topCommentators, setTopCommentators] = useState<PopularPosts[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function GetTopPosts() {
      try {
        setLoading(true);

        const data = await GetTopPostsByYear();
        setTopCommentators(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    GetTopPosts();
  }, []);

  return (
    <div className="flex flex-col flex-grow-1 px-12 py-2 gap-3 h-full">
      <h2 className="text-xl font-bold">Top Posts By Year</h2>
      {topCommentators !== undefined
        ? topCommentators.map((item) => (
            <Card key={item.id} className="!p-0 !bg-gray-400 cursor-pointer">
              <div className="!p-0 flex justify-between">
                <div className="flex flex-col">
                  <h5 className="text-lg font-bold text-white">{item.title}</h5>
                  <h6>By: {item.displayNameAttribute}</h6>
                </div>
                <p className="font-normal text-gray-700">
                  {item.viewCount ?? 0}
                </p>
              </div>
            </Card>
          ))
        : loading && (
            <div className="h-full w-full flex justify-center items-center">
              <Spinner aria-label="Default status example" />
            </div>
          )}
    </div>
  );
};

export default Posts;
