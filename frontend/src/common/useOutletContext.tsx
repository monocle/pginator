import React, { ReactNode, createContext, useState, useContext } from "react";

type OutletContextType = {
  outlet: JSX.Element | null;
  setOutlet: (element: JSX.Element | null) => void;
  goBack: () => void;
};

const OutletContext = createContext<OutletContextType | null>(null);

export function OutletProvider({ children }: { children: ReactNode }) {
  const [outlet, setOutletState] = useState<JSX.Element | null>(null);
  const [componentStack, setComponentStack] = useState<JSX.Element[]>([]);

  const setOutlet = (element: JSX.Element | null) => {
    if (element) {
      setComponentStack([...componentStack, element]);
    }
    setOutletState(element);
  };

  const goBack = () => {
    const newStack = componentStack.slice(0, -1);

    if (newStack.length > 0) {
      const prevComponent = newStack.at(-1);

      setOutletState(prevComponent ?? null);
      setComponentStack(newStack);
    }
  };

  const value = { outlet, setOutlet, goBack };

  return (
    <OutletContext.Provider value={value}>{children}</OutletContext.Provider>
  );
}

export default function useOutletContext() {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error("useOutletContext must be used within an OutletProvider");
  }
  return context;
}
