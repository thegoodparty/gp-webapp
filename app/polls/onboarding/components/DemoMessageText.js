export const DemoMessageText = ({ name, office, constituentName = 'Bill' }) => {
    return `Hi ${constituentName}, I'm ${office} ${name}. What local issues matter most to you? I'd genuinely value your input. Reply to share or text STOP to opt out.`
}