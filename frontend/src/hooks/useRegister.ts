import { RegisterCompanyPayload } from "./../types/index";
import { useState } from "react";
import { registerCompany } from "../services/register.service";
import { getErrorMessage } from "../utils/axios";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (payload: RegisterCompanyPayload) => {
    try {
      setLoading(true);
      setError("");

      const data = await registerCompany(payload);

      return data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    loading,
    error,
  };
};
