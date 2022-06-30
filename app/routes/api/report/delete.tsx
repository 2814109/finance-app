import { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import { getUid, deleteReport } from "~/firebaseAdmin.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const reportId = String(formData.get("reportId"));
  const location = String(formData.get("location"));

  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");
  const uid = await getUid(String(beVerifiedtoken));
  await deleteReport(uid, reportId);

  return redirect(location);
};
