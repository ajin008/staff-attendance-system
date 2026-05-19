export const getErrorMessage = (err: unknown): string => {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? "Something went wrong"
  );
};
