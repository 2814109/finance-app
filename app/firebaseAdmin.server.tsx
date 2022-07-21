import firebaseAuthConfig from "~/components/firebaseAdmin/config";
import { ServiceAccount } from "firebase-admin/app";
import { DocumentData } from "firebase-admin/firestore";
import { Timestamp, BulkWriter } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { Report, IsDisplayedReport } from "./types/Report";

type OriginReport = Omit<Report, "id">;
type InsertRecord = {
  item: string;
  price: number;
  type: string;
  period: string;
};

const serviceAccount = firebaseAuthConfig as ServiceAccount;

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const getUid = async (token: string) => {
  let uid = "";
  await admin
    .auth()
    .verifyIdToken(token)
    .then((idToken) => {
      uid = idToken.uid;
    })
    .catch(() => {
      console.log("### invalid token");
    });
  return uid;
};

export const getAllReport = async (collectionName: string) => {
  const resposeData: IsDisplayedReport[] = [];

  const document = admin
    .firestore()
    .collection(collectionName)
    .orderBy("period");
  (await document.get()).docs.forEach((doc) => {
    // ユーザ定義型ガードを実装
    const getData: unknown = doc.data();
    if (isOriginReport(getData)) {
      const { period, ...othreData } = getData;
      resposeData.push({
        id: doc.id,
        period: period.toDate().toLocaleString(),
        ...othreData,
      });
    } else {
      console.log("user type guard error");
    }
  });
  return resposeData;
};

export const createLineGraphData = async (
  originReposts: IsDisplayedReport[]
) => {
  const formatDateforCalendar = (date: string) => {
    return new Date(date).getTime();
  };

  const expenseList = originReposts
    .filter((report) => {
      return Math.sign(report.price) === -1;
    })
    .map((report) => ({
      ...report,
      period: formatDateforCalendar(report.period),
    }));

  const calendarList = expenseList.map((report) => report.period);

  const setCalendar = [...new Set(calendarList)];
  const totalExpences: { calendar: number; totalExpense: number }[] = [];
  setCalendar.forEach((keyCalendar) => {
    const sameCalendarReport = expenseList
      .filter((report) => {
        return report.period === keyCalendar;
      })
      .map((report) => report.price);

    const totalExpenseForCalendar = sameCalendarReport.reduce(
      (prev, current) => prev + current,
      0
    );

    totalExpences.push({
      calendar: keyCalendar,
      totalExpense: Math.abs(totalExpenseForCalendar),
    });
  });
  return totalExpences;
};

export const getMonthlyReport = async (
  collectionName: string,
  periodKey: string
) => {
  const year = Number(periodKey.slice(0, 4));
  const month = periodKey.slice(-2);
  const resposeData: DocumentData[] = [];
  const keyDate = new Date(Number(year), Number(month), 1);
  const endOfMonth = new Date(keyDate.getFullYear(), keyDate.getMonth() + 1, 0);

  const sinceAtDate = Timestamp.fromDate(
    new Date(`${year}/${month}/01 00:00:00`)
  );
  const recentAtDate = Timestamp.fromDate(
    new Date(`${year}/${month}/${endOfMonth.getDate()} 00:00:00`)
  );
  const document = admin
    .firestore()
    .collection(collectionName)
    .orderBy("period")
    .startAt(sinceAtDate)
    .endAt(recentAtDate);

  (await document.get()).docs.forEach((doc) => {
    // ユーザ定義型ガードを実装
    const getData: unknown = doc.data();
    if (isOriginReport(getData)) {
      const { period, ...othreData } = getData;
      resposeData.push({
        id: doc.id,
        period: period.toDate().toLocaleString(),
        ...othreData,
      });
    } else {
      console.log("user type guard error");
    }
  });
  return resposeData;
};

const isOriginReport = (
  isValidatedObject: unknown
): isValidatedObject is OriginReport => {
  const object = isValidatedObject as OriginReport;

  return (
    typeof object?.item === "string" &&
    typeof object?.period === "object" &&
    typeof object?.price === "number" &&
    typeof object?.type === "string"
  );
};

export const addDoc = (collectionName: string, postData: OriginReport) => {
  admin.firestore().collection(collectionName).add(postData);
};

export const convertToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
};

export const deleteReport = (collectionName: string, reportId: string) => {
  admin.firestore().collection(collectionName).doc(reportId).delete();
};

export const bulkInsert = async (collectionName: string, csvFile: Blob) => {
  const csvText = await csvFile.text();
  const arrayText = csvText.split("\r\n").map((row) => row.split(","));
  arrayText.shift();

  const insertDataList: InsertRecord[] = arrayText.map((data) => ({
    item: data[0],
    price: Number(data[1]),
    type: data[2],
    period: String(data[3]),
  }));

  const createData = ({ item, price, type, period }: InsertRecord) => {
    return {
      period: Timestamp.fromDate(new Date(period)),
      item: item,
      price: price,
      type: type,
    };
  };
  const firestore = admin.firestore();

  const bulkWriter: BulkWriter = firestore.bulkWriter();

  insertDataList.forEach((InsertData) => {
    const documentRef = firestore.collection(collectionName).doc();
    bulkWriter.set(documentRef, createData(InsertData));
  });

  await bulkWriter.close();
};

export const createExpenseItemsData = async (
  originReposts: IsDisplayedReport[]
) => {
  const expenseList = originReposts.filter((report) => {
    return Math.sign(report.price) === -1;
  });

  const denominatorExpense = expenseList
    .map((report) => report.price)
    .reduce((prev, current) => prev + current, 0);

  const itemList = expenseList.map((report) => report.item);
  const uniqueItems = [...new Set(itemList)];

  const totalExpences: {
    itemName: string;
    totalExpense: number;
    count: number;
    average: number;
    proportion: number;
  }[] = [];

  uniqueItems.forEach((keyItem) => {
    const sameItemReport = expenseList
      .filter((report) => {
        return report.item === keyItem;
      })
      .map((report) => report.price);

    const totalExpenseForItem = sameItemReport.reduce(
      (prev, current) => prev + current,
      0
    );

    totalExpences.push({
      itemName: keyItem,
      totalExpense: Math.abs(totalExpenseForItem),
      count: sameItemReport.length,
      average: Math.abs(totalExpenseForItem) / sameItemReport.length,
      proportion:
        (Math.abs(totalExpenseForItem) / Math.abs(denominatorExpense)) * 100,
    });
  });
  return totalExpences;
};
