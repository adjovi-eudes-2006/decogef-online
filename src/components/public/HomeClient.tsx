"use client";

import { RecentOrderBanner } from "./RecentOrderBanner";
import { TicketLookup } from "./TicketLookup";

export function HomeClient() {
  return (
    <>
      <RecentOrderBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <TicketLookup />
      </div>
    </>
  );
}
