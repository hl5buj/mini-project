import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">
          {label}
          {required && <span className="text-[--color-primary] ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5
          bg-[--color-bg-secondary]
          border border-[--color-border]
          rounded-md
          text-[--color-text-primary]
          placeholder-[--color-text-disabled]
          focus:outline-none
          focus:ring-2
          focus:ring-[--color-primary]
          focus:border-transparent
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-[--color-primary] focus:ring-[--color-primary]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[--color-primary]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
