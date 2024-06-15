"use client";

import { Button } from "../ui/button";
import { logoutAction } from "@/actions";

export default function Logout() {
  async function handleLogout() {
    await logoutAction();
  }

  return <Button onClick={handleLogout}>Logout</Button>;
}
