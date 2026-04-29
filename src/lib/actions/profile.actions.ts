'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function updateProfile(_prevState: unknown, formData: FormData) {
    const parsed = profileSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { root: ['Not authenticated'] } }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: parsed.data.full_name })
        .eq('id', user.id)

    if (error) return { error: { root: [error.message] } }

    revalidatePath('/account/profile')
    return { success: true }
}

// export async function updatePassword(_prevState: unknown, formData: FormData) {
//     const password = formData.get('password') as string
//     const confirmPassword = formData.get('confirm_password') as string

//     if (!password || password.length < 8)
//         return { error: { password: ['Password must be at least 8 characters'] } }
//     if (password !== confirmPassword)
//         return { error: { confirm_password: ['Passwords do not match'] } }

//     const supabase = await createServerClient()
//     const { error } = await supabase.auth.updateUser({ password })
//     if (error) return { error: { root: [error.message] } }

//     return { success: true }
// }

export async function updatePassword(_prevState: unknown, formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (!password || password.length < 8)
        return {
            error: {
                password: ['Password must be at least 8 characters'],
                confirm_password: [] as string[],
                root: [] as string[]
            }
        }
    if (password !== confirmPassword)
        return {
            error: {
                password: [] as string[],
                confirm_password: ['Passwords do not match'],
                root: [] as string[]
            }
        }

    const supabase = await createServerClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error)
        return {
            error: {
                password: [] as string[],
                confirm_password: [] as string[],
                root: [error.message]
            }
        }

    return { success: true }
}
