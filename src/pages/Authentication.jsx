import AuthForm from "../components/Auth/AuthForm.jsx";
import { redirect } from "react-router-dom";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }

  const data = await request.formData();

  var authData = null;

  if (mode === "login") {
    authData = {
      username: data.get("username"),
      password: data.get("password"),
    };
  } else {
    authData = {
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };
  }
  const response = await fetch("http://localhost:3000/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  console.log(response.status);

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  if (mode === "login") {
    return redirect("/");
  } else {
    return redirect("/auth?mode=login");
  }
}
