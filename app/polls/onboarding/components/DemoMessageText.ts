interface MessageTextParams {
  name: string
  office: string
  constituentName?: string
}

export const personElectDemoMessageText = ({
  name,
  office,
  constituentName = 'Bill',
}: MessageTextParams): string => {
  return `Hello ${constituentName}, I'm ${name}, your newly elected ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const personElectMessageText = ({
  name,
  office,
}: Omit<MessageTextParams, 'constituentName'>): string => {
  return `Hello {{first_name}}, I'm ${name}, your newly elected ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const demoMessageText = ({
  name,
  office,
  constituentName = 'Bill',
}: MessageTextParams): string => {
  return `Hello ${constituentName}, I'm ${name}, your ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const messageText = ({
  name,
  office,
}: Omit<MessageTextParams, 'constituentName'>): string => {
  return `Hello {{first_name}}, I'm ${name}, your ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}
