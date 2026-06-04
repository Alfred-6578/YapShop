"use client"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useQueryClient } from "@tanstack/react-query"

import { handleRealtimeEvent, type RealtimeEvent } from "./eventHandlers"

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ??
  "wss://bulldozer-eel-visa.ngrok-free.dev/ws"

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"

type RealtimeContextValue = { status: ConnectionStatus }

const RealtimeContext = createContext<RealtimeContextValue>({
  status: "connecting",
})

export function useRealtimeStatus(): ConnectionStatus {
  return useContext(RealtimeContext).status
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptRef = useRef(0)
  const stoppedRef = useRef(false)
  const [status, setStatus] = useState<ConnectionStatus>("connecting")

  useEffect(() => {
    stoppedRef.current = false

    const connect = () => {
      if (stoppedRef.current) return

      setStatus(
        reconnectAttemptRef.current === 0 ? "connecting" : "reconnecting",
      )

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[realtime] connected")
        reconnectAttemptRef.current = 0
        setStatus("connected")
      }

      ws.onmessage = (event) => {
        try {
          const payload: RealtimeEvent = JSON.parse(event.data)
          handleRealtimeEvent(payload, queryClient)
        } catch (err) {
          console.error("[realtime] bad payload", event.data, err)
        }
      }

      ws.onerror = (err) => {
        console.error("[realtime] socket error", err)
        // Don't close here — onclose will fire and own reconnection.
      }

      ws.onclose = () => {
        if (stoppedRef.current) {
          setStatus("disconnected")
          return
        }

        // Exponential backoff capped at 60s: 3s → 6s → 12s → 24s → 48s → 60s.
        const delay = Math.min(
          3_000 * Math.pow(2, reconnectAttemptRef.current),
          60_000,
        )
        reconnectAttemptRef.current += 1
        console.log(
          `[realtime] reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptRef.current})`,
        )
        setStatus("reconnecting")
        setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      // Stop before closing so the onclose handler bails out of its
      // reconnect path instead of trying to reach an unmounted provider.
      stoppedRef.current = true
      wsRef.current?.close()
    }
  }, [queryClient])

  // Dev-only smoke-test helper. From devtools console:
  //   __realtime.test('new_handoff', { customer_name: 'X', reason: 'Y' })
  // Routes through the real handler so toasts + cache invalidation fire
  // exactly as they would for a server-sent event. Stripped in production.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    if (typeof window === "undefined") return
    const win = window as unknown as {
      __realtime?: {
        test: (event: string, data?: Record<string, unknown>) => void
      }
    }
    win.__realtime = {
      test: (event, data) =>
        handleRealtimeEvent(
          { event, data, timestamp: new Date().toISOString() },
          queryClient,
        ),
    }
    return () => {
      delete win.__realtime
    }
  }, [queryClient])

  return (
    <RealtimeContext.Provider value={{ status }}>
      {children}
    </RealtimeContext.Provider>
  )
}
