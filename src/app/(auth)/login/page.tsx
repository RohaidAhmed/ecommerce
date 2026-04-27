// app/(auth)/login/page.tsx

import Link from 'next/link'
import { loginAction, signInWithGoogleAction } from '@/lib/actions/auth.actions'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'

type Props = {
    searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
    const { error } = await searchParams

    return (
        <div className="w-full max-w-sm mx-auto lg:mx-0">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-[#0f0f0f] mb-2">
                    Welcome back
                </h1>
                <p className="text-sm text-[#737373]">
                    Sign in to your account to continue shopping.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
                    <p className="text-sm text-[#dc2626]">
                        {error === 'auth_callback_failed'
                            ? 'Authentication failed. Please try again.'
                            : 'Something went wrong. Please try again.'}
                    </p>
                </div>
            )}

            <form action={signInWithGoogleAction} className="mb-6">
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 rounded-md border border-[#e5e5e5] bg-white px-4 py-2.5 text-sm font-medium text-[#0f0f0f] transition-colors hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
                >
                    Continue with Google
                </button>
            </form>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#e5e5e5]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[#fafafa] px-3 text-xs text-[#737373]">or continue with email</span>
                </div>
            </div>

            <form action={loginAction} className="flex flex-col gap-5">
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                />
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-xs font-semibold uppercase tracking-widest text-[#737373]"
                        >
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-[#737373] underline-offset-4 hover:underline hover:text-[#0f0f0f] transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-none border-b border-[#e5e5e5] bg-transparent py-2.5 text-sm text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f]"
                    />
                </div>
                <SubmitButton className="mt-2">Sign in</SubmitButton>
            </form>

            <p className="mt-8 text-center text-sm text-[#737373]">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-[#0f0f0f] underline-offset-4 hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    )
}


// 'use client';
// // app/(auth)/login/page.tsx

// import Link from 'next/link'
// import { loginAction, signInWithGoogleAction } from '@/lib/actions/auth.actions'
// import { FormField } from '@/components/ui/FormField'
// import { SubmitButton } from '@/components/ui/SubmitButton'
// import { useFormState } from 'react-dom'

// type Props = {
//     searchParams: Promise<{ error?: string }>
// }

// export default async function LoginPage({ searchParams }: Props) {
//     const { error } = await searchParams;

//     const [state, formAction] = useFormState(loginAction, {
//         success: false,
//         error: null,
//     });

//     return (
//         <div className="w-full max-w-sm mx-auto lg:mx-0">
//             {/* Heading */}
//             <div className="mb-10">
//                 <h1 className="text-3xl font-bold tracking-tight text-[#0f0f0f] mb-2">
//                     Welcome back
//                 </h1>
//                 <p className="text-sm text-[#737373]">
//                     Sign in to your account to continue shopping.
//                 </p>
//             </div>

//             {/* OAuth error */}
//             {error && (
//                 <div className="mb-6 rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
//                     <p className="text-sm text-[#dc2626]">
//                         {error === 'auth_callback_failed'
//                             ? 'Authentication failed. Please try again.'
//                             : 'Something went wrong. Please try again.'}
//                     </p>
//                 </div>
//             )}

//             {/* Google OAuth */}
//             <form action={signInWithGoogleAction} className="mb-6">
//                 <button
//                     type="submit"
//                     className="w-full flex items-center justify-center gap-3 rounded-md border border-[#e5e5e5] bg-white px-4 py-2.5 text-sm font-medium text-[#0f0f0f] transition-colors hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
//                 >
//                     <GoogleIcon />
//                     Continue with Google
//                 </button>
//             </form>

//             {/* Divider */}
//             <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                     <span className="w-full border-t border-[#e5e5e5]" />
//                 </div>
//                 <div className="relative flex justify-center">
//                     <span className="bg-[#fafafa] px-3 text-xs text-[#737373]">or continue with email</span>
//                 </div>
//             </div>

//             {/* Login form */}
//             <form action={formAction} className="flex flex-col gap-5">
//                 <FormField
//                     label="Email"
//                     name="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     required
//                 />
//                 <div className="flex flex-col gap-1.5">
//                     <div className="flex items-center justify-between">
//                         <label
//                             htmlFor="password"
//                             className="text-xs font-semibold uppercase tracking-widest text-[#737373]"
//                         >
//                             Password
//                         </label>
//                         <Link
//                             href="/forgot-password"
//                             className="text-xs text-[#737373] underline-offset-4 hover:underline hover:text-[#0f0f0f] transition-colors"
//                         >
//                             Forgot password?
//                         </Link>
//                     </div>
//                     <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         autoComplete="current-password"
//                         required
//                         className="w-full rounded-none border-b border-[#e5e5e5] bg-transparent py-2.5 text-sm text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f]"
//                     />
//                 </div>

//                 <SubmitButton className="mt-2">Sign in</SubmitButton>
//             </form>

//             {/* Register link */}
//             <p className="mt-8 text-center text-sm text-[#737373]">
//                 Don&apos;t have an account?{' '}
//                 <Link
//                     href="/register"
//                     className="font-semibold text-[#0f0f0f] underline-offset-4 hover:underline"
//                 >
//                     Create one
//                 </Link>
//             </p>
//         </div>
//     )
// }

// function GoogleIcon() {
//     return (
//         <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
//             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//         </svg>
//     )
// }