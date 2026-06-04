import { redirect } from "next/navigation";
import { UsernameForm } from "@/components/onboarding/username-form";
import { getCurrentUser } from "@/lib/session";

export default async function SelectUsernamePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.username) redirect("/dashboard");

  return <UsernameForm />;
}
