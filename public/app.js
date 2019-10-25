var shortenButton = document.querySelector("#shortenButton");
var loadingButton = document.querySelector("#loadingButton");
var copyButton = document.querySelector("#copyButton");
var tooltip = document.querySelector("#tooltip");
var tooltipText = document.querySelector("#tooltipText");
var realLinkInput = document.querySelector("#realLinkInput");
var link = document.querySelector("#link");
var realLinkDisplay = document.querySelector("#realLinkDisplay");
var shortenedLink = document.querySelector("#shortenedLink");
var message = document.querySelector("#message");
var box = document.querySelector("#box");

// Buttons won't get focused on click
document.addEventListener("click", function(e) {
  if (document.activeElement.toString() == "[object HTMLButtonElement]") {
    document.activeElement.blur();
  }
});

// Check if a text is valid url or not
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

// Show error to user
function showError(msg) {
  box.classList.add("box--error");
  message.innerHTML = msg;
  link.classList.add("display-none");
  realLinkDisplay.innerHTML = "";
  shortenedLink.innerHTML = "";
  shortenedLink.href = "";

  // Make the button as normall
  shortenButton.classList.remove("display-none");
  loadingButton.classList.add("display-none");
}

// Hide the error
function hideError() {
  box.classList.remove("box--error");
  message.innerHTML = "";
}

realLinkInput.addEventListener("focus", function() {
  realLinkInput.placeholder = "";
});

realLinkInput.addEventListener("focusout", function() {
  realLinkInput.placeholder = "Put your link here...";
});

shortenButton.addEventListener("click", function() {
  // Make the button as loading
  shortenButton.classList.add("display-none");
  loadingButton.classList.remove("display-none");

  var realUrl = document.querySelector("#realLinkInput").value;
  if (validURL(realUrl)) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.status === 200) {
        try {
          var realUrl = JSON.parse(this.response).realURL;
          var shortenedUrl = JSON.parse(this.response).shortenedURL;
          // Hide the error
          hideError();
          realLinkInput.value = "";
          link.classList.remove("display-none");

          if (realUrl.length > 35) {
            realLinkDisplay.innerHTML = realUrl.substring(0, 35) + "...";
          } else {
            realLinkDisplay.innerHTML = realUrl;
          }

          shortenedLink.innerHTML = shortenedUrl;
          shortenedLink.href = shortenedUrl;

          // Make the button as normall
          shortenButton.classList.remove("display-none");
          loadingButton.classList.add("display-none");
        } catch (e) {}
      } else if (this.status === 400) {
        showError(this.responseText);
      } else if (this.status === 500) {
        showError("Sorry an unexpected error happened please try again.");
      }
    };
    xhttp.open("POST", "/url", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({ url: realUrl }));
  } else {
    if (realUrl.length > 0) {
      // Show a error to user
      showError("The URL you put is not valid.");
    } else {
      // Show a error to user
      showError("Please first put your URL here.");
    }
  }
});

copyButton.addEventListener("click", function() {
  // Grap the text from the shortened link tag and copy it to the clipboard
  var text = document.getElementById("shortenedLink").innerHTML;
  navigator.clipboard.writeText(text).then(function() {});

  // Represent to the user that the link was copied
  tooltipText.innerHTML = "Copied!";
});

tooltip.addEventListener("mouseleave", function() {
  tooltipText.innerHTML = "Copy";
});
