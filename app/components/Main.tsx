"use client";
import React from "react";

export default function Main() {
  const [input, setInput] = React.useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
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
      <button className="btn btn-primary">Link</button>
    </div>
  );
}
