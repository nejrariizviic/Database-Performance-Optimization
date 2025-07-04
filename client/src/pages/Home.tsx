import { useEffect, useState } from "react";
import { GetTopCommentators } from "../services/userService";
import { Card, Spinner } from "flowbite-react";
import type { PopularCommentators } from "../types/user.types";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [topCommentators, setTopCommentators] =
    useState<PopularCommentators[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getTopCommentators() {
      try {
        setLoading(true);

        const data = await GetTopCommentators();
        setTopCommentators(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getTopCommentators();
  }, []);

  const navigateTo = (userId: number) => {
    navigate(`/add-post/${userId}`);
  };

  return (
    <div className="flex flex-col flex-grow-1 px-12 py-2 gap-3 h-full">
      <h2 className="text-xl font-bold">Top Commentators</h2>
      {topCommentators !== undefined
        ? topCommentators.map((item) => (
            <Card
              onClick={() => navigateTo(item.id)}
              key={item.id}
              className="!p-0 !bg-gray-400 cursor-pointer"
            >
              <div className="!p-0 flex justify-between">
                <h5 className="text-lg font-bold text-white">
                  {item.displayName}
                </h5>
                <p className="font-normal text-gray-700">
                  {item.commentsCount ?? 0}
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

export default Home;
