import { useState, useCallback } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (method, url, data = null, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        ...options,
      };

      if (data && (method === 'post' || method === 'put' || method === 'patch')) {
        config.data = data;
      }

      const response = await API(config);
      return response.data;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      if (!options.silent) {
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, options) => callApi('get', url, null, options), [callApi]);
  const post = useCallback((url, data, options) => callApi('post', url, data, options), [callApi]);
  const put = useCallback((url, data, options) => callApi('put', url, data, options), [callApi]);
  const del = useCallback((url, options) => callApi('delete', url, null, options), [callApi]);

  return { loading, error, get, post, put, delete: del };
};