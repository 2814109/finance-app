import { FC, useEffect } from "react";
import type { ActionFunction } from "@remix-run/node";
import { bulkInsert } from "~/firebaseAdmin.server";
import { Form } from "@remix-run/react";
import { getSession } from "~/sessions";
import { getUid } from "~/firebaseAdmin.server";

const Index: FC = () => null;

export default Index;
