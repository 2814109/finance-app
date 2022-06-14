import { FC } from "react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AccountForm from "~/components/Items/AccountForm";
import firestore from "~/components/firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

import { getUser } from "~/libs/auth/getUser";
import { DocumentData } from "firebase/firestore";

type Report = {
  period: Timestamp;
  item: string;
  price: number;
  type: string;
};
export const loader: LoaderFunction = async ({ params }) => {
  const periodKey = params.periodKey;
  const user = await getUser();

  const docRef = collection(firestore, `finance/${user?.uid}/${periodKey}`);
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
  await addDoc(
    collection(firestore, `finance/${user?.uid}/${periodKey}`),
    docData
  );
  return redirect("");
};

const MonthlyAccounts: FC = () => {
  const { periodKey, docs }: { periodKey: string; docs: Report[] } =
    useLoaderData();
  return (
    <div>
      <AccountForm periodKey={periodKey} />
      {docs.map((doc) => {
        return (
          <div>
            <span>品目：{doc.item}</span>
            <span>金額：{doc.price}</span>
            <span>タイプ：{doc.type}</span>
            <span>時間：{String(new Date(doc.period.seconds * 1000))}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyAccounts;
