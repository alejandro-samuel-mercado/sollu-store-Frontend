import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(true);
  return { loading, setLoading };
};