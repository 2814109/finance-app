import { FC } from "react";
import { getUser } from "~/libs/auth/getUser";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const user = await getUser();

  if (!user) return redirect("/signin");
  return json({});
};

const DashboardIndex: FC = () => {
  return (
    <>
      <h1>test</h1>
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-300 active:bg-red-500"
        >
          Logout
        </button>
      </Form>
    </>
  );
};
export default DashboardIndex;
