import React, { ReactNode, createContext, useState } from "react";
import { ReactSetter } from "../interface";

const ModalContext = createContext<{
  modal: JSX.Element | null;
  setModal: ReactSetter<JSX.Element | null>;
  exitModal: () => void;
}>({
  modal: null,
  setModal: () => {},
  exitModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<JSX.Element | null>(null);
  const exitModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ modal, setModal, exitModal }}>
      {children}
      {!!modal && <div className="modal">{modal}</div>}
    </ModalContext.Provider>
  );
}

export default ModalContext;
