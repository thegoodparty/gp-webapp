export const DemoMessageText = ({ name, office, constituentName = 'Bill' }) => {
    return `Hello ${constituentName}! I'm your ${office} ${name}, and I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}

export const MessageText = ({ name, office}) => {
    return `Hello {{firstname}}! I'm your ${office} ${name}, and I'm listening to residents about what matters most in our community. What issues do you think should be our top priority? Reply to share your input or text STOP to opt out.`
}