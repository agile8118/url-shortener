var shortenButton = document.querySelector("#shortenButton");
var loadingButton = document.querySelector("#loadingButton");
var copyButton = document.querySelector("#copyButton");
var tooltip = document.querySelector("#tooltip");
var tooltipText = document.querySelector("#tooltipText");

// Unfocus the element
function blurAll(){
  var tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}

shortenButton.addEventListener("click", function() {
  shortenButton.classList.add("display-none");
  loadingButton.classList.remove("display-none");
})

copyButton.addEventListener("click", function() {
  // Grap the text from the shortened link tag and copy it to the clipboard
  var text = document.getElementById("shortenedLink").innerHTML;
    navigator.clipboard.writeText(text).then(function() {
  });

  // Represent to the user that the link was copied
  tooltipText.innerHTML = "Copied!";
});

tooltip.addEventListener("mouseleave", function() {
   tooltipText.innerHTML = "Copy";
   blurAll();
});
