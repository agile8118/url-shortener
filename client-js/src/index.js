import React from "react";
import ReactDOM from "react-dom";

import UrlShortener from "./components/UrlShortener";
import BottomBox from "./components/BottomBox";

ReactDOM.render(<UrlShortener />, document.querySelector("#url-shortener"));
ReactDOM.render(<BottomBox />, document.querySelector("#sign-in-box"));
