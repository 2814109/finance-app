import firebaseAuthConfig from "~/components/firebaseAdmin/config";
import { ServiceAccount } from "firebase-admin/app";
import { DocumentData } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { Report } from "./types/Report";

type OriginReport = Omit<Report, "id">;

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
