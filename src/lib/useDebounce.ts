import { useEffect, useState } from "react";

function useDebounce(value: String, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    // Creating a handler
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    // If any changes made again
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
}

export default useDebounce;
