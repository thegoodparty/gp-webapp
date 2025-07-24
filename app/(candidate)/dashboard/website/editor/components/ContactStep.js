import AddressAutocomplete from '@shared/AddressAutocomplete'
import Label from './Label'
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
      {!noHeading && <H2 className="mb-6">How can voters contact you?</H2>}
      <Label>Address</Label>
      <AddressAutocomplete
        value={address}
        onSelect={(place) => onAddressChange(place)}
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
