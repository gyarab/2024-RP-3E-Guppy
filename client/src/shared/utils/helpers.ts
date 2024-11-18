import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 * @param error - the error to check
 * @returns true if the error is a `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

interface ApiError {
  status: number;
  data: {
    message: string;
    statusCode: number;
    error: string;
  };
}

/**
 * Type predicate to narrow an unknown error to `ApiError`
 * @param error - the error to check
 * @returns true if the error is a `ApiError`
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    "data" in error &&
    typeof (error as any).data === "object" &&
    "message" in (error as any).data &&
    typeof (error as any).data.message === "string"
  );
}
/**
 * An abstraction for tag providing/invalidating
 * @param resultsWithIds - the result of a query
 * @param tagType - the type of the tag
 * @returns an array of tags
 * @example providesList(result, 'Review')
 */
export function providesList<
  R extends { id: string | number }[],
  T extends string
>(
  resultsWithIds: R | undefined,
  tagType: T
): { type: T; id: string | number }[] {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}
