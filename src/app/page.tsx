"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2'

import BrandMark from '@/components/layout/BrandMark'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    router.push('/dashboard')
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
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="bg-card border border-border-strong/80 rounded-card p-5 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-fg-muted">Email</span>
            <Input
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              icon={<HiOutlineEnvelope size={14} />}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-fg-muted">Password</span>
            <Input
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={<HiOutlineLockClosed size={14} />}
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
            disabled={submitting}
            className="w-full justify-center mt-1"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-[11.5px] text-fg-muted mt-4">
          New to YapShop?{' '}
          <a href="#" className="text-[#6FD9A0] hover:underline">
            Request access
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
