import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef(({
    className,
    id,
    checked,
    indeterminate = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    size = "default",
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6"
    };

    const iconSizes = {
        sm: 12,
        default: 16,
        lg: 18
    };

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    id={checkboxId}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    className="sr-only peer"
                    {...props}
                />

                <div
                    className={cn(
                        "relative shrink-0 rounded-lg border-2 border-border bg-background transition-all duration-200 cursor-pointer hover:border-primary/60 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex items-center justify-center",
                        sizeClasses?.[size],
                        checked && "bg-primary border-primary shadow-sm",
                        indeterminate && "bg-primary border-primary shadow-sm",
                        error && "border-destructive hover:border-destructive/80",
                        disabled && "cursor-not-allowed opacity-50 hover:border-border"
                    )}
                >
                    <div className={cn(
                        "transition-all duration-200 ease-out",
                        (checked || indeterminate) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}>
                        {checked && !indeterminate && (
                            <Check 
                                className="text-primary-foreground" 
                                size={iconSizes[size]} 
                                strokeWidth={2.5}
                            />
                        )}
                        {indeterminate && (
                            <Minus 
                                className="text-primary-foreground" 
                                size={iconSizes[size]} 
                                strokeWidth={2.5}
                            />
                        )}
                    </div>
                </div>
            </div>
            {(label || description || error) && (
                <div className="flex-1 space-y-1">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                error ? "text-destructive" : "text-foreground"
                            )}
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    )}

                    {description && !error && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Checkbox.displayName = "Checkbox";

// Checkbox Group component
const CheckboxGroup = React.forwardRef(({
    className,
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    orientation = "vertical", // vertical or horizontal
    ...props
}, ref) => {
    return (
        <fieldset
            ref={ref}
            disabled={disabled}
            className={cn("space-y-4", className)}
            {...props}
        >
            {label && (
                <legend className={cn(
                    "text-sm font-semibold mb-3",
                    error ? "text-destructive" : "text-foreground"
                )}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </legend>
            )}

            {description && !error && (
                <p className="text-sm text-muted-foreground -mt-2 mb-4">
                    {description}
                </p>
            )}

            <div className={cn(
                orientation === "horizontal" 
                    ? "flex flex-wrap gap-6" 
                    : "space-y-3"
            )}>
                {children}
            </div>

            {error && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </fieldset>
    );
});

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
export default Checkbox;