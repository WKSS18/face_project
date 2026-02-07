import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 视觉变体 */
  variant?: ButtonVariant
  /** 尺寸 */
  size?: ButtonSize
  /** 是否块级按钮（占满宽度） */
  block?: boolean
  /** 是否加载中 */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classNames = [
    'fp-btn',
    `fp-btn--${variant}`,
    `fp-btn--${size}`,
    block && 'fp-btn--block',
    loading && 'fp-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classNames}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading && <span className="fp-btn__spinner" aria-hidden />}
      <span className={loading ? 'fp-btn__content--hidden' : undefined}>
        {children}
      </span>
    </button>
  )
}
