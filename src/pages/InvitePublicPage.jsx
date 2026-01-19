import { useParams, useLocation, Link } from 'react-router-dom'
import AppLogoTransparent from '../assets/images/upvite-logo-transparent.png'

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
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const customText = searchParams.get('text') || ''
  const eventDate = searchParams.get('date') || ''
  const eventLocation = searchParams.get('location') || ''
  const hasDetails = Boolean(customText || eventDate || eventLocation)

  return (
    <div className="invite-public-page">
      <div className="invite-public-inner">
        <section className={`invite-card invite-card-${templateSlug}`}>
        <div className='img-div'><img src={AppLogoTransparent} /></div>
          <p className="invite-label">Invitation</p>
          <h1 className="invite-name">{fullName || 'Your guest'}</h1>
          <p className="invite-text">
            {customText ||
              'You are invited to this event. The host used Upvite to generate personalized invitations for every guest.'}
          </p>
          <p className="invite-meta">
            {hasDetails
              ? `${eventDate || 'Event date'} • ${eventLocation || 'Location'}`
              : 'Event details are not available in this preview. Sign in to Upvite to see the full invitation configuration.'}
          </p>
        </section>
        <div className="invite-public-footer">
          <div className="invite-public-actions">
            <a href="/" className="btn btn-primary btn-sm">
              Open Upvite
            </a>
            <a href="/builder" className="btn btn-secondary btn-sm">
              Create your own invitation
            </a>
          </div>
          <p className="invite-public-meta">
            This invitation made with <Link to="/">Upvite</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InvitePublicPage
