import React from "react";
import { useFetch } from "../common/hooks";
function Photos({ url }) {
  console.log(url);
  const [loading, error, data] = useFetch(url);
  console.log(loading, error, data);
  return (
    <>
      <h1>Photos</h1>
      {loading && "Loading..."}
      {error && error}
      {data && Array.isArray(data) && (
        <ul>
          {data.map(({ id, title, url }) => (
            <li key={`photo-${id}`}>
              <img alt={title} src={url} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default Photos;
