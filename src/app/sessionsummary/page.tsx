import { redirect } from "next/navigation";

export default function SessionSummaryRedirect() {
  redirect("/summary");
}
