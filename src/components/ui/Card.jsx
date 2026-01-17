function Card({ title, subtitle, children, footer }) {
  return (
    <section className="card">
      {(title || subtitle) && (
        <header className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </header>
      )}
      <div className="card-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </section>
  )
}

export default Card

