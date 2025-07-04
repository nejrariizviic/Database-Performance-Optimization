import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import Posts from "./pages/Posts";
import AddUser from "./pages/AddUser";
import { UserPostContextProvider } from "./context/UserPostContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "add-post/:userId",
        element: <AddPost />,
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
    ],
  },
]);

function App() {
  return (
    <UserPostContextProvider>
      <RouterProvider router={router} />
    </UserPostContextProvider>
  );
}

export default App;