import RequestForm from '../components/RequestForm'

const fields = [
  { name: 'patient_name', label: 'Patient name', required: true },
  { name: 'phone', label: 'Contact phone', type: 'tel', required: true, pattern: '[0-9]{10}', title: 'Enter a 10 digit phone number' },
  {
    name: 'ambulance_type', label: 'Ambulance type', type: 'select',
    options: ['Basic life support', 'Advanced life support (ICU)', 'Patient transport (non-emergency)'],
    default: 'Basic life support',
  },
  { name: 'pickup_address', label: 'Pickup address and landmark', type: 'textarea', required: true },
  { name: 'city', label: 'City', required: true },
  { name: 'hospital', label: 'Preferred hospital (optional)' },
  { name: 'notes', label: 'What happened? (optional)', type: 'textarea' },
]

export default function Ambulance() {
  return (
    <RequestForm
      type="ambulance"
      title="Emergency ambulance"
      lead="Tell us where the patient is and we will send the nearest ambulance."
      banner="In a life-threatening emergency, call 112 or 108 first. This request does not replace an emergency call."
      bannerTone="alert"
      fields={fields}
      familyField="patient_name"
      submitLabel="Request ambulance now"
      urgent
      successTitle="Ambulance request received"
      successText="Our dispatch team has your details and will confirm the pickup location."
    />
  )
}
