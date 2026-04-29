import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-display text-4xl font-bold">Create account</h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Join us — it only takes a minute
                    </p>
                </div>

                <RegisterForm />

                <p className="text-center text-sm text-[var(--color-muted)]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}