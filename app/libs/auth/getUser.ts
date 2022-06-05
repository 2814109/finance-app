import auth from "~/components/firebase/auth";

export async function getUser() {
  return auth.currentUser;
}
