'use server'
import { createServerClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations/auth.schema'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginAction(_prevState: unknown, formData: FormData) {
    const parsed = loginSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)
    if (error) return { error: { root: [error.message] } }

    revalidatePath('/', 'layout')
    redirect('/account/orders')
}

export async function registerAction(_prevState: unknown, formData: FormData) {
    const parsed = registerSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { data: { full_name: parsed.data.full_name } },
    })
    if (error) return { error: { root: [error.message] } }

    redirect('/account/orders')
}

export async function logoutAction() {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}