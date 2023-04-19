import { useContext } from "react";
import OutletContext from "./common/outletContext";
import Header from "./layout/Header";
import Tables from "./tables/Tables";

export default function App() {
  const { outlet } = useContext(OutletContext);

  return (
    <>
      <Header />
      <div className="container mx-auto flex max-w-screen-xl bg-gray-100 px-6 pt-6 dark:bg-gray-900">
        <div className="h-screen w-3/12 overflow-y-scroll pr-2">
          <Tables />
        </div>
        <div className="ml-4 h-screen w-9/12 overflow-y-scroll rounded-md bg-white p-6 shadow dark:bg-gray-800">
          {outlet}
        </div>
      </div>
    </>
  );
}
