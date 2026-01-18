import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function BuilderPage() {
  return (
    <div className="builder-page">
      <header className="page-header">
        <div>
          <h1>Create invitations</h1>
          <p>
            Switch between manual and bulk modes, then preview and generate invitations
            for every recipient.
          </p>
        </div>
        <Link to="/profile" className="btn btn-primary">
          View my invitations
        </Link>
      </header>
      <div className="builder-steps">
        <div className="builder-step is-active">
          <span className="builder-step-index">1</span>
          <span className="builder-step-label">Choose creation mode</span>
        </div>
        <div className="builder-step">
          <span className="builder-step-index">2</span>
          <span className="builder-step-label">Configure invitation</span>
        </div>
        <div className="builder-step">
          <span className="builder-step-index">3</span>
          <span className="builder-step-label">Preview &amp; share</span>
        </div>
      </div>
      <div className="builder-grid">
        <Card
          title="Manual mode"
          subtitle="Perfect for a single guest or quick test"
          footer={
            <Button as={Link} to="/builder/manual">
              Open manual mode
            </Button>
          }
        >
          <p>
            Enter the name and surname for one person, set the invitation content once,
            and instantly generate a personalized invite with a shareable link.
          </p>
        </Card>
        <Card
          title="Bulk upload mode"
          subtitle="Import a spreadsheet and generate invitations in bulk"
          footer={
            <Button as={Link} to="/builder/bulk">
              Open bulk upload
            </Button>
          }
        >
          <p>
            Upload a CSV or Excel file with names and surnames, define the invitation
            details once, and Upvite will prepare invitations for every person.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default BuilderPage
