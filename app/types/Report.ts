import { Timestamp } from "firebase-admin/firestore";

export type Report = {
  id: string;
  period: Timestamp;
  item: string;
  price: number;
  type: string;
};

export type IsDisplayedReport = Omit<Report, "period"> & { period: string };
