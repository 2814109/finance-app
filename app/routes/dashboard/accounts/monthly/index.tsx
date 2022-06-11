import { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const date = new Date();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return redirect(`${date.getFullYear()}${month}`);
};
