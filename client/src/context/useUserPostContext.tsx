import { useContext } from "react";
import { UserPostContext } from "./UserPostContext";

function useUserPostContext() {
  const context = useContext(UserPostContext);
  if (!context) {
    throw new Error("Out of context");
  }
  return context;
}

export { useUserPostContext };
