// components/ui/FormField.tsx
'use client'

import { cn } from '@/lib/utils'

type FormFieldProps = {
    label: string
    name: string
    type?: string
    placeholder?: string
    autoComplete?: string
    required?: boolean
    error?: string | string[]
    defaultValue?: string
}

export function FormField({
    label,
    name,
    type = 'text',
    placeholder,
    autoComplete,
    required,
    error,
    defaultValue,
}: FormFieldProps) {
    const errorMsg = Array.isArray(error) ? error[0] : error

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={name}
                className="text-xs font-semibold uppercase tracking-widest text-[#737373]"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                defaultValue={defaultValue}
                className={cn(
                    'w-full rounded-none border-b bg-transparent py-2.5 text-sm text-[#0f0f0f]',
                    'placeholder:text-[#d4d4d4] outline-none transition-colors duration-200',
                    'focus:border-[#0f0f0f]',
                    errorMsg ? 'border-[#dc2626]' : 'border-[#e5e5e5]'
                )}
            />
            {errorMsg && (
                <p className="text-xs text-[#dc2626]">{errorMsg}</p>
            )}
        </div>
    )
}