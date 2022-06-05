import { FC } from "react";
import { getUser } from "~/libs/getUser";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const user = await getUser();

  if (!user) return redirect("/signin");
  return json({});
};

const DashboardIndex: FC = () => {
  return (
    <>
      <h1>test</h1>
    </>
  );
};
export default DashboardIndex;
