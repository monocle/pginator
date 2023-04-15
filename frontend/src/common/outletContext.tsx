import { ReactNode, createContext, useState } from "react";
import { ReactSetter } from "../interface";

const OutletContext = createContext<{
  outlet: JSX.Element | null;
  setOutlet: (element: JSX.Element | null) => void;
  resetOutlet: () => void;
}>({
  outlet: null,
  setOutlet: () => {},
  resetOutlet: () => {},
});

export function OutletProvider({ children }: { children: ReactNode }) {
  const [outlet, _setOutlet] = useState<JSX.Element | null>(null);
  const [prevComponent, setPrevComponent] = useState<JSX.Element | null>(null);
  const resetOutlet = () => _setOutlet(prevComponent);

  const setOutlet = (element: JSX.Element | null) => {
    setPrevComponent(outlet);
    _setOutlet(element ?? prevComponent);
  };

  return (
    <OutletContext.Provider value={{ outlet, setOutlet, resetOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}

export default OutletContext;
