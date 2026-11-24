import { notFound } from "next/navigation";

/** CB-NAT Review was removed from Momo; its saved tests and tries stay in the database. */
export default function RemovedPage() {
  notFound();
}
