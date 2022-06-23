import { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { signInWithEmailAndPassword } from "@firebase/auth";
import auth from "~/components/firebase/auth";
import { FC } from "react";
import { Form, Link, useActionData } from "@remix-run/react";
import errorMessage from "~/const/auth/ErrorMessage";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/session";
import { json } from "@remix-run/node";

type AuthError = { code: string };

const redirectPath = "/dashboard";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("access_token")) {
    return redirect(redirectPath);
  }
  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", await user.getIdToken());
    session.set("user_id", user.uid);

    // let's send the user to the main page after login
    return redirect(redirectPath, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log("error");
    const isAuthError = (error: unknown): error is AuthError => {
      const object = error as AuthError;

      return typeof object.code === "string";
    };

    if (isAuthError(error)) {
      return { error: error.code };
    }
  }

  return redirect("/dashboard");
};

const Login: FC = () => {
  const actionData = useActionData();
  const displayedErrorMessage = errorMessage(actionData?.error);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <Form method="post">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              type="email"
              name="email"
              placeholder="you@awesome.dev"
              required
            />
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              type="password"
              name="password"
              required
            />
            <button
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="text-red-500">
            {actionData?.error ? displayedErrorMessage : null}
          </div>
        </Form>
        <div className="m-4">
          <div className="flex items-baseline justify-between">
            <Link
              to="/signin"
              className="text-sm text-blue-600 hover:underline"
            >
              Sign In
            </Link>
            <Link
              to="/auth/forgot"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
