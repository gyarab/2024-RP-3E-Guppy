import { createSearchParams, useNavigate } from "react-router-dom";

// Custom Hook for Navigation with Search Params
export const useNavigateWithParams = () => {
  const navigate = useNavigate();

  return (pathname: string, params: Record<string, string | string[]>) => {
    navigate({
      pathname,
      search: createSearchParams(params).toString(),
    });
  };
};
