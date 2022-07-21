import { FC } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AccountForm from "~/components/Items/AccountForm";
import { getSession } from "~/sessions";
import ReportList from "~/components/Items/ReportTable/index";
import {
  getUid,
  getMonthlyReport,
  addDoc,
  convertToTimestamp,
} from "~/firebaseAdmin.server";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/outline";
import { Report } from "~/types/Report";

import { Link } from "@remix-run/react";

type OriginReport = Omit<Report, "id">;

export const loader: LoaderFunction = async ({ request, params }) => {
  const periodKey = params.periodKey;
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");

  const uid = await getUid(String(beVerifiedtoken));
  console.log(`check ${uid}`);

  if (!(periodKey?.length === 6 && typeof periodKey === "string")) return;

  const report = await getMonthlyReport(uid, periodKey);

  return json({ periodKey, docs: report });
};

// Actionの処理はクライアントサイドで実行される？

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
    // clientのTimestamp型定義が必要　firebase-admin の型定義はバックエンドの処理になるらしい
    period: convertToTimestamp(postDate),
    type,
  };

  console.log(`check ${uid}`);
  addDoc(uid, docData);

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

  const onClickPreviousMonth = () => {
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
        <Link to={`/dashboard/accountant/monthly/${onClickPreviousMonth()}`}>
          <ArrowCircleLeftIcon
            className="h-8 w-8 cursor-pointer"
            onClick={() => onClickPreviousMonth()}
          />
        </Link>

        <span className="font-mono">{`${year}年${month}月`}</span>
        <Link to={`/dashboard/accountant/monthly/${onClickNextMonth()}`}>
          <ArrowCircleRightIcon className="h-8 w-8 cursor-pointer" />
        </Link>
      </div>
      <AccountForm periodKey={periodKey} />

      <ReportList reports={docs} />
    </div>
  );
};

export default MonthlyAccounts;
