import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ElementType;
    fullWidth?: boolean;
    as?: React.ElementType;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    fullWidth = false,
    className = '',
    disabled,
    as: Component = 'button',
    ...props
}: ButtonProps) {
    const baseStyles = 'relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_20px_rgba(160,107,255,0.3)] hover:shadow-[0_0_30px_rgba(160,107,255,0.5)] hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-neon-purple/50 dark:hover:border-neon-purple/50',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
        ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <Component
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Ripple Effect Container */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : Icon ? (
                    <Icon className="w-5 h-5" />
                ) : null}
                {children}
            </div>

            {/* Hover Glow Effect for Primary */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
        </Component>
    );
}
