import { useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const data = useActionData(); //returns data from the assigned action, in this case response from server
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in!" : "Sign Up!"}</h1>
        {data && data.error && <p>{data.error}</p>}
        {!isLogin && (
          <p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required />
          </p>
        )}
        <p>
          <label htmlFor="image">Username</label>
          <input id="username" type="text" name="username" required />
        </p>

        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        {!isLogin && (
          <p>
            <label htmlFor="image">First Name</label>
            <input id="firstName" type="text" name="firstName" required />
          </p>
        )}
        {!isLogin && (
          <p>
            <label htmlFor="image">Last Name</label>
            <input id="LastName" type="text" name="lastName" required />
          </p>
        )}
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
