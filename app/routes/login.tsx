import { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { signInWithEmailAndPassword, UserCredential } from "@firebase/auth";
import auth from "~/components/firebase/auth";

import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import { Form, Link, useActionData } from "@remix-run/react";

// use loader to check for existing session, if found, send the user to the blogs site
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    // Redirect to the blog page if they are already signed in.
    //   console.log('user has existing cookie')
    return redirect("/dashboard");
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
  const user = await signInWithEmailAndPassword(auth, email, password)
    .then((user) => (user = user))
    .catch((error) => (error = error));
  // if signin was successful then we have a user
  if (user) {
    // let's setup the session and cookie wth users idToken
    let session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", await user.getIdToken());
    // let's send the user to the main page after login
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  let error = "test";
  return { user, error };
};

export default function Login() {
  const actionData = useActionData();
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
        <div className="errors">
          {actionData?.error ? actionData?.error?.message : null}
        </div>
      </div>
    </div>
  );
}
// const Login: FC = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
//         <h3 className="text-2xl font-bold text-center">
//           Login to your account
//         </h3>
//         <Form action="">
//           <div className="mt-4">
//             <div>
//               <label className="block" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 type="text"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="block">Password</label>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
//               />
//             </div>
//             <div className="flex items-baseline justify-between">
//               <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
//                 Login
//               </button>
//               <a
//                 href="/signin"
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 Forgot password?
//               </a>
//             </div>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };
// export default Login;
