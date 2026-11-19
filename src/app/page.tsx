import { redirect } from "next/navigation";

// Root page redirects to the default locale's login page
export default function RootPage() {
  redirect("/fr/login");
}
