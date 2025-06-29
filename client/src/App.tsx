import { useState } from "react";

function App() {
  const [value, setValue] = useState<number>(0);

  const handleClick = () => {
    setValue((n) => n + 1);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col gap-4 items-center justify-center">
      <p className="bg-primary p-4">Hello world {value} times!</p>
      <button className="btn btn-primary" onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}

export default App;