import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { createSlugForName } from '../utils/slug'
import { setTemplateSlug, updateManualField, createInvitationBatch } from '../features/invitations/invitationsSlice'

const templateOptions = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
]

function ManualBuilderPage() {
  const dispatch = useDispatch()
  const manual = useSelector((state) => state.invitations.manual)
  const templateSlug = useSelector((state) => state.invitations.templateSlug)
  const user = useSelector((state) => state.auth.user)

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
    const params = new URLSearchParams()
    if (manual.text) params.set('text', manual.text)
    if (manual.eventDate) params.set('date', manual.eventDate)
    if (manual.eventLocation) params.set('location', manual.eventLocation)
    const query = params.toString()
    const url = query
      ? `${origin}/invite/${templateSlug}/${slug}?${query}`
      : `${origin}/invite/${templateSlug}/${slug}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
      toast.success('Share link copied')
    } else {
      toast.info(url)
    }
  }

  async function handleSave() {
    if (!manual.firstName && !manual.lastName) {
      toast.error('Enter a name and surname first')
      return
    }
    const result = await dispatch(
      createInvitationBatch({
        recipients: [{ firstName: manual.firstName, lastName: manual.lastName }],
        templateSlug: templateSlug,
        invitationData: {
          text: manual.text,
          eventDate: manual.eventDate,
          eventLocation: manual.eventLocation,
        },
      }),
    )
    if (createInvitationBatch.fulfilled.match(result)) {
      toast.success('Invitation saved to profile')
    } else if (result.payload) {
      toast.error(result.payload)
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
      <div className="builder-steps">
        <div className="builder-step is-active">
          <span className="builder-step-index">1</span>
          <span className="builder-step-label">Recipient</span>
        </div>
        <div className="builder-step">
          <span className="builder-step-index">2</span>
          <span className="builder-step-label">Message &amp; event</span>
        </div>
        <div className="builder-step">
          <span className="builder-step-index">3</span>
          <span className="builder-step-label">Template &amp; link</span>
        </div>
      </div>
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
          <div className="field">
            <div className="field-label">Invitation template</div>
            <div className="template-grid">
              {templateOptions.map((option) => {
                const isActive = option.value === templateSlug
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`template-card${isActive ? ' is-active' : ''}`}
                    onClick={() => dispatch(setTemplateSlug(option.value))}
                  >
                    <span className="template-card-label">Preset</span>
                    <span className="template-card-name">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="builder-actions">
            <Button variant="secondary" onClick={handleCopyLink}>
              Copy share link
            </Button>
            {user && (
              <Button onClick={handleSave} style={{ marginLeft: '0.5rem' }}>
                Save to profile
              </Button>
            )}
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
