"use client"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2"

import Avatar from "@/components/ui/Avatar"
import { useTheme } from "@/context/ThemeProvider"
import { logout } from "@/lib/api/auth"
import { getCurrentStaff } from "@/lib/api/staff"

type Placement = "sidebar" | "topbar"

interface Props {
  /**
   * Where this menu lives in the chrome. Controls popover anchor:
   *  - "sidebar": pops to the right of the avatar block, bottom-aligned.
   *  - "topbar": pops below the avatar, right-aligned to the trigger.
   */
  placement: Placement
}

const UserMenu = ({ placement }: Props) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { theme, toggle: toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const me = meQuery.data ?? null

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      // Capture position at open-time so the popover anchors correctly even
      // if layout shifts later. Closes lose the rect so a stale capture
      // doesn't survive the next open.
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    setOpen((o) => !o)
  }

  // Click outside closes. Uses mousedown so it fires before any nested
  // onClick (the trigger toggle runs on click, AFTER mousedown). Checks
  // both trigger AND popover refs since they're now in different DOM
  // subtrees thanks to the portal.
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener("mousedown", onMouseDown)
    return () => window.removeEventListener("mousedown", onMouseDown)
  }, [open])

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Run on both success AND error — `logout()` clears local tokens
      // either way, and we always want the cache nuked + a redirect to
      // login so the next user doesn't see the previous user's data.
      queryClient.clear()
      router.replace("/")
    },
  })

  const name = me?.name ?? "…"
  const role = me?.role ?? null

  /**
   * Position styles, using CSS transforms to align the popover by edge
   * without needing to measure its size.
   *  - sidebar: top-left corner at (trigger.bottom, trigger.right + 8),
   *    then translateY(-100%) lifts the popover so its BOTTOM aligns with
   *    trigger.bottom. Safe whether the trigger is near the top or bottom
   *    of the viewport.
   *  - topbar: top-left corner at (trigger.bottom + 8, trigger.right),
   *    then translateX(-100%) shifts it left so its RIGHT aligns with
   *    trigger.right. Standard dropdown-from-icon pattern.
   */
  const popoverStyle: React.CSSProperties | undefined = triggerRect
    ? placement === "sidebar"
      ? {
          position: "fixed",
          top: triggerRect.bottom,
          left: triggerRect.right + 8,
          transform: "translateY(-100%)",
        }
      : {
          position: "fixed",
          top: triggerRect.bottom + 8,
          left: triggerRect.right,
          transform: "translateX(-100%)",
        }
    : undefined

  const popover = open && popoverStyle && (
    <div
      ref={popoverRef}
      style={popoverStyle}
      className="w-56 bg-card border border-border rounded-[8px] shadow-lg py-1 z-50"
    >
      {me && (
        <div className="px-3 py-2 border-b border-border">
          <div className="text-[12.5px] font-medium text-fg truncate">
            {me.name}
          </div>
          {role && (
            <div className="text-[10px] text-fg-subtle truncate mt-0.5 capitalize">
              {role}
            </div>
          )}
        </div>
      )}

      {/* Theme toggle — only in the topbar variant because the desktop
          chrome already exposes a theme toggle in the TopBar itself,
          while the mobile chrome (which this menu replaces) doesn't. */}
      {placement === "topbar" && (
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full text-left text-[12px] px-3 py-2 hover:bg-white/2 flex items-center gap-2 cursor-pointer text-fg border-b border-border"
        >
          {theme === "dark" ? (
            <HiOutlineSun size={14} />
          ) : (
            <HiOutlineMoon size={14} />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      )}

      <button
        type="button"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="w-full text-left text-[12px] px-3 py-2 hover:bg-white/2 flex items-center gap-2 cursor-pointer text-[#F09595] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiOutlineArrowRightOnRectangle size={14} />
        {logoutMutation.isPending ? "Signing out…" : "Sign out"}
      </button>
    </div>
  )

  return (
    <>
      {placement === "sidebar" ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          aria-label="Account menu"
          aria-expanded={open}
          className="flex items-center gap-3 px-3 h-10 w-full text-left rounded-control cursor-pointer hover:bg-card-hover"
        >
          <span className="shrink-0">
            <Avatar
              name={name}
              size="md"
              // Override Avatar's default bg-card-hover which blends into
              // the sidebar's bg-panel. Accent doubles as a "this is YOU"
              // signal, distinct from any other avatar on the page.
              className="bg-accent text-accent-fg"
            />
          </span>
          <span className="text-[12.5px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 truncate">
            {name}
          </span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          aria-label="Account menu"
          aria-expanded={open}
          className="inline-flex cursor-pointer"
        >
          <Avatar
            name={name}
            size="sm"
            className="bg-accent text-accent-fg"
          />
        </button>
      )}

      {/* Portal the popover into document.body so it escapes the sidebar's
          `overflow-x-hidden` clip (which would otherwise hide the entire
          popover that opens to the right of the trigger). */}
      {popover && typeof document !== "undefined"
        ? createPortal(popover, document.body)
        : null}
    </>
  )
}

export default UserMenu
