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
  const [defaultComponent, setDefaultComponent] = useState<JSX.Element | null>(
    null
  );
  const resetOutlet = () => _setOutlet(defaultComponent);

  const setOutlet = (element: JSX.Element | null) => {
    if (!defaultComponent) setDefaultComponent(element);
    _setOutlet(element ?? defaultComponent);
  };

  return (
    <OutletContext.Provider value={{ outlet, setOutlet, resetOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}

export default OutletContext;
