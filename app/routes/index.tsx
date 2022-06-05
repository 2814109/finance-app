import firebaseConfig from "~/components/firebase/config";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export let meta = () => {
  return {
    title: "Remix Secrets App",
  };
};

const Index = () => {
  return (
    <div className="remix__page">
      <main>
        <h1>Remix Site</h1>
      </main>
    </div>
  );
};

export default Index;
