import { getUser } from "~/libs/auth/getUser";
import { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";

// ログイン状態の場合はdashboardへ遷移
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser();
  if (user) return redirect("/dashboard");
  return redirect("/login");
};
