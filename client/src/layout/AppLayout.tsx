import {
  Button,
  Navbar,
  NavbarBrand,
  Sidebar,
  SidebarCTA,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Toast,
  ToastToggle,
} from "flowbite-react";
import { Link, Outlet } from "react-router";
import {
  HiChartPie,
  HiOutlineUserAdd,
  HiDocumentReport,
  HiCheck,
} from "react-icons/hi";
import { useState } from "react";
import { DeleteUserAsync } from "../services/userService";
import {
  DeletePostAsync,
  UpdatePostsScore,
  UpdatePostsViews,
} from "../services/postService";
import { AddIndexes, DropIndexes } from "../services/dbService";
import FlowbiteDrawer from "./FlowbiteDrawer";
import { useUserPostContext } from "../context/useUserPostContext";

const AppLayout = () => {
  const { createdPostId, setPostId, setUserId, createdUserId } =
    useUserPostContext();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbType, setDbType] = useState<string>(
    localStorage.getItem("db") ?? ""
  );

  const deleteUser = async () => {
    if (createdUserId) {
      await DeleteUserAsync(parseInt(createdUserId));
      setUserId("");
    }
  };

  const deletePost = async () => {
    if (createdPostId) {
      await DeletePostAsync(parseInt(createdPostId));
      localStorage.removeItem("createdPostId");
      setPostId("");
    }
  };

  const updatePostsViews = async () => {
    try {
      setIsLoading(true);
      await UpdatePostsViews();
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePostsScore = async () => {
    try {
      setIsLoading(true);
      await UpdatePostsScore();
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrDropIndexes = async () => {
    try {
      setIsLoading(true);
      const typeOfRequest = localStorage.getItem("db");
      if (typeOfRequest === "optimized") {
        await DropIndexes();
        localStorage.setItem("db", "");
        setDbType("");
      } else {
        await AddIndexes();
        localStorage.setItem("db", "optimized");
        setDbType("optimized");
      }
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDrawerClick = () => {
    setShowDrawer(true);
  };

  return (
    <div className="h-screen w-full ">
      <div className="flex h-full w-full flex-col">
        <Navbar fluid className="p-5 text-gray-100 w-full">
          <NavbarBrand className="w-full">
            <div className="flex justify-between w-full">
              <div className="flex gap-12 items-center">
                <h2>Database Query Application</h2>
                <Button
                  onClick={addOrDropIndexes}
                  disabled={isLoading}
                  className="!bg-green-400"
                >
                  Use {dbType === "" ? "Optimized" : "Unoptimized"} Database
                </Button>
              </div>
              {isSuccess && (
                <Toast className="p-1 ml-auto">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                    <HiCheck className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">
                    Request returned: Success.
                  </div>
                  <ToastToggle />
                </Toast>
              )}
            </div>
          </NavbarBrand>
        </Navbar>
        <div className="flex flex-grow-1 gap-1">
          <Sidebar className="!bg-gray-400">
            <SidebarItems>
              <SidebarItemGroup>
                <SidebarItem as={Link} icon={HiChartPie}>
                  Home
                </SidebarItem>
                <SidebarItem
                  as={(props) => <Link to="posts" {...props} />}
                  icon={HiDocumentReport}
                >
                  Posts
                </SidebarItem>
                <SidebarItem
                  as={(props) => <Link to="add-user" {...props} />}
                  icon={HiOutlineUserAdd}
                >
                  Add User
                </SidebarItem>
              </SidebarItemGroup>
            </SidebarItems>
            <SidebarCTA>
              <Button
                onClick={updatePostsViews}
                disabled={isLoading}
                className="!bg-yellow-500 mx-auto cursor-pointer"
              >
                Update Views On Posts
              </Button>
            </SidebarCTA>

            <SidebarCTA>
              <Button
                onClick={updatePostsScore}
                disabled={isLoading}
                className="!bg-yellow-500 mx-auto cursor-pointer"
              >
                Update Score On Posts
              </Button>
            </SidebarCTA>
            {createdUserId !== null && createdUserId !== "" && (
              <SidebarCTA>
                <Button
                  onClick={deleteUser}
                  disabled={isLoading}
                  className="!bg-red-500 mx-auto cursor-pointer"
                >
                  Delete User
                </Button>
              </SidebarCTA>
            )}
            {createdPostId !== null && createdPostId !== "" && (
              <SidebarCTA>
                <Button
                  disabled={isLoading}
                  onClick={deletePost}
                  className="!bg-red-500 mx-auto cursor-pointer"
                >
                  Delete Post
                </Button>
              </SidebarCTA>
            )}

            <SidebarCTA>
              <Button
                disabled={isLoading}
                onClick={showDrawerClick}
                className="!bg-blue-500 mx-auto cursor-pointer"
              >
                Show Metrics
              </Button>
            </SidebarCTA>

            {showDrawer && (
              <FlowbiteDrawer isOpen={showDrawer} onCloseFn={setShowDrawer} />
            )}
          </Sidebar>
          <div className="bg-gray-300 flex-grow-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
