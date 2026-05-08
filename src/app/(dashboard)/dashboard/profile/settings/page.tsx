import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Settings are part of Profile page with tabs
  redirect("/dashboard/profile");
}
