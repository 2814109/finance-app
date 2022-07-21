import { FC } from "react";

import MUIDataTable from "mui-datatables";

import { json, LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions";
import {
  getUid,
  getAllReport,
  createExpenseItemsData,
} from "~/firebaseAdmin.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");

  const uid = await getUid(String(beVerifiedtoken));
  const report = await getAllReport(uid);
  const expenseItemsData = await createExpenseItemsData(report);
  return json({ expenseItemsData: expenseItemsData });
};

const ListOfItems: FC = () => {
  const { expenseItemsData }: { expenseItemsData: any } = useLoaderData();

  const columns = [
    {
      name: "itemName",
      label: "Item",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "totalExpense",
      label: "Expense",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "count",
      label: "Count",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "average",
      label: "Average",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "proportion",
      label: "Proportion(%)",
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
    <div className="z-0">
      <MUIDataTable
        title={"Expense for Item"}
        data={expenseItemsData}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default ListOfItems;
