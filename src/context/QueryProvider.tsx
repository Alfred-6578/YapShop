"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Wrap the (dashboard) layout (or the root layout) in this provider once.
 *
 * Defaults tuned for an ops dashboard:
 *  - 30s staleTime — KPIs feel "live" without spamming the API on tab focus
 *  - 1 retry — transient blips, not infinite loops
 *  - no refetchOnWindowFocus — operators alt-tab constantly; spammy otherwise
 *  - 5min gcTime — keep recently viewed data warm for back-nav
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
