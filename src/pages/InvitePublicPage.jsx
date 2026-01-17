import { useParams } from 'react-router-dom'

function formatNameFromSlug(slug) {
  if (!slug) return ''
  const parts = slug.split('-')
  const first = parts[0] || ''
  const last = parts.slice(1).join(' ')
  const capitalize = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''
  return [capitalize(first), capitalize(last)].filter(Boolean).join(' ')
}

function InvitePublicPage() {
  const { templateSlug, slug } = useParams()
  const fullName = formatNameFromSlug(slug)

  return (
    <div className="invite-public-page">
      <section className={`invite-card invite-card-${templateSlug}`}>
        <p className="invite-label">Invitation</p>
        <h1 className="invite-name">{fullName || 'Your guest'}</h1>
        <p className="invite-text">
          You are invited to this event. The host used Upvite to generate personalized
          invitations for every guest.
        </p>
        <p className="invite-meta">
          Event details are not available in this preview. Sign in to Upvite to see the
          full invitation configuration.
        </p>
      </section>
    </div>
  )
}

export default InvitePublicPage

