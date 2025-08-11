import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
                destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
                outline: "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
                success: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg",
                warning: "bg-amber-500 text-white shadow-md hover:bg-amber-600 hover:shadow-lg",
                danger: "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg",
                gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70",
            },
            size: {
                xs: "h-7 px-2.5 text-xs rounded-md",
                sm: "h-8 px-3 text-sm rounded-md",
                default: "h-10 px-4",
                lg: "h-12 px-6 text-base",
                xl: "h-14 px-8 text-lg rounded-xl",
                icon: "h-10 w-10 p-0",
                "icon-sm": "h-8 w-8 p-0 rounded-md",
                "icon-lg": "h-12 w-12 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
        "icon-sm": 14,
        "icon-lg": 20,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

    // Loading spinner with better styling
    const LoadingSpinner = () => (
        <div className="inline-flex items-center">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>
    );

    // Icon rendering with improved spacing
    const renderIcon = () => {
        if (!iconName || loading) return null;

        return (
            <Icon
                name={iconName}
                size={calculatedIconSize}
                className="flex-shrink-0"
            />
        );
    };

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                loading && "cursor-wait"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {!loading && iconName && iconPosition === 'left' && renderIcon()}
            {children && (
                <span className={cn(loading && "ml-2")}>
                    {children}
                </span>
            )}
            {!loading && iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";

export default Button;