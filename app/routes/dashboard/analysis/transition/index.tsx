import { FC } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions";
import {
  getUid,
  getAllReport,
  createLineGraphData,
} from "~/firebaseAdmin.server";
import { useLoaderData } from "@remix-run/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const beVerifiedtoken = session.get("access_token");

  const uid = await getUid(String(beVerifiedtoken));
  const report = await getAllReport(uid);
  const lineGraphData = await createLineGraphData(report);
  return json({ lineGraphData: lineGraphData });
};

const Analysis: FC = () => {
  const { lineGraphData }: { lineGraphData: any } = useLoaderData();

  return (
    <div>
      <h1 className="flex justify-center">Total Expense</h1>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
      <AreaChart
        width={1080}
        height={400}
        data={lineGraphData}
        margin={{
          top: 10,
          right: 50,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="calendar"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
          type="number"
        />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="totalExpense"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
      {/* </ResponsiveContainer> */}
    </div>
  );
};

export default Analysis;
