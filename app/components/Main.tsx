"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  // State to hold the parsed button configurations including names
  const [buttons, setButtons] = useState([]);

  // Function to handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  // Effect to parse button URLs and names from the query parameters
  useEffect(() => {
    const buttonTemplates = searchParams.get("buttons");
    if (buttonTemplates) {
      try {
        // Parse the URL-encoded JSON array
        const parsedTemplates = JSON.parse(decodeURIComponent(buttonTemplates));
        const preparedTemplates = parsedTemplates.map(({ name, link }) => ({
          name: name,
          link: link.replace(/\*/g, "${input}"), // Replace '*' with '${input}' for template literals
        }));
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

      <div className="flex flex-col gap-4 mt-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button.link)}
            className="btn btn-primary"
          >
            Go to {button.name} {/* Display the name of the link */}
          </button>
        ))}
      </div>
    </div>
  );
}
