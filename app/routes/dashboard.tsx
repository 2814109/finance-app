import { FC } from "react";
import { getSession } from "~/session";
import { json, redirect } from "@remix-run/node";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "~/components/firebase/storage";
import { useSetRecoilState } from "recoil";
import HeaderIconState from "~/state/HeaderIcon";
import type { LoaderFunction } from "@remix-run/node";
import Layout from "~/components/Layout";
import { Outlet, useLoaderData } from "@remix-run/react";
import auth from "~/components/firebase/auth";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    return redirect("/login");
  }
  auth.currentUser?.getIdToken(session.get("user_id"));

  const storageRef = ref(storage, process.env.HEADER_IMAGE_FILE_NAME);
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
      <div className="flex justify-center p-4">
        <Outlet />
      </div>
    </Layout>
  );
};
export default DashboardIndex;
