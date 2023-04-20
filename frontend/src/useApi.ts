import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "./interface";
import OutletContext from "./common/outletContext";

const apiPrefix = "api/v1/";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiPath =
  | "tables"
  | `tables/${string}`
  | "rows"
  | `rows/${string}`
  | `rows/${string}/${string}`;

type QueryKey = [
  string,
  ApiPath,
  HttpMethod?,
  Object?,
  Record<string, string>?
];

async function apiQuery({ queryKey }: { queryKey: QueryKey }) {
  const [_, path, method, body, queryParams] = queryKey;
  let fullPath = window.location.origin + "/" + apiPrefix + path;
  const init: RequestInit = {
    method: method ?? "GET",
    headers: { "Content-Type": "application/json" },
  };

  if (body) init.body = JSON.stringify(body);

  if (queryParams) {
    fullPath += "?" + new URLSearchParams(queryParams).toString();
  }

  return fetch(fullPath, init).then(async (res) => {
    if (res.status >= 500)
      throw new Error("There was a problem with the server.");
    if (!res.ok) throw await res.json();

    try {
      return await res.json();
    } catch (error) {
      if (error instanceof SyntaxError) return null;
      throw error;
    }
  });
}

export function useGetRequest<T>(queryKey: QueryKey) {
  return useQuery<T, ErrorResponse, T, QueryKey>({
    queryKey,
    queryFn: apiQuery,
  });
}

export function useApiMutation<T>(
  queryKeyToInvalidate: string[],
  resetOutletOnSuccess = false
) {
  const queryClient = useQueryClient();
  const { resetOutlet } = useContext(OutletContext);

  return useMutation<T, ErrorResponse, { queryKey: QueryKey }, any>({
    mutationFn: apiQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });

      if (resetOutletOnSuccess) {
        resetOutlet();
      }
    },
  });
}
