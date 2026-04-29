import { createServerClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

export async function getCategories() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (error) throw new Error(error.message)
    return (data ?? []) as Category[]
}