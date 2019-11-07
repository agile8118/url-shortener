import React from "react";

const Links = () => {
  return (
    <div>
      <section className="section section--2">
        <h2>Links you have shortened with this account</h2>
        <p className="text-center a-3">
          No link yet. Try one by putting a link in the input above.
        </p>
      </section>
      <p className="a-2">
        Signed in as pokhraph@gmail.com. <a href="/logout">Singout.</a>
      </p>
    </div>
  );
};

export default Links;
