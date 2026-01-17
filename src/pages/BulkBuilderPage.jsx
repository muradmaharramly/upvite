import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import {
  clearInvitationError,
  createInvitationBatch,
  setRecipients,
  setTemplateSlug,
  updateBulkField,
} from '../features/invitations/invitationsSlice'

const templateOptions = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
]

function BulkBuilderPage() {
  const [fileName, setFileName] = useState('')
  const dispatch = useDispatch()
  const bulk = useSelector((state) => state.invitations.bulk)
  const templateSlug = useSelector((state) => state.invitations.templateSlug)
  const recipients = useSelector((state) => state.invitations.recipients)
  const status = useSelector((state) => state.invitations.status)
  const error = useSelector((state) => state.invitations.error)
  const user = useSelector((state) => state.auth.user)

  const isSaving = status === 'loading'

  function handleBulkChange(field) {
    return (event) => {
      dispatch(updateBulkField({ field, value: event.target.value }))
    }
  }

  function normalizeRow(row, index) {
    const values = Object.values(row)
    if (!values.length) return null
    const trimmed = values.map((value) => String(value || '').trim()).filter(Boolean)
    if (trimmed.length < 2) {
      return null
    }
    return {
      id: index,
      firstName: trimmed[0],
      lastName: trimmed[1],
    }
  }

  function parseCsv(text) {
    dispatch(clearInvitationError())
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
        const mapped = parsed
          .map((row, index) => normalizeRow(row, index))
          .filter(Boolean)
        if (!mapped.length) {
          dispatch(setRecipients([]))
          toast.error('No valid rows found. Expected at least name and surname columns.')
          return
        }
        dispatch(setRecipients(mapped))
        toast.success(`Imported ${mapped.length} recipients`)
      },
      error: () => {
        dispatch(setRecipients([]))
        toast.error('Unable to parse CSV file')
      },
    })
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const extension = file.name.toLowerCase().split('.').pop()
    setFileName(file.name)
    if (extension === 'csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          parseCsv(text)
        } else {
          toast.error('Unable to read CSV file')
        }
      }
      reader.readAsText(file)
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (!data) {
          toast.error('Unable to read Excel file')
          return
        }
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const csv = XLSX.utils.sheet_to_csv(sheet)
        parseCsv(csv)
      }
      reader.readAsArrayBuffer(file)
    } else {
      toast.error('Unsupported file type. Please upload a CSV or Excel file.')
    }
  }

  async function handleSaveBatch() {
    if (!recipients.length) {
      toast.error('Import at least one recipient before saving')
      return
    }
    if (!bulk.text || !bulk.eventDate || !bulk.eventLocation) {
      toast.error('Fill in invitation text, date, and location')
      return
    }
    dispatch(clearInvitationError())
    const result = await dispatch(createInvitationBatch({ recipients, templateSlug }))
    if (createInvitationBatch.fulfilled.match(result)) {
      toast.success('Invitation batch saved')
    } else if (result.payload) {
      toast.error(result.payload)
    }
  }

  const sampleRecipient = recipients[0]

  return (
    <div className="builder-page">
      <header className="page-header">
        <div>
          <h1>Bulk invitations</h1>
          <p>
            Upload a CSV or Excel file with names and surnames, define the invitation once,
            and generate invitations for every person.
          </p>
        </div>
      </header>
      <div className="builder-two-column">
        <Card title="Upload recipients">
          <div className="field">
            <label htmlFor="file" className="field-label">
              CSV or Excel file
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="field-input"
              onChange={handleFileChange}
            />
            <p className="field-helper">
              File should contain at least two columns: first name and surname.
            </p>
            {fileName && (
              <p className="field-helper">
                Selected file: <strong>{fileName}</strong>
              </p>
            )}
          </div>
          <div className="empty-state">
            <p className="empty-state-title">
              {recipients.length
                ? `Imported ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}`
                : 'No recipients imported yet'}
            </p>
            <p className="empty-state-text">
              {recipients.length
                ? 'Review the preview on the right. Duplicate or invalid rows are skipped automatically.'
                : 'Upload a CSV or Excel file. We will automatically convert Excel to CSV before parsing.'}
            </p>
          </div>
        </Card>
        <Card title="Invitation configuration">
          <TextArea
            name="text"
            label="Invitation text"
            placeholder="We are excited to invite you..."
            rows={4}
            value={bulk.text}
            onChange={handleBulkChange('text')}
          />
          <div className="form-grid">
            <Input
              name="eventDate"
              label="Event date"
              type="date"
              value={bulk.eventDate}
              onChange={handleBulkChange('eventDate')}
            />
            <Input
              name="eventLocation"
              label="Event location"
              placeholder="Venue name, city"
              value={bulk.eventLocation}
              onChange={handleBulkChange('eventLocation')}
            />
          </div>
          <Select
            name="template"
            label="Invitation template"
            value={templateSlug}
            onChange={(event) => dispatch(setTemplateSlug(event.target.value))}
            options={templateOptions}
          />
          {error && <p className="auth-error">{error}</p>}
          <div className="builder-actions">
            <Button variant="secondary" onClick={handleSaveBatch} isLoading={isSaving}>
              {user ? 'Save batch and enable downloads' : 'Sign in to save batch'}
            </Button>
          </div>
        </Card>
      </div>
      <div className="builder-preview-row">
        <Card title="Sample invitation preview">
          {sampleRecipient ? (
            <section className={`invite-card invite-card-${templateSlug}`}>
              <p className="invite-label">Invitation</p>
              <h1 className="invite-name">
                {sampleRecipient.firstName} {sampleRecipient.lastName}
              </h1>
              <p className="invite-text">{bulk.text || 'Your invitation text'}</p>
              <p className="invite-meta">
                {bulk.eventDate || 'Event date'} • {bulk.eventLocation || 'Location'}
              </p>
            </section>
          ) : (
            <div className="empty-state">
              <p className="empty-state-title">No sample available yet</p>
              <p className="empty-state-text">
                After uploading a file, the first recipient will appear here along with the
                selected template.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default BulkBuilderPage

