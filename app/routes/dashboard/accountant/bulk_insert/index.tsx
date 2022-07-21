import { ActionFunction, json } from "@remix-run/node";
import { FC } from "react";
import BulkInsertForm from "~/components/Items/BulkInsertForm";
import { bulkInsert } from "~/firebaseAdmin.server";
import { getUid } from "~/firebaseAdmin.server";
import { getSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");
  const uid = await getUid(String(beVerifiedtoken));
  const formData = await request.formData();
  const bulkInsertFile = formData.getAll("bulkInsertFile");
  const blob = new Blob(bulkInsertFile, { type: "text/csv" });
  bulkInsert(uid, blob);
  return {};
};
const BulkInsert: FC = () => {
  return <BulkInsertForm />;
};
export default BulkInsert;
