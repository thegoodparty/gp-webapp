import EmailFormV2 from '@shared/inputs/EmailFormV2'
import Body1 from '@shared/typography/Body1'
import MarketingH5 from '@shared/typography/MarketingH5'

interface SubscribeBlogProps {
  className?: string
}

export default function SubscribeBlog({
  className,
}: SubscribeBlogProps): React.JSX.Element {
  return (
    <div className={`bg-indigo-100 rounded-xl p-8 ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <MarketingH5 className="mb-2">
          Sign up for the <br /> GoodParty.org newsletter.
        </MarketingH5>
        <Body1 className="text-gray-600">
          Get the latest content, updates, and volunteer opportunities from
          GoodParty.org delivered to your inbox.
        </Body1>
      </div>
      <EmailFormV2
        className="mt-6 [&>*]:mx-auto"
        formId="5d84452a-01df-422b-9734-580148677d2c"
        pageName="Blog"
        label="Subscribe"
        labelId="subscribe-form"
        placeholder="Enter email to recieve updates"
        primaryButton
      />
    </div>
  )
}
