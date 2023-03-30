import { useIsFetching } from "@tanstack/react-query";
import Tables from "./tables/components/Tables";
import Loading from "./common/components/Loading";

export default function App() {
  const numFetching = useIsFetching();

  return (
    <div className="App">
      <h1>PGinator</h1>
      {numFetching > 0 && <Loading />}
      <Tables />
    </div>
  );
}
