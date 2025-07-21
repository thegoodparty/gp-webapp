import Label from './Label'
import AddressAutocomplete from './AddressAutocomplete'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { InfoAlert } from '@shared/alerts/InfoAlert'

export default function ContactStep({
  address,
  email,
  phone,
  onAddressChange,
  onEmailChange,
  onPhoneChange,
  noHeading = false,
}) {
  return (
    <div>
      {!noHeading && (
        <>
          <H2 className="mb-4">Public Contact Information</H2>
          <Body2 className="mb-6 text-gray-600">
            This contact information will be displayed publicly on your campaign website. 
            Supporters will be able to see and use these details to reach out to you.
          </Body2>
          <InfoAlert className="mb-6">
            <strong>Privacy Note:</strong> All contact information below will be visible to anyone who visits your website.
          </InfoAlert>
        </>
      )}
      <Label>Address</Label>
      <AddressAutocomplete
        value={address}
        onChange={(value, place) => onAddressChange(value, place)}
      />
      <Label className="mt-4">Email</Label>
      <EmailInput
        useLabel={false}
        value={email}
        onChangeCallback={(value) => onEmailChange(value)}
        newCallbackSignature
        shrink
      />
      <Label className="mt-4">Phone</Label>
      <PhoneInput
        useLabel={false}
        value={phone}
        onChangeCallback={(value) => onPhoneChange(value)}
        hideIcon
        shrink
      />
    </div>
  )
}
