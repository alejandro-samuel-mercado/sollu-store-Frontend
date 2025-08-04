import { useState, useEffect, useCallback } from "react";
import { getCachedData } from "../utils/apiCache";

export const useFetch = (
  fetchFn,
  cacheKey,
  dependencies = [],
  options = {}
) => {
  const { immediate = true } = options;

  if (typeof fetchFn !== "function") {
    console.error(`fetchFn para ${cacheKey} no es una función:`, fetchFn);
    throw new Error(`fetchFn debe ser una función para cacheKey: ${cacheKey}`);
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout en ${cacheKey}`)), 30000)
      );
      const response = await Promise.race([
        getCachedData(cacheKey, fetchFn),
        timeoutPromise,
      ]);
      console.log(`Datos recibidos para ${cacheKey}:`, response.data);
      setData(response.data || null);
      return { data: response.data || null };
    } catch (err) {
      console.error(`Error en ${cacheKey}:`, err);
      setError(err.message || "Error fetching data");
      setData(null);
      return { data: null };
    } finally {
      setLoading(false);
    }
  }, [fetchFn, cacheKey]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};
