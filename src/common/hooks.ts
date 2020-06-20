import { useState, useEffect } from "react";
function useFetch(url) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchUrl() {
    try {
      console.log(url);
      const response = await fetch("https://cors-anywhere.herokuapp.com" + url);
      console.log(response);
      const json = await response.json();
      console.log(json);
      setData(json);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [loading, data, error];
}
export { useFetch };
