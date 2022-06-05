import auth from "~/components/firebase/auth";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { Form, Link, useActionData } from "@remix-run/react";
import { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { getUser } from "~/libs/auth/getUser";
import errorMessage from "~/const/auth/ErrorMessage";

// ログイン状態の場合はdashboardへ遷移
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser();
  if (user) return redirect("/dashboard");
  return {};
};

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  type AuthError = { code: string };

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const isAuthError = (error: unknown): error is AuthError => {
      const object = error as AuthError;

      return typeof object.code === "string";
    };

    if (isAuthError(error)) {
      return { error: error.code };
    }
  }
  // perform firebase register
  return redirect("/dashboard");
};

export default function SiginIn() {
  const actionData = useActionData();
  const displayedErrorMessage = errorMessage(actionData?.error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Form method="post">
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
            Sigin In
          </button>
          <div className="text-red-500">
            {actionData?.error ? displayedErrorMessage : null}
          </div>
        </Form>
        <div className="flex items-baseline justify-between">
          Already Registered?
          <Link className="text-sm text-blue-600 hover:underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
