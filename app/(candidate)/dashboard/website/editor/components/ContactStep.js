import AddressAutocomplete from '@shared/AddressAutocomplete'
import Label from './Label'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import H2 from '@shared/typography/H2'
import TextField from '@shared/inputs/TextField'

export default function ContactStep({
  address,
  email,
  phone,
  onAddressSelect,
  onAddressChange,
  onEmailChange,
  onPhoneChange,
  noHeading = false,
  committee,
  onCommitteeChange,
}) {
  return (
    <div>
      {!noHeading && <H2 className="mb-6">How can voters contact you?</H2>}
      <Label>Address</Label>
      <AddressAutocomplete
        value={address}
        onSelect={(place) => onAddressSelect(place)}
        onChange={(value) => onAddressChange(value)}
      />
      <Label className="mt-4">
        Email <sup>*</sup>
      </Label>
      <EmailInput
        useLabel={false}
        value={email}
        onChangeCallback={(value) => onEmailChange(value)}
        newCallbackSignature
        shrink
      />
      <Label className="mt-4">
        Phone <sup>*</sup>
      </Label>
      <PhoneInput
        useLabel={false}
        value={phone}
        onChangeCallback={(value) => onPhoneChange(value)}
        hideIcon
        shrink
      />
      <Label className="mt-4">Campaign Committee Name</Label>

      <TextField
        fullWidth
        required
        value={committee}
        onChange={(e) => onCommitteeChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </div>
  )
}
