import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  fetchInvitationBatches,
  deleteInvitationBatch,
} from '../features/invitations/invitationsSlice'
import { FiTrash } from 'react-icons/fi'

function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const batches = useSelector((state) => state.invitations.batches)
  const captureRef = useRef(null)
  const [captureConfig, setCaptureConfig] = useState(null)
  const [openLinksBatchId, setOpenLinksBatchId] = useState(null)

  useEffect(() => {
    if (user) {
      dispatch(fetchInvitationBatches())
    }
  }, [user, dispatch])

  const hasBatches = batches && batches.length > 0

  const mappedBatches = useMemo(
    () =>
      batches.map((batch) => {
        const { invitation, items } = batch
        const count = items.length
        const templateLabel =
          invitation.template_slug === 'minimal'
            ? 'Minimal'
            : invitation.template_slug === 'bold'
              ? 'Bold'
              : 'Classic'
        return {
          id: invitation.id,
          createdAt: invitation.created_at,
          templateSlug: invitation.template_slug,
          templateLabel,
          count,
          items,
          invitationText: invitation.text_content,
          eventDate: invitation.event_date,
          eventLocation: invitation.event_location,
        }
      }),
    [batches],
  )

  const totalInvitations = useMemo(
    () => (hasBatches ? batches.reduce((sum, batch) => sum + batch.items.length, 0) : 0),
    [batches, hasBatches],
  )

  const mostUsedTemplateLabel = useMemo(() => {
    if (!hasBatches) return 'None yet'
    const counts = new Map()
    mappedBatches.forEach((batch) => {
      const current = counts.get(batch.templateLabel) || 0
      counts.set(batch.templateLabel, current + batch.count)
    })
    let topLabel = 'Unknown'
    let topCount = 0
    counts.forEach((count, label) => {
      if (count > topCount) {
        topCount = count
        topLabel = label
      }
    })
    return topLabel
  }, [mappedBatches, hasBatches])

  function toggleLinks(batch) {
    if (!batch.items || batch.items.length === 0) {
      return
    }
    setOpenLinksBatchId((current) => (current === batch.id ? null : batch.id))
  }

  async function downloadDesigns(batch) {
    if (!batch.items || batch.items.length === 0) {
      return
    }
    for (const item of batch.items) {
      setCaptureConfig({
        templateSlug: batch.templateSlug,
        firstName: item.first_name,
        lastName: item.last_name,
        text: batch.invitationText,
        eventDate: batch.eventDate,
        eventLocation: batch.eventLocation,
      })
      await new Promise((resolve) => setTimeout(resolve, 50))
      if (!captureRef.current) continue
      await toPng(captureRef.current, { cacheBust: true }).then((dataUrl) => {
        const link = document.createElement('a')
        const safeFirst = item.first_name || 'guest'
        const safeLast = item.last_name || ''
        link.href = dataUrl
        link.download = `invitation-${safeFirst}-${safeLast || 'image'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
    setCaptureConfig(null)
  }

  function getBatchLink(batch, item) {
    const params = new URLSearchParams()
    if (batch.invitationText) params.set('text', batch.invitationText)
    if (batch.eventDate) params.set('date', batch.eventDate)
    if (batch.eventLocation) params.set('location', batch.eventLocation)
    const qs = params.toString()
    return `/invite/${batch.templateSlug}/${item.slug}${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="profile-page">
      <header className="page-header">
        <div>
          <h1>My invitations</h1>
          <p>
            {user
              ? 'Every saved invitation batch appears here with quick download and share options.'
              : 'Sign in to see saved invitation batches and download shareable links.'}
          </p>
        </div>
      </header>
      <section className="profile-overview-grid">
        <Card title="Total invitations">
          <p className="profile-overview-value">{totalInvitations}</p>
        </Card>
        <Card title="Saved batches">
          <p className="profile-overview-value">{hasBatches ? batches.length : 0}</p>
        </Card>
        <Card title="Most used template">
          <p className="profile-overview-value">{mostUsedTemplateLabel}</p>
        </Card>
      </section>
      {!hasBatches && (
        <Card title="No invitations yet" subtitle="Your invitation history is empty">
          <div className="empty-state profile-empty-state">
            <div className="profile-empty-illustration" aria-hidden="true">
              <span className="profile-empty-glass" />
            </div>
            <p className="empty-state-title">You have not created any invitations yet</p>
            <p className="empty-state-text">
              Use manual or bulk mode to generate invitations. When you save a batch while
              signed in, it will appear here.
            </p>
          </div>
        </Card>
      )}
      {hasBatches && (
        <div className="profile-batch-grid">
          {mappedBatches.map((batch) => (
            <Card
              className="profile-batch-card"
              key={batch.id}
              title={`${batch.count} invitation${batch.count === 1 ? '' : 's'}`}
              subtitle={`Template: ${batch.templateLabel}`}
              footer={
                <>
                  <Button variant="secondary" onClick={() => downloadDesigns(batch)}>
                    Download designs as PNG
                  </Button>
                  <Button variant="ghost" onClick={() => toggleLinks(batch)}>
                    Show all links
                  </Button>
                </>
              }
            >
              <div className="profile-batch-header">
                <Button
                  className="btn delete-btn btn-danger"
                  variant="danger"
                  size="sm"
                  onClick={() => dispatch(deleteInvitationBatch(batch.id))}
                >
                  <FiTrash />
                </Button>
                <div className="profile-batch-header-main">

                  <div className="profile-batch-avatar">
                    {batch.templateLabel ? batch.templateLabel.charAt(0) : 'I'}
                  </div>
                  <div>
                    <p className="profile-batch-meta">
                      Share URLs use /invite/{batch.templateSlug}/first-last
                    </p>
                    <p className="profile-batch-date">
                      Created on{' '}
                      {batch.createdAt
                        ? new Date(batch.createdAt).toLocaleDateString()
                        : 'unknown date'}
                    </p>
                  </div>
                </div>
                <span className="status-badge status-badge-success">Active</span>
              </div>
              {openLinksBatchId === batch.id && (
                <div className="profile-batch-links">
                  <p className="profile-batch-links-title">Share links</p>
                  <ul className="profile-batch-links-list">
                    {batch.items.map((item) => (
                      <li key={item.id || item.slug} className="profile-batch-links-item">
                        <span className="profile-batch-links-name">
                          {item.first_name} {item.last_name}
                        </span>
                        <a
                          href={getBatchLink(batch, item)}
                          target="_blank"
                          rel="noreferrer"
                          className="profile-batch-links-url"
                        >
                          /invite/{batch.templateSlug}/{item.slug}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        {captureConfig && (
          <section
            ref={captureRef}
            className={`invite-card invite-card-${captureConfig.templateSlug}`}
          >
            <p className="invite-label">Invitation</p>
            <h1 className="invite-name">
              {captureConfig.firstName} {captureConfig.lastName}
            </h1>
            <p className="invite-text">
              {captureConfig.text ||
                'You are invited to this event. The host used Upvite to generate personalized invitations for every guest.'}
            </p>
            <p className="invite-meta">
              {(captureConfig.eventDate || 'Event date') +
                ' • ' +
                (captureConfig.eventLocation || 'Location')}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
