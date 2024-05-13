import React from "react";
import {useState,useEffect} from 'react';
const useFetch = <T,>(url: RequestInfo, Option:RequestInit) => {
     const [isPending, setIsPending] = useState(true);

  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    setTimeout(() => {
      fetch(url,Option)
        .then((response) => {
          if (!response.ok)
            throw Error("could not Fetch the data for that fetch");

          return response.json();
        })
 
        .then((data) => {
          console.log(data);
          setData(data);
          setIsPending(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1000);
  }, [url]);

  return{data,isPending,setData}
}

export default useFetch;