import { FC, ChangeEvent, useEffect } from "react";
import { Form } from "@remix-run/react";
import InputItem from "~/components/Items/Form/InputItem";
import firebase from "~/components/firebase/index";
import auth from "~/components/firebase/auth";
// import getUser from "~/components/firebase/getUser";
import { getUser } from "~/libs/getUser";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const user = await getUser();

  if (user) redirect("/dashboard");
  return json({});
};

const Login: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          Login to your account
        </h3>
        <Form action="">
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Login
              </button>
              <a
                href="/signin"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
