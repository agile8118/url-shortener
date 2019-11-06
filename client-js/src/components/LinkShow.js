import React from "react";

export default ({ realUrl, shortenedUrl }) => {
  // Make the link component hidden by default
  let className = "link display-none";
  let displayedRealUrl;

  // This will make the link component to get shown on the screen
  if (realUrl) {
    className = "link";
  }

  // If the real url was longer than 35 characters, substring it
  if (realUrl.length > 35) {
    displayedRealUrl = realUrl.substring(0, 35) + "...";
  } else {
    displayedRealUrl = realUrl;
  }

  return (
    <div className={className}>
      <div className="link__real">{displayedRealUrl}</div>
      <div className="link__shortened">
        <a target="_blank" href={shortenedUrl}>
          {shortenedUrl}
        </a>
        <div className="tooltip">
          <button
            onClick={() => {
              // Grap the text and copy it to the clipboard
              navigator.clipboard.writeText(shortenedUrl).then(function() {});

              // Represent to the user that the link was copied
              document.querySelector("#tooltipText").innerHTML = "Copied!";
            }}
            onMouseLeave={() => {
              document.querySelector("#tooltipText").innerHTML = "Copy";
            }}
            className="link__copy"
          >
            <img src="/copy-document.svg" />
          </button>
          <span id="tooltipText" className="tooltip__text">
            Copy
          </span>
        </div>
      </div>
    </div>
  );
};
