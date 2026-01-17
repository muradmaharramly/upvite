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
      {!hasBatches && (
        <Card title="No invitations yet" subtitle="Your invitation history is empty">
          <div className="empty-state">
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
              <p className="profile-batch-meta">
                Share URLs are generated using the pattern /invite/{batch.templateSlug}/
                first-last
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
