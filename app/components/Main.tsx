"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Ensure correct import

// Define a type for the button configuration
type ButtonConfig = {
  name: string;
  link: string;
};

export default function Main() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newLink, setNewLink] = useState<string>("");
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [addingButton, setAddingButton] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  const handleNewTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value);
  };

  useEffect(() => {
    const buttonTemplates = searchParams.get("buttons");
    if (buttonTemplates) {
      try {
        const parsedTemplates: ButtonConfig[] = JSON.parse(
          decodeURIComponent(buttonTemplates)
        );
        const preparedTemplates = parsedTemplates.map(({ name, link }) => ({
          name,
          link: link.replace(/\*/g, "${input}"),
        }));
        setButtons(preparedTemplates);
      } catch (error) {
        console.error("Error parsing buttons parameter:", error);
      }
    }
  }, [searchParams]);

  function handleButtonClick(buttonLink: string) {
    const url = eval("`" + buttonLink + "`");
    window.open(url, "_blank");
  }

  function handleRemoveButton(index: number) {
    const updatedButtons = buttons.filter((_, i) => i !== index);
    setButtons(updatedButtons);
    router.push(
      `/?buttons=${encodeURIComponent(JSON.stringify(updatedButtons))}`,
      undefined
    );
  }

  return (
    <div>
      <h1>Main</h1>
      <input
        type="text"
        placeholder="Add a ticker here to view link buttons"
        className="input input-bordered w-full max-w-xs"
        value={input}
        onChange={handleChange}
      />
      <div className="flex flex-col gap-4 mt-4">
        {input &&
          buttons.map((button, index) => (
            <div key={index} className="flex items-center">
              <button
                className="btn btn-error mr-2"
                onClick={() => handleRemoveButton(index)}
                title="Remove Button"
              >
                X
              </button>
              <button
                onClick={() => handleButtonClick(button.link)}
                className="btn btn-primary"
              >
                Go to {button.name}
              </button>
            </div>
          ))}
        <button
          onClick={() => setAddingButton(!addingButton)}
          className="btn btn-secondary"
        >
          {addingButton ? "Cancel" : "Add A New Link Button"}
        </button>
        {addingButton && (
          <>
            <div>Title</div>
            <input
              type="text"
              placeholder="Button Title"
              className="input input-bordered w-full max-w-xs"
              value={newTitle}
              onChange={handleNewTitleChange}
            />
            <div>
              You must edit your link so that the * character replaces ticker in
              the url wherever the ticker appears.
            </div>
            {`https://stockcharts.com/sc3/ui/?s=AAPL -> https://stockcharts.com/sc3/ui/?s=*`}
            <input
              type="text"
              placeholder="New Link"
              className="input input-bordered w-full max-w-xs"
              value={newLink}
              onChange={handleNewLinkChange}
            />
            <button
              onClick={() => {
                const updatedButtons = [
                  ...buttons,
                  { name: newTitle, link: newLink },
                ];
                setButtons(updatedButtons);
                router.push(
                  `/?buttons=${encodeURIComponent(
                    JSON.stringify(updatedButtons)
                  )}`,
                  undefined
                );
                setNewTitle("");
                setNewLink("");
                setAddingButton(false);
              }}
              className="btn btn-secondary"
            >
              Add Button
            </button>
          </>
        )}
      </div>
    </div>
  );
}
