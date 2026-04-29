import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (path) revalidatePath(path)
    if (tag) revalidateTag(tag, 'max')

    return NextResponse.json({ revalidated: true, ts: Date.now() })
}