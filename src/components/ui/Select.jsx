function Select({ label, name, value, onChange, options, placeholder, error, helper }) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="field-label">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className="field-input"
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && !error && <p className="field-helper">{helper}</p>}
      {error && <p className="field-error-text">{error}</p>}
    </div>
  )
}

export default Select

