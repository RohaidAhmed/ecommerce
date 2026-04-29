import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="font-display text-4xl font-bold">Welcome back</h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Sign in to your account to continue
                    </p>
                </div>

                <LoginForm />

                <p className="text-center text-sm text-[var(--color-muted)]">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}