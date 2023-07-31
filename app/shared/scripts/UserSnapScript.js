import Script from 'next/script';

export default function UserSnapScript() {
  return (
    <Script
      strategy="afterInteractive"
      type="text/javascript"
      id="usersnap"
      dangerouslySetInnerHTML={{
        __html: `
    // usersnap.com
    window.onUsersnapLoad = function(api) {
      api.init();
    }
    var script = document.createElement('script');
    script.defer = 1;
    script.src = 'https://widget.usersnap.com/global/load/ffda1fce-d2f7-4471-b118-050ae883436b?onload=onUsersnapLoad';
    document.getElementsByTagName('head')[0].appendChild(script);
    `,
      }}
    />
  );
}
