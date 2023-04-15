import { useIsFetching } from "@tanstack/react-query";

export default function Header() {
  const numFetching = useIsFetching();

  return (
    <header className="font-heading">
      <nav className="flex w-full justify-between px-4 py-1">
        <div className="flex text-sm font-semibold text-white">PGinator</div>
        <div className="flex items-center">
          {numFetching > 0 && (
            <div className="bg-gray-700 px-4 text-sm dark:bg-gray-600">
              Loading...
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
