import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "./interface";

const apiPrefix = "api/v1/";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiPath = "tables" | `tables/${string}`;
type QueryKey = [string, ApiPath, HttpMethod?, Object?];

async function apiQuery({ queryKey }: { queryKey: QueryKey }) {
  const [_, path, method, body] = queryKey;
  const init: RequestInit = {};

  init.method = method ?? "GET";
  if (!init.headers) init.headers = { "Content-Type": "application/json" };
  if (body) init.body = JSON.stringify(body);

  return fetch(apiPrefix + path, init).then(async (res) => {
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

export function useApiMutation<T>(queryKeyToInvalidate: string[]) {
  const queryClient = useQueryClient();

  return useMutation<T, ErrorResponse, { queryKey: QueryKey }, any>({
    mutationFn: apiQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    },
  });
}
