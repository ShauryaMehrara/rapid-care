import RequestForm from '../components/RequestForm'

const fields = [
  { name: 'deceased_name', label: 'Name of the person who has passed away', required: true },
  { name: 'contact_name', label: 'Your name', required: true },
  { name: 'phone', label: 'Contact phone', type: 'tel', required: true, pattern: '[0-9]{10}', title: 'Enter a 10 digit phone number' },
  { name: 'pickup_place', label: 'Pickup from', type: 'select', options: ['Hospital', 'Home', 'Other'], default: 'Hospital' },
  { name: 'pickup_address', label: 'Pickup address', type: 'textarea', required: true },
  { name: 'destination', label: 'Crematorium or cremation ground', required: true },
  { name: 'vehicle', label: 'Vehicle', type: 'select', options: ['Standard hearse van', 'Hearse van with freezer box'], default: 'Standard hearse van' },
  { name: 'when', label: 'Pickup time', type: 'select', options: ['As soon as possible', 'Schedule for later'], default: 'As soon as possible' },
  { name: 'pickup_time', label: 'Date and time', type: 'datetime-local', required: true, showIf: { field: 'when', equals: 'Schedule for later' } },
  { name: 'notes', label: 'Anything else we should know? (optional)', type: 'textarea' },
]

export default function Cremation() {
  return (
    <RequestForm
      type="cremation"
      title="Cremation transport"
      lead="We are sorry for your loss. Share the details below and our team will arrange transport."
      fields={fields}
      submitLabel="Request transport"
      successTitle="Transport request received"
      successText="Our team will confirm the vehicle and pickup time with you."
    />
  )
}
