import { FC } from "react";
import AccountForm from "~/components/Items/AccountForm";
import type { ActionFunction } from "@remix-run/node";
import { getUid, addDoc, convertToTimestamp } from "~/firebaseAdmin.server";
import { getSession } from "~/sessions";
import { Report } from "~/types/Report";

type OriginReport = Omit<Report, "id">;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const item = String(formData.get("item"));
  const price = Number(formData.get("price"));
  const period = String(formData.get("period"));
  const type = String(formData.get("type"));
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");

  const uid = await getUid(String(beVerifiedtoken));

  const postDate = period === "" ? new Date() : new Date(period);

  const docData: OriginReport = {
    item,
    price,
    period: convertToTimestamp(postDate),
    type,
  };

  addDoc(uid, docData);

  return {};
};

const Insert: FC = () => {
  return (
    <div className="flex justify-between p-3">
      <AccountForm />
    </div>
  );
};

export default Insert;
