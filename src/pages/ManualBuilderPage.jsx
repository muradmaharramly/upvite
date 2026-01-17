import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { createSlugForName } from '../utils/slug'
import { setTemplateSlug, updateManualField } from '../features/invitations/invitationsSlice'

const templateOptions = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
]

function ManualBuilderPage() {
  const dispatch = useDispatch()
  const manual = useSelector((state) => state.invitations.manual)
  const templateSlug = useSelector((state) => state.invitations.templateSlug)

  const slug = createSlugForName(manual.firstName, manual.lastName)

  function handleChange(field) {
    return (event) => {
      dispatch(updateManualField({ field, value: event.target.value }))
    }
  }

  function handleCopyLink() {
    if (!manual.firstName && !manual.lastName) {
      toast.error('Enter a name and surname first')
      return
    }
    const origin = window.location.origin
    const url = `${origin}/invite/${templateSlug}/${slug}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
      toast.success('Share link copied')
    } else {
      toast.info(url)
    }
  }

  return (
    <div className="builder-page">
      <header className="page-header">
        <div>
          <h1>Manual invitation</h1>
          <p>
            Create and preview a single personalized invitation. Perfect for VIPs or quick
            tests.
          </p>
        </div>
      </header>
      <div className="builder-two-column">
        <Card title="Invitation details">
          <div className="form-grid">
            <Input
              name="firstName"
              label="First name"
              placeholder="Ali"
              value={manual.firstName}
              onChange={handleChange('firstName')}
            />
            <Input
              name="lastName"
              label="Last name"
              placeholder="Aliyev"
              value={manual.lastName}
              onChange={handleChange('lastName')}
            />
          </div>
          <TextArea
            name="text"
            label="Invitation text"
            placeholder="We are excited to invite you..."
            rows={4}
            value={manual.text}
            onChange={handleChange('text')}
          />
          <div className="form-grid">
            <Input
              name="eventDate"
              label="Event date"
              type="date"
              value={manual.eventDate}
              onChange={handleChange('eventDate')}
            />
            <Input
              name="eventLocation"
              label="Event location"
              placeholder="Venue name, city"
              value={manual.eventLocation}
              onChange={handleChange('eventLocation')}
            />
          </div>
          <Select
            name="template"
            label="Invitation template"
            value={templateSlug}
            onChange={(event) => dispatch(setTemplateSlug(event.target.value))}
            options={templateOptions}
          />
          <div className="builder-actions">
            <Button variant="secondary" onClick={handleCopyLink}>
              Copy share link
            </Button>
          </div>
        </Card>
        <Card title="Live preview">
          {manual.firstName || manual.lastName ? (
            <div className="invite-preview">
              <section className={`invite-card invite-card-${templateSlug}`}>
                <p className="invite-label">Invitation</p>
                <h1 className="invite-name">
                  {manual.firstName} {manual.lastName}
                </h1>
                <p className="invite-text">{manual.text || 'Your invitation text'}</p>
                <p className="invite-meta">
                  {manual.eventDate || 'Event date'} • {manual.eventLocation || 'Location'}
                </p>
              </section>
              <p className="invite-preview-link">
                Public URL: /invite/{templateSlug}/{slug}
              </p>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-title">Waiting for details</p>
              <p className="empty-state-text">
                Start by entering a first name and surname. The invitation preview will
                update in real time.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ManualBuilderPage

