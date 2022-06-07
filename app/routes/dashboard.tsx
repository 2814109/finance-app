import { FC } from "react";
import { getUser } from "~/libs/auth/getUser";
import { json, redirect } from "@remix-run/node";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "~/components/firebase/storage";
import { useSetRecoilState } from "recoil";
import HeaderIconState from "~/state/HeaderIcon";
import type { LoaderFunction } from "@remix-run/node";
import Layout from "~/components/Layout";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const user = await getUser();

  if (!user) return redirect("/signin");

  const storageRef = ref(storage, "Abundantia-logo-white.png");
  const url = await getDownloadURL(storageRef);
  return json({
    url,
  });
};

const DashboardIndex: FC = () => {
  const data = useLoaderData();
  const setHeaderIconState = useSetRecoilState(HeaderIconState);
  setHeaderIconState(data.url);

  return (
    <Layout>
      <h1>test</h1>
    </Layout>
  );
};
export default DashboardIndex;
