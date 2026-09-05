import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export const anyThing = (x: any) => x;

export function Name({ first, last }: { first: string; last: string }) {
  const [full, setFull] = useState("");
  useEffect(() => {
    setFull(first + last);
  }, [first, last]);
  return <span>{full}</span>;
}

export function Thing({ id }: { id: string }) {
  return useQuery({ queryKey: ["thing"], queryFn: () => fetch("/api/" + id) });
}
