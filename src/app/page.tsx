"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineEnvelope,
  HiOutlineExclamationTriangle,
  HiOutlineLockClosed,
} from "react-icons/hi2"

import BrandMark from "@/components/layout/BrandMark"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { login } from "@/lib/api/auth"

const LoginForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const next = searchParams?.get("next") ?? "/dashboard"

  const [username, setUsername] = useState("admin@store.com") // Pre-fill for easier local testing. Remove in production.
  const [password, setPassword] = useState("password") // Pre-fill for easier local testing. Remove in production.

  const loginMutation = useMutation({
    mutationFn: ({ u, p }: { u: string; p: string }) => login(u, p),
    onSuccess: (data) => {
      // Prime the `me` cache so the conversations page (and anything else
      // gated on currentStaff) doesn't have to roundtrip immediately.
      queryClient.setQueryData(["staff", "me"], data.staff)
      router.push(next)
    },
  })

  const errorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    loginMutation.mutate({ u: username.trim(), p: password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center gap-3 mb-6">
          <BrandMark size="md" />
          <div className="text-center">
            <h1 className="text-[20px] font-medium tracking-tight">Welcome back</h1>
            <p className="text-[12.5px] text-fg-muted mt-1">
              Sign in to your YapShop dashboard
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-strong/80 rounded-card p-5 flex flex-col gap-3"
        >
          {errorMessage && (
            <div className="flex items-start gap-2 text-[11.5px] text-[#F09595] bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[8px] px-3 py-2">
              <HiOutlineExclamationTriangle size={13} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-fg-muted">Email or username</span>
            <Input
              value={username}
              onChange={()=>{}}
              placeholder="you@example.com"
              icon={<HiOutlineEnvelope size={14} />}
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-fg-muted">Password</span>
            <Input
              type="password"
              value={password}
              onChange={()=>{}}
              placeholder="••••••••"
              icon={<HiOutlineLockClosed size={14} />}
              autoComplete="current-password"
            />
          </label>

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5 text-fg-muted cursor-pointer">
              <input type="checkbox" className="accent-accent" />
              Remember me
            </label>
            <a href="#" className="text-[#6FD9A0] hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full justify-center mt-1"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-[11.5px] text-fg-muted mt-4">
          New to YapShop?{" "}
          <a href="#" className="text-[#6FD9A0] hover:underline">
            Request access
          </a>
        </p>
      </div>
    </div>
  )
}

const LoginPage = () => {
  // Wrap in Suspense — useSearchParams requires it under Next.js App Router.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
