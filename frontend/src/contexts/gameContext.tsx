import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type GameContextType = {
  name: string;
  setName: (name: string) => void;
};

const GameContext = createContext<GameContextType | null>(null);

const useGameContext = () => {
  const currentGameContext = useContext(GameContext);
  if (!currentGameContext) {
    throw new Error(
      "useGameContext has to be used within <GameContextProvider>"
    );
  }
  return currentGameContext;
};

const GameContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [name, setName] = useState("");

  return (
    <GameContext.Provider value={{ name, setName }}>
      {children}
    </GameContext.Provider>
  );
};

export { useGameContext, GameContextProvider };
