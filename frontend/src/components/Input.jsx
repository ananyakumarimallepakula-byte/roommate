import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  rows,
  as = 'input',
  children,
  ...props
}) => {
  const Component = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      <Component
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows || 3}
        className={as === 'textarea' ? 'form-textarea' : as === 'select' ? 'form-select' : 'form-input'}
        style={error ? { borderColor: 'var(--danger)' } : {}}
        {...props}
      >
        {children}
      </Component>

      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
