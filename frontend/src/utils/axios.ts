// src/utils/axios.ts
import { AxiosError } from "axios";

export const getErrorMessage = (err: unknown): string => {
  // Handle Axios error
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axiosError = err as AxiosError;

    // Get the response data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = axiosError.response?.data as any;

    // Return backend message if exists
    if (responseData?.message) {
      return responseData.message;
    }

    // Return status text if available
    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }
  }

  // Handle regular Error object
  if (err instanceof Error) {
    return err.message;
  }

  // Handle string error
  if (typeof err === "string") {
    return err;
  }

  return "Something went wrong";
};
