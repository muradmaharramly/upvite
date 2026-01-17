function Button({
  as: Component = 'button',
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`]
  if (fullWidth) classes.push('btn-full')
  if (isLoading) classes.push('is-loading')
  const className = classes.join(' ')

  const resolvedProps =
    Component === 'button'
      ? { type, disabled: disabled || isLoading, className, ...rest }
      : { className, ...rest }

  return (
    <Component {...resolvedProps}>
      <span className="btn-label">{children}</span>
    </Component>
  )
}

export default Button

