"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

type ButtonConfig = {
  name: string;
  link: string;
};

// Define the styles for the button container
const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center the buttons horizontally
  gap: "10px", // Add space between buttons
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
    } else {
      const defaultButtonsUrl =
        "/?buttons=%5B%7B%22name%22%3A%22stockcharts%22%2C%22link%22%3A%22https%3A%2F%2Fstockcharts.com%2Fsc3%2Fui%2F%3Fs%3D%24%7Binput%7D%22%7D%2C%7B%22name%22%3A%22marketwatch%22%2C%22link%22%3A%22https%3A%2F%2Fwww.marketwatch.com%2Finvesting%2Fstock%2F%24%7Binput%7D%3Fmod%3Dsearch_symbol%22%7D%2C%7B%22name%22%3A%22Open%20Insider%22%2C%22link%22%3A%22http%3A%2F%2Fopeninsider.com%2Fscreener%3Fs%3D*%26o%3D%26pl%3D%26ph%3D%26ll%3D%26lh%3D%26fd%3D730%26fdr%3D%26td%3D0%26tdr%3D%26fdlyl%3D%26fdlyh%3D%26daysago%3D%26xp%3D1%26xs%3D1%26vl%3D%26vh%3D%26ocl%3D%26och%3D%26sic1%3D-1%26sicl%3D100%26sich%3D9999%26grp%3D0%26nfl%3D%26nfh%3D%26nil%3D%26nih%3D%26nol%3D%26noh%3D%26v2l%3D%26v2h%3D%26oc2l%3D%26oc2h%3D%26sortcol%3D0%26cnt%3D100%26page%3D1%22%7D%5D";
      router.push(defaultButtonsUrl);
    }
  }, [router, searchParams]);

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
    <div className="flex flex-col items-center justify-center">
      {/* <h1>Main</h1> */}
      <input
        type="text"
        placeholder="Add ticker here"
        className="input input-bordered input-lg w-full max-w-xs"
        value={input}
        onChange={handleChange}
      />
      <div className="flex flex-col gap-4 mt-4">
        <button
          onClick={() => setAddingButton(!addingButton)}
          className="btn btn-secondary"
        >
          {addingButton ? "Cancel" : "Edit Buttons / Add A New Link Button"}
        </button>
        {addingButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className="flex flex-col gap-4 mt-4">
              <div>
                You need two things to make a new button. A title and a link.
                Enter the title below, then read the link formatting
                instructions.
              </div>
              <input
                type="text"
                placeholder="Button Title"
                className="input input-bordered w-full max-w-xs"
                value={newTitle}
                onChange={handleNewTitleChange}
              />
              <div>
                You must edit your link so that the * character replaces ticker
                in the url wherever that ticker appears.
              </div>
              <div className="flex flex-col gap-1 p-5">
                <div className="text-xs">This link below</div>
                <div className="text-lg ml-2">{`https://stockcharts.com/sc3/ui/?s=AAPL`}</div>
                <div className="text-xs">should be edited to</div>
                <div className="text-lg ml-2">{`https://stockcharts.com/sc3/ui/?s=*`}</div>
                <div className="text-xs">
                  and this edited link should be pasted in the New Link textbox
                  below
                </div>
              </div>
              <input
                type="text"
                placeholder="Edited Link"
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
            </div>
          </motion.div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`}>
          {input &&
            buttons.map((button, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3"
              >
                {addingButton && (
                  <button
                    className="btn btn-error"
                    onClick={() => handleRemoveButton(index)}
                    title="Remove Button"
                  >
                    X
                  </button>
                )}
                <button
                  onClick={() => handleButtonClick(button.link)}
                  className="btn btn-primary overflow-wrap btn-wide"
                >
                  Go to {button.name}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
