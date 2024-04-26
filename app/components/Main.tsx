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

const defaultButtons = [
  { name: "Fintel Short Interest", link: "https://fintel.io/ss/us/*" },
  {
    name: "MarketWatch",
    link: "https://www.marketwatch.com/investing/stock/${input}?mod=search_symbol",
  },
  {
    name: "MarketWatch",
    link: "https://www.marketwatch.com/investing/stock/${input}?mod=search_symbol",
  },
  {
    name: "OpenInsider",
    link: "http://openinsider.com/screener?s=${input}&o=&pl=&ph=&ll=&lh=&fd=730&fdr=&td=0&tdr=&fdlyl=&fdlyh=&daysago=&xp=1&xs=1&vl=&vh=&ocl=&och=&sic1=-1&sicl=100&sich=9999&grp=0&nfl=&nfh=&nil=&nih=&nol=&noh=&v2l=&v2h=&oc2l=&oc2h=&sortcol=0&cnt=100&page=1",
  },
  {
    name: "TradingView",
    link: "https://www.tradingview.com/chart/lJHaJwpi/?symbol=${input}",
  },
  { name: "WhaleWisdom", link: "https://whalewisdom.com/stock/*" },
  { name: "YahooHolders", link: "https://finance.yahoo.com/quote/*/holders/" },
  {
    name: "MarketWatch Financials",
    link: "https://www.marketwatch.com/investing/stock/*/financials?mod=mw_quote_tab",
  },
  {
    name: "StockCharts",
    link: "https://stockcharts.com/sc3/ui/?s=${input}",
  },
];

export default function Main() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newLink, setNewLink] = useState<string>("");
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [addingButton, setAddingButton] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);

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
        "/?buttons=" + encodeURIComponent(JSON.stringify(defaultButtons));
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

  function handleOpenAllLinks() {
    buttons.forEach((button) => {
      const url = eval("`" + button.link + "`");
      window.open(url, "_blank");
    });
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
          onClick={() => (
            setAddingButton(!addingButton), setHowItWorksOpen(false)
          )}
          //   className={`btn ${addingButton ? "btn-error" : "btn-warning"}`}
          className="btn btn-warning"
        >
          {addingButton ? "Cancel" : "Edit Buttons / Add A New Link Button"}
        </button>
        {addingButton && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `/?buttons=${encodeURIComponent(JSON.stringify(buttons))}`
                );
                setLinkCopied(true);
                setTimeout(() => {
                  setLinkCopied(false);
                }, 1500);
              }}
              className="btn btn-success"
            >
              Copy Layout Link to Share
            </button>
            {linkCopied && <CopiedLinkAlert />}
          </>
        )}
        {!input && !addingButton && (
          <button
            onClick={() => setHowItWorksOpen(!howItWorksOpen)}
            className={`btn ${howItWorksOpen ? "btn-error" : "btn-success"}`}
          >
            {howItWorksOpen ? "Close How It Works" : "How It Works"}
          </button>
        )}

        {howItWorksOpen && (
          <div
            className={`flex flex-col gap-4 bg-neutral-900 rounded-lg p-4 ${
              addingButton ? "" : "max-w-md"
            }`}
          >
            <HowItWorks />
          </div>
        )}

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
            <div className="flex flex-col gap-4  bg-neutral-900 rounded-lg p-4">
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
                className="btn btn-warning"
              >
                Add Button
              </button>
            </div>
          </motion.div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`}>
          {(input || addingButton) &&
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
          {/* {(input || addingButton) && (
            <button
              className="btn btn-accent" // Use any appropriate class for styling
              onClick={handleOpenAllLinks}
            >
              Open All
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

const CopiedLinkAlert = () => {
  return (
    <div
      className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50"
      style={{ maxWidth: "calc(100% - 1rem)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Link Copied</span>
        </div>
      </motion.div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <>
      <div>This website creates a visual directory for dynamic links.</div>
      <div>
        The idea is to have links to everything on one page, with the ability to
        instantly swap the current asset being looked at.
      </div>
      <div>
        All layout information is stored in the URL, so you can bookmark your
        layout or share it with others.
      </div>
      <div>
        {`The links are customizable, so you can add or remove buttons as needed by opening the "Edit Buttons" section.`}
      </div>
    </>
  );
};
