import ComplianceStep from './ComplianceStep'

const steps = [
  {
    title: 'Create your website',
    description: 'Political candidates need to have a campaign website that meets carrier requirements. Our website meets all of these requirements.',
    active: true
  },
  {
    title: 'Buy a unique domain name',
    description: 'Political campaigns need a unique domain name to comply with regulations.',
    active: false
  },
  {
    title: 'Submit your registration',
    description: 'Every candidate needs to register their campaign information in order to send political text messages.',
    active: false
  },
  {
    title: 'Enter PIN',
    description: 'To verify your identity you will receive a PIN via email from "CampaignVerify".',
    active: false
  }
]

export default function ComplianceSteps() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {steps.map((step, index) => (
        <ComplianceStep 
          key={index}
          number={index + 1}
          {...step}
        />
      ))}
    </div>
  )
} 