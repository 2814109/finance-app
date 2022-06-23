import auth from "~/components/firebase/auth";
import { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { getSession } from "~/session";
import { destroySession } from "~/session";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    return redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
  auth.signOut();
  return redirect("/");
};
