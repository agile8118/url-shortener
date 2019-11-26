import React from "react";

const SingInBox = () => {
  return (
    <section className="section section--2">
      <h2>Sign in to get permanent shortened links</h2>
      <p>
        If you create shortened links as a guest, your links will be removed
        from our database <strong>if they get no views after 1 month</strong>,
        whereas if you sign in, your links will be permanent and they will never
        get removed unless you choose so.
      </p>
      <p>
        Signing in is <strong>completely free</strong> and requires only some
        simple clicks. We won't send you any email, newsletter whatsoever, your
        account is just something that we can use to keep track of your links.
      </p>
      <p>
        Another advantage of signing in is that you can see the list of all the
        links you've shortened with your account.
      </p>
      <a className="button button-google-signin" href="/auth/google">
        <img src="/google-icon.svg" alt="Google icon" /> Sign in with google
      </a>
    </section>
  );
};

export default SingInBox;
