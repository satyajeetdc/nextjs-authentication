import { fetchAuthUserAction } from "@/actions";
import Logout from "@/components/log-out";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await fetchAuthUserAction();

  if (!currentUser?.success) {
    redirect("/sign-in");
  }
  return (
    <div>
      <h1>NextJS Authentication</h1>
      <h1>{currentUser?.data?.username}</h1>
      <p>{currentUser?.data?.email}</p>
      <Logout />
    </div>
  );
}
