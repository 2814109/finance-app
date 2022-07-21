import { FC } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";
import { getUid, getMonthlyReport } from "~/firebaseAdmin.server";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/outline";
import { Report } from "~/types/Report";
import { Link } from "@remix-run/react";
import MUIDataTable from "mui-datatables";

export const loader: LoaderFunction = async ({ request, params }) => {
  const periodKey = params.periodKey;
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");

  const uid = await getUid(String(beVerifiedtoken));
  if (!(periodKey?.length === 6 && typeof periodKey === "string")) return;
  const report = await getMonthlyReport(uid, periodKey);
  return json({ periodKey, docs: report });
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

  const columns = [
    {
      name: "item",
      label: "Item",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "period",
      label: "Period",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
  };

  return (
    <div>
      <div className="flex justify-between p-3">
        <Link to={`/dashboard/analysis/monthly/${onClickPreviousMonth()}`}>
          <ArrowCircleLeftIcon
            className="h-8 w-8 cursor-pointer"
            onClick={() => onClickPreviousMonth()}
          />
        </Link>

        <span className="font-mono">{`${year}年${month}月`}</span>

        <Link to={`/dashboard/analysis/monthly/${onClickNextMonth()}`}>
          <ArrowCircleRightIcon className="h-8 w-8 cursor-pointer" />
        </Link>
      </div>

      <p>支出</p>
      <p>内訳</p>
      <p>固定費</p>
      <p>変動費</p>

      <p>収入</p>
      <p>内訳</p>
      <p>固定費</p>
      <p>変動費</p>

      <p>合計</p>

      <div className="z-0">
        <MUIDataTable
          title={"Monthly Report"}
          data={docs}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
};

export default MonthlyAccounts;
