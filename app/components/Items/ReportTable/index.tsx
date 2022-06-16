import { FC } from "react";
import { Timestamp } from "firebase/firestore";

type Report = {
  id: string;
  item: string;
  price: number;
  type: string;
  period: Timestamp;
};
type Props = {
  reports: Report[];
};

const titles = { item: "品目", price: "金額", type: "タイプ", period: "時間" };

type TitleType = typeof titles;

const ReportTable: FC<Props> = ({ reports }) => {
  const titleArray = Object.entries(titles).map(([_, value]) => value);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative">
          <table className="sm:shadow-2xl border-collapse w-full">
            <thead className="bg-gray-100">
              <tr className="border-t-2 border-gray-400 ">
                {titleArray.map((title) => {
                  return (
                    <th className="text-left text-gray-700 capitalize px-4 py-4">
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {reports?.map((report) => {
                return (
                  <tr
                    key={report.id}
                    className="bg-white shadow-lg sm:shadow-none mb-2 hover:bg-gray-100 hover:border-gray-600"
                  >
                    <TableData data={report.item} titleKey="item" />
                    <TableData data={report.price} titleKey="price" />
                    <TableData data={report.type} titleKey="type" />
                    <TableData
                      data={String(
                        new Date(report.period.seconds * 1000).toLocaleString()
                      )}
                      titleKey="period"
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type TableDataType = {
  data: string | number | Date;
  titleKey: keyof TitleType;
};
const TableData: FC<TableDataType> = ({ data, titleKey }) => {
  return (
    <>
      <td className="pl-4 ali-center text-left relative border-gray-400">
        {data}
      </td>
    </>
  );
};

export default ReportTable;
