'use client';
import TextField from '@shared/inputs/TextField';
import EmailInput from '@shared/inputs/EmailInput';
import PhoneInput from '@shared/inputs/PhoneInput';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import PositionsSelector from './PositionsSelector';

export default function RenderInputField({
  field,
  value,
  onChangeCallback,
  error,
  positions,
}) {
  return (
    <div
      className={`mb-6 col-span-12 ${field.cols === 6 && 'lg:col-span-6'} `}
      key={field.key}
    >
      {(field.type === 'text' ||
        field.type === 'date' ||
        field.type === 'number') && (
        <TextField
          label={field.label}
          name={field.label}
          fullWidth
          value={value}
          onChange={(e) => onChangeCallback(field.key, e.target.value)}
          multiline={!!field.rows}
          rows={field.rows || 1}
          required={field.required}
          type={field.type}
          error={error}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={field.maxLength ? { maxLength: field.maxLength } : {}}
        />
      )}
      {field.type === 'email' && (
        <EmailInput
          value={value}
          onChangeCallback={(e) => onChangeCallback(field.key, e.target.value)}
          shrink
        />
      )}
      {field.type === 'phone' && (
        <PhoneInput
          value={value}
          required={field.required}
          onChangeCallback={(phone, isValid) => {
            onChangeCallback(field.key, phone);
          }}
          hideIcon
          shrink
        />
      )}

      {field.type === 'radio' && (
        <div className="mb-4 flex justify-center">
          <div className="text-zinc-500 mb-2">
            {field.label}
            {field.required && <sup> *</sup>}
          </div>
          <RadioGroup
            row
            name={field.label}
            label={field.label}
            value={value || null}
            onChange={(e) => onChangeCallback(field.key, e.target.value)}
            error={error}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </div>
      )}
      {field.type === 'select' && (
        <>
          <div className="text-sm text-gray-500">
            {field.label}
            {field.required && <sup> *</sup>}
          </div>
          <Select
            native
            value={value}
            fullWidth
            variant="outlined"
            onChange={(e) => onChangeCallback(field.key, e.target.value)}
            label={field.label}
            error={error}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <option value="">Select</option>
            {field.options.map((op) => (
              <option value={op} key={op}>
                {op}
              </option>
            ))}
          </Select>
        </>
      )}
      {field.type === 'positionsSelector' && (
        <PositionsSelector
          positions={positions}
          updateCallback={(positions) =>
            onChangeCallback('positions', positions)
          }
        />
      )}
    </div>
  );
}
