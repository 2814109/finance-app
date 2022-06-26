import { getSession } from "~/sessions";
import { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";

// ログイン状態の場合はdashboardへ遷移
export const loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (!session.has("access_token")) {
    return redirect("/login");
  }
  return redirect("/dashboard");
};
