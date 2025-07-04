import { createContext, useEffect, useState, type ReactNode } from "react";

type UserPostContextType = {
  createdUserId: string | null;
  createdPostId: string | null;
  setUserId: (id: string) => void;
  setPostId: (id: string) => void;
};

const UserPostContext = createContext<UserPostContextType | undefined>(
  undefined
);

function UserPostContextProvider({ children }: { children: ReactNode }) {
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("createdUserId");
    const storedPostId = localStorage.getItem("createdPostId");

    if (storedUserId) setCreatedUserId(storedUserId);
    if (storedPostId) setCreatedPostId(storedPostId);
  }, []);

  const setUserId = (id: string | null) => {
    if (id) {
      localStorage.setItem("createdUserId", id);
    } else {
      localStorage.removeItem("createdUserId");
    }
    setCreatedUserId(id);
  };

  const setPostId = (id: string | null) => {
    if (id) {
      localStorage.setItem("createdPostId", id);
    } else {
      localStorage.removeItem("createdPostId");
    }
    setCreatedPostId(id);
  };

  return (
    <UserPostContext.Provider
      value={{ createdUserId, createdPostId, setUserId, setPostId }}
    >
      {children}
    </UserPostContext.Provider>
  );
}

export { UserPostContextProvider, UserPostContext };
