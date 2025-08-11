import React from "react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    leftIcon,
    rightIcon,
    onRightIconClick,
    size = "default",
    variant = "default",
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-sm",
        lg: "h-12 px-4 text-base"
    };

    // Variant classes
    const variantClasses = {
        default: "border-border bg-background focus:border-primary focus:ring-primary/20",
        outline: "border-2 border-border bg-transparent focus:border-primary focus:ring-primary/20",
        filled: "border-transparent bg-muted focus:bg-background focus:border-primary focus:ring-primary/20",
        ghost: "border-transparent bg-transparent hover:bg-muted/50 focus:bg-background focus:border-primary focus:ring-primary/20"
    };

    // Base input classes
    const baseInputClasses = cn(
        "flex w-full rounded-lg border text-foreground placeholder:text-muted-foreground transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        sizeClasses[size],
        error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
            : variantClasses[variant],
        leftIcon && "pl-10",
        rightIcon && "pr-10"
    );

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Icon name={leftIcon} size={18} />
                    </div>
                )}

                <input
                    type={type}
                    className={cn(baseInputClasses, className)}
                    ref={ref}
                    id={inputId}
                    {...props}
                />

                {/* Right Icon */}
                {rightIcon && (
                    <div 
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                            onRightIconClick && "cursor-pointer hover:text-foreground transition-colors"
                        )}
                        onClick={onRightIconClick}
                    >
                        <Icon name={rightIcon} size={18} />
                    </div>
                )}
            </div>

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <Icon name="alert-circle" size={16} />
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;