import { FC } from "react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AccountForm from "~/components/Items/AccountForm";
import firestore from "~/components/firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getDocs, startAt, endAt, query, orderBy } from "firebase/firestore";

import { getUser } from "~/libs/auth/getUser";
import { DocumentData } from "firebase/firestore";

import ReportList from "~/components/Items/ReportTable/index";

type Report = {
  id: string;
  period: Timestamp;
  item: string;
  price: number;
  type: string;
};
export const loader: LoaderFunction = async ({ params }) => {
  const periodKey = params.periodKey;
  const user = await getUser();

  if (!(periodKey?.length === 6 && typeof periodKey === "string")) return;
  const year = Number(periodKey.slice(0, 4));
  const month = periodKey.slice(-2);

  const keyDate = new Date(Number(year), Number(month), 1);
  const endOfMonth = new Date(keyDate.getFullYear(), keyDate.getMonth() + 1, 0);

  const sinceAtDate = Timestamp.fromDate(
    new Date(`${year}/${month}/01 00:00:00`)
  );
  const recentAtDate = Timestamp.fromDate(
    new Date(`${year}/${month}/${endOfMonth.getDate()} 00:00:00`)
  );
  const docRef = query(
    collection(firestore, `${user?.uid}`),
    orderBy("period"),
    startAt(sinceAtDate),
    endAt(recentAtDate)
  );
  const monthlyDocsSnapshot = await getDocs(docRef);
  const resposeData: DocumentData[] = [];
  monthlyDocsSnapshot.forEach((doc) => {
    resposeData.push(doc.data());
    console.log(doc.id, " => ", doc.data());
  });
  return json({ periodKey, docs: resposeData });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const periodKey = String(formData.get("periodKey"));
  const item = String(formData.get("item"));
  const price = Number(formData.get("price"));
  const period = String(formData.get("period"));
  const type = String(formData.get("type"));
  const user = await getUser();

  if (user?.uid === undefined) {
    return json({ status: 403 });
  }

  const docData = {
    item,
    price,
    period: period === "" ? new Date() : new Date(period),
    type,
  };
  await addDoc(collection(firestore, `${user?.uid}`), docData);
  return {};
};

const MonthlyAccounts: FC = () => {
  const { periodKey, docs }: { periodKey: string; docs: Report[] } =
    useLoaderData();

  return (
    <div>
      <AccountForm periodKey={periodKey} />

      <ReportList reports={docs} />
    </div>
  );
};

export default MonthlyAccounts;
