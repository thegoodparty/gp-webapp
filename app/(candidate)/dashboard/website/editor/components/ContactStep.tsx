import AddressAutocomplete from '@shared/AddressAutocomplete'
import Label from './Label'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import H2 from '@shared/typography/H2'
import TextField from '@shared/inputs/TextField'
import { ChangeEvent } from 'react'

interface ContactStepProps {
  address?: string
  email?: string
  phone?: string
  onAddressSelect: (place: google.maps.places.PlaceResult) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  noHeading?: boolean
  committee?: string
  onCommitteeChange: (value: string) => void
}

export default function ContactStep({
  address,
  email,
  phone,
  onAddressSelect,
  onEmailChange,
  onPhoneChange,
  noHeading = false,
  committee,
  onCommitteeChange,
}: ContactStepProps): React.JSX.Element {
  return (
    <div>
      {!noHeading && <H2 className="mb-6">How can voters contact you?</H2>}
      <Label>Address</Label>
      <AddressAutocomplete
        value={address}
        onSelect={(place) => onAddressSelect(place)}
        variant="outlined"
      />
      <Label className="mt-4">
        Email <sup>*</sup>
      </Label>
      <EmailInput
        useLabel={false}
        value={email || ''}
        onChangeCallback={(value: string) => onEmailChange(value)}
        newCallbackSignature
        shrink
        variant="outlined"
      />
      <Label className="mt-4">
        Phone <sup>*</sup>
      </Label>
      <PhoneInput
        useLabel={false}
        value={phone || ''}
        onChangeCallback={(value: string) => onPhoneChange(value)}
        hideIcon
        shrink
      />
      <Label className="mt-4">Campaign Committee Name</Label>

      <TextField
        fullWidth
        required
        value={committee}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onCommitteeChange(e.target.value)
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </div>
  )
}
