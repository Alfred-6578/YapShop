"use client"
import { useRealtimeStatus } from "@/lib/realtime/RealtimeProvider"

const CONFIG = {
  connected: { color: "bg-[#15C26A]", label: "Live", pulse: false },
  connecting: { color: "bg-[#F0A92B]", label: "Connecting…", pulse: true },
  reconnecting: { color: "bg-[#F0A92B]", label: "Reconnecting…", pulse: true },
  disconnected: { color: "bg-[#F09595]", label: "Offline", pulse: false },
} as const

const ConnectionStatus = () => {
  const status = useRealtimeStatus()
  const config = CONFIG[status]

  return (
    <div className="flex items-center gap-1.5 text-[10.5px] text-fg-subtle">
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.color} ${
          config.pulse ? "animate-pulse" : ""
        }`}
      />
      {config.label}
    </div>
  )
}

export default ConnectionStatus
