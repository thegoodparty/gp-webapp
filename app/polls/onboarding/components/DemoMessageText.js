export const PersonElectDemoMessageText = ({
  name,
  office,
  constituentName = 'Bill',
}) => {
  return `Hello ${constituentName}, I'm ${name}, your newly elected ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const PersonElectMessageText = ({ name, office }) => {
  return `Hello {{firstName}}, I'm ${name}, your newly elected ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const DemoMessageText = ({ name, office, constituentName = 'Bill' }) => {
  return `Hello ${constituentName}, I'm ${name}, your ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const MessageText = ({ name, office }) => {
  return `Hello {{firstName}}, I'm ${name}, your ${office}. I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}
