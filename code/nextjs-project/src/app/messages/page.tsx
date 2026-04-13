import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

type MessagesPageProps = {
  searchParams?: Promise<{
    user?: string | string[];
  }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialUserId = Array.isArray(resolvedSearchParams?.user)
    ? resolvedSearchParams.user[0]
    : resolvedSearchParams?.user;

  return (
    <Suspense fallback={<div className="messages-page">Loading messages...</div>}>
      <MessagesClient initialUserId={initialUserId} />
    </Suspense>
  );
}
