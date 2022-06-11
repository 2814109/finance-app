import { FC } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AccountForm from "~/components/Items/AccountForm";
export const loader: LoaderFunction = async ({ params }) => {
  return json({ periodKey: params.periodKey });
};

const MonthlyAccounts: FC = () => {
  const { periodKey } = useLoaderData();
  return (
    <div>
      <AccountForm />
    </div>
  );
};

export default MonthlyAccounts;
