"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [buttons, setButtons] = useState([]); // State to hold the parsed button configurations

  // Function to handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  // Effect to parse button URLs from the query parameters and prepare them for rendering
  useEffect(() => {
    const buttonTemplates = searchParams.get("buttons");
    if (buttonTemplates) {
      try {
        // Parse the URL-encoded JSON array and replace '*' with '${input}' for template literals
        const parsedTemplates = JSON.parse(decodeURIComponent(buttonTemplates));
        const preparedTemplates = parsedTemplates.map((template) =>
          template.replace(/\*/g, "${input}")
        );
        setButtons(preparedTemplates);
      } catch (error) {
        console.error("Error parsing buttons parameter:", error);
      }
    }
  }, [searchParams]); // Depend on searchParams to re-run this effect when searchParams change

  // Function to handle button click: Opens the specified URL in a new tab
  function handleButtonClick(buttonLink) {
    const url = eval("`" + buttonLink + "`"); // Use template literal to insert input
    window.open(url, "_blank");
  }

  return (
    <div>
      <h1>Main</h1>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={input}
        onChange={handleChange}
      />
      {buttons.map((buttonLink, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(buttonLink)}
          className="btn btn-primary"
        >
          Go to Link {index + 1}
        </button>
      ))}
    </div>
  );
}
