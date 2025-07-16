import Script from 'next/script'

const HubSpotChatWidgetScript = () => {
  return (
    <Script
      type="text/javascript"
      id="hs-script-loader"
      strategy="afterInteractive"
      src="//js.hs-scripts.com/21589597.js"
    />
  )
}

export default HubSpotChatWidgetScript 