function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  ...rest
}) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="field-label">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      {helper && !error && <p className="field-helper">{helper}</p>}
      {error && <p className="field-error-text">{error}</p>}
    </div>
  )
}

export default Input

