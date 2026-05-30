import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import { RegisterCompanyPayload, RegisterResponse } from "../types";

export const registerCompany = async (
  payload: RegisterCompanyPayload
): Promise<RegisterResponse> => {
  console.log("register payload", payload);
  const response = await api.post(ENDPOINT.REGISTER, payload);

  return response.data;
};
