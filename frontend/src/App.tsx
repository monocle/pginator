import { useContext } from "react";
import OutletContext from "./common/outletContext";
import Header from "./layout/Header";
import Tables from "./tables/components/Tables";

export default function App() {
  const { outlet } = useContext(OutletContext);

  return (
    <>
      <Header />
      <div className="max-w-screen-xlg container mx-auto flex bg-white px-6 dark:bg-gray-900">
        <div className="w-4/12">
          <Tables />
        </div>
        <div className="w-8/12">{outlet}</div>
      </div>
    </>
  );
}
