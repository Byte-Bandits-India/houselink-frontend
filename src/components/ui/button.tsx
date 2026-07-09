import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type CommonProps = {
  variant?: "primary" | "secondary" | "icon" | "gradient"
}

type ButtonAsButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonAsLinkProps = CommonProps &
  React.ComponentPropsWithoutRef<typeof Link> & {
    href: string
  }

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { className, variant = "primary", ...rest } = props
    const baseStyles = "inline-flex items-center justify-center transition-colors cursor-pointer"

    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 font-bold text-sm rounded-full",
      secondary: "bg-gray-100 text-primary hover:bg-gray-200 border border-gray-200 font-semibold text-sm rounded-full",
      icon: "flex-shrink-0 bg-primary text-white hover:bg-primary/90 rounded-full",
      gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 font-bold text-sm rounded-full transition-all",
    }

    const classes = cn(baseStyles, variants[variant], className)

    if ("href" in rest && rest.href) {
      const { href, ...linkProps } = rest as ButtonAsLinkProps
      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkProps}
        />
      )
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
