import { useIsFetching } from "@tanstack/react-query";

export default function Header() {
  const numFetching = useIsFetching();

  return (
    <header className="font-heading">
      <nav className="flex w-full justify-between px-4 py-2">
        <div className="flex text-xl font-semibold text-white">PGinator</div>
        <div className="flex items-center">
          {numFetching > 0 && (
            <div className="bg-gray-700 p-1 px-4 py-1 text-sm dark:bg-gray-600">
              Loading...
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
