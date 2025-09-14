import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Link href="/" className="py-4 text-blue-800">
        Back Home
      </Link>
    </div>
  );
}
