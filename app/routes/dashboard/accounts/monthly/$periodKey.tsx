import { FC } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AccountForm from "~/components/Items/AccountForm";
import firestore from "~/components/firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getDocs, startAt, endAt, query, orderBy } from "firebase/firestore";
import { getSession } from "~/session";
import { DocumentData } from "firebase/firestore";
import ReportList from "~/components/Items/ReportTable/index";

import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/outline";

import { Link } from "@remix-run/react";
import auth from "~/components/firebase/auth";

type Report = {
  id: string;
  period: Timestamp;
  item: string;
  price: number;
  type: string;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const periodKey = params.periodKey;
  const session = await getSession(request.headers.get("Cookie"));

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

  auth.currentUser?.getIdToken(session.get("user_id"));

  const docRef = query(
    collection(firestore, `${session.get("user_id")}`),
    orderBy("period"),
    startAt(sinceAtDate),
    endAt(recentAtDate)
  );
  const monthlyDocsSnapshot = await getDocs(docRef);
  const resposeData: DocumentData[] = [];
  monthlyDocsSnapshot.forEach((doc) => {
    resposeData.push(doc.data());
  });
  return json({ periodKey, docs: resposeData });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const item = String(formData.get("item"));
  const price = Number(formData.get("price"));
  const period = String(formData.get("period"));
  const type = String(formData.get("type"));
  const session = await getSession();

  if (session.get("user_id") === undefined) {
    return json({ status: 403 });
  }

  const docData = {
    item,
    price,
    period: period === "" ? new Date() : new Date(period),
    type,
  };
  await addDoc(collection(firestore, session.get("user_id")), docData);
  return {};
};

const MonthlyAccounts: FC = () => {
  const { periodKey, docs }: { periodKey: string; docs: Report[] } =
    useLoaderData();
  const year = Number(periodKey.slice(0, 4));
  const month = periodKey.slice(-2);

  const onClickNextMonth = () => {
    const keyDate = new Date(Number(year), Number(month), 1);
    const nextMonthDate = new Date(
      keyDate.getFullYear(),
      keyDate.getMonth() + 1,
      keyDate.getDate()
    );

    const nextMonth = ("0" + nextMonthDate.getMonth()).slice(-2);
    return `${nextMonthDate.getFullYear()}${nextMonth}`;
  };

  const onClickpreviousMonth = () => {
    const keyDate = new Date(Number(year), Number(month), 1);
    const lastMonthDate = new Date(
      keyDate.getFullYear(),
      keyDate.getMonth() - 1,
      keyDate.getDate()
    );

    const lastMonth = ("0" + lastMonthDate.getMonth()).slice(-2);
    return `${lastMonthDate.getFullYear()}${lastMonth}`;
  };

  return (
    <div>
      <div className="flex justify-between p-3">
        <Link to={`/dashboard/accounts/monthly/${onClickpreviousMonth()}`}>
          <ArrowCircleLeftIcon
            className="h-8 w-8 cursor-pointer"
            onClick={() => onClickpreviousMonth()}
          />
        </Link>

        <span className="font-mono">{`${year}年${month}月`}</span>
        <Link to={`/dashboard/accounts/monthly/${onClickNextMonth()}`}>
          <ArrowCircleRightIcon className="h-8 w-8 cursor-pointer" />
        </Link>
      </div>
      <AccountForm periodKey={periodKey} />

      <ReportList reports={docs} />
    </div>
  );
};

export default MonthlyAccounts;
