import { Link } from 'react-router-dom'
import { FiArrowRight, FiUploadCloud } from 'react-icons/fi'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function LandingPage() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-text">
          <p className="eyebrow">Event invitations, done in minutes</p>
          <h1>
            Generate hundreds of personalized invitations from a single template and file
          </h1>
          <p className="lead">
            Upload a CSV or Excel sheet, pick a design, and let Upvite craft invitations
            with names, dates, locations, and shareable links for every guest.
          </p>
          <div className="landing-hero-actions">
            <Button as={Link} to="/builder">
              Start creating invitations
              <FiArrowRight />
            </Button>
            <Link to="/builder" className="btn btn-ghost">
              Try bulk upload
              <FiUploadCloud />
            </Link>
          </div>
          <p className="landing-footnote">
            No account required to test uploads and previews. Sign up to download and
            share.
          </p>
        </div>
        <div className="landing-hero-preview">
          <Card className="preview-card"
            title="Bulk upload preview"
            subtitle="Generate a full invitation batch from a spreadsheet"
          >
            <div className="landing-hero-preview-body">
              <div className="landing-pill">200 guests imported</div>
              <div className="landing-preview-templates">
                <span>Templates</span>
                <div className="landing-template-badges">
                  <span>Classic</span>
                  <span>Minimal</span>
                  <span>Bold</span>
                </div>
              </div>
              <div className="landing-preview-footer">
                <div>
                  <p className="landing-preview-title">Annual Partners Summit</p>
                  <p className="landing-preview-meta">March 21, 2026 • Baku</p>
                </div>
                <span className="landing-preview-status">Ready to send</span>
              </div>
            </div>
          </Card>
          <Card className="preview-card"
            title="Manual invitation preview"
            subtitle="Create a single personalized invite in just a few fields"
          >
            <div className="landing-hero-preview-body">
              <div className="landing-pill">VIP guest mode</div>
              <div className="landing-preview-templates">
                <span>Guest</span>
                <div className="landing-template-badges">
                  <span>Ali</span>
                  <span>Aliyev</span>
                </div>
              </div>
              <div className="landing-preview-footer">
                <div>
                  <p className="landing-preview-title">Personal dinner invitation</p>
                  <p className="landing-preview-meta">Tonight • Baku</p>
                </div>
                <span className="landing-preview-status">Ready to share</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
