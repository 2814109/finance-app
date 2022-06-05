import auth from "~/components/firebase/auth";
import { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  await auth.signOut();
  return redirect("/");
};
