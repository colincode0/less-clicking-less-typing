"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const searchParams = useSearchParams();
  const buttons = searchParams.get("buttons");

  console.log(buttons);

  const [input, setInput] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleClick() {
    const url = `https://stockcharts.com/sc3/ui/?s=${input}`;
    window.open(url, "_blank");
  }

  return (
    <div>
      Main
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={input}
        onChange={handleChange}
      />
      <button onClick={handleClick} className="btn btn-primary">
        Go to Link
      </button>
    </div>
  );
}
