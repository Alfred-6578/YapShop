import { Toaster } from "sonner"

import DashboardShell from "@/components/layout/DashboardShell"
import { RealtimeProvider } from "@/lib/realtime/RealtimeProvider"

// Auth is enforced at the edge by middleware.ts — by the time this layout
// renders, the user already has a `yapshop_authed` cookie. No client-side
// route guard needed here.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealtimeProvider>
      <DashboardShell>{children}</DashboardShell>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#16171B",
            border: "0.5px solid rgba(255,255,255,0.08)",
            color: "#ECEEF0",
            fontSize: "12px",
          },
        }}
      />
    </RealtimeProvider>
  )
}

export default DashboardLayout
