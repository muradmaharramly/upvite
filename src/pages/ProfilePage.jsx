import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function ProfilePage() {
  const user = useSelector((state) => state.auth.user)
  const batches = useSelector((state) => state.invitations.batches)

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

  function downloadCsv(batch) {
    const rows = batch.items.map((item) => ({
      first_name: item.first_name,
      last_name: item.last_name,
      share_url: `${window.location.origin}/invite/${batch.templateSlug}/${item.slug}`,
    }))
    const header = Object.keys(rows[0]).join(',')
    const body = rows.map((row) => Object.values(row).join(',')).join('\n')
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invitations-${batch.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
              key={batch.id}
              title={`${batch.count} invitation${batch.count === 1 ? '' : 's'}`}
              subtitle={`Template: ${batch.templateLabel}`}
              footer={
                <Button variant="secondary" onClick={() => downloadCsv(batch)}>
                  Download CSV with share links
                </Button>
              }
            >
              <div className="profile-batch-header">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
