'use client'

import { useT } from '@/context/IdiomaContext'
import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react'
import { isExternalHref } from '@/lib/routes'

export type ButtonVariant = 'primary' | 'secondary' | 'signature' | 'ghost' | 'text'
export type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-5 text-sm gap-2',
  md: 'min-h-11 px-7 text-sm gap-2',
  lg: 'min-h-[52px] px-9 text-base gap-2.5',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'cta-base focus-ring-genesis pointer-events-auto',
  signature: 'cta-signature focus-ring-signature pointer-events-auto',
  secondary: 'cta-secondary focus-ring-genesis pointer-events-auto',
  ghost:
    'inline-flex items-center justify-center rounded-full font-display font-semibold text-genesis-mist bg-transparent border border-transparent hover:text-genesis-text hover:bg-white/5 transition-base ease-in-out-smooth focus-ring-genesis pointer-events-auto',
  text:
    'inline-flex items-center justify-center font-display font-medium text-genesis-ion bg-transparent border-0 hover:underline underline-offset-4 transition-fast ease-in-out-smooth focus-ring-genesis pointer-events-auto',
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      children,
      className,
      disabled = false,
      icon,
      iconPosition = 'left',
      href,
      ...rest
    },
    ref
  ) {
    const t = useT()

    const classes = cn(
      variant !== 'primary' && variant !== 'secondary' && variant !== 'signature' && 'inline-flex',
      sizeClasses[size],
      variantClasses[variant],
      disabled && 'opacity-40 pointer-events-none cursor-not-allowed',
      className
    )

    /* Solo el texto se traduce; un icono o un nodo compuesto pasan intactos. */
    const content = (
      <>
        {icon && iconPosition === 'left' ? icon : null}
        {typeof children === 'string' ? t(children) : children}
        {icon && iconPosition === 'right' ? icon : null}
      </>
    )

    if (href && !disabled) {
      const { target, rel, ...linkRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
      const external = isExternalHref(href)
      const resolvedTarget = target ?? (external ? '_blank' : undefined)
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target={resolvedTarget}
          rel={rel ?? (resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined)}
          {...linkRest}
        >
          {content}
        </a>
      )
    }

    const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonRest.type ?? 'button'}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        {...buttonRest}
      >
        {content}
      </button>
    )
  }
)
