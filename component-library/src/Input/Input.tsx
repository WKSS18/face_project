import type { InputHTMLAttributes } from 'react'
export type InputProps = InputHTMLAttributes<HTMLInputElement>
export function Input({ placeholder, ...rest }: InputProps) {
    return (
        <input type="text" placeholder={placeholder} {...rest} />
    )
}