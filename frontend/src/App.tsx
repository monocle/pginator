import React from "react";
import useOutletContext from "./common/useOutletContext";
import Header from "./layout/Header";
import Tables from "./tables/Tables";

export default function App() {
  const { outlet } = useOutletContext();

  return (
    <div className="h-screen">
      <Header />

      <div className="h-minus-header container mx-auto flex bg-gray-100 px-2 pt-2 dark:bg-gray-900">
        <section
          className="w-3/12 overflow-y-scroll pr-2"
          data-testid="app-layout-left-column"
        >
          <Tables />
        </section>

        <section className="ml-4 w-9/12 overflow-y-scroll rounded-md bg-white px-2 pb-4 pt-2 shadow dark:bg-gray-800">
          {outlet}
        </section>
      </div>
    </div>
  );
}
