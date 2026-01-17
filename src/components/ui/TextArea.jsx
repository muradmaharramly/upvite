function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
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
      <textarea
        id={name}
        name={name}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        {...rest}
      />
      {helper && !error && <p className="field-helper">{helper}</p>}
      {error && <p className="field-error-text">{error}</p>}
    </div>
  )
}

export default TextArea

