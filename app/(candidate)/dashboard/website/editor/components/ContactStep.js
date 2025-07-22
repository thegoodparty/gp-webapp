import Label from './Label'
import AddressAutocomplete from './AddressAutocomplete'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import H2 from '@shared/typography/H2'

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
      {!noHeading && <H2 className="mb-6">How can people find you?</H2>}
      <Label>Address</Label>
      <AddressAutocomplete
        value={address}
        onChange={(value) => onAddressChange(value)}
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
