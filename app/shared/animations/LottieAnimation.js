'use client';
import Lottie from 'react-lottie';
const defaultOptions = {
  loop: false,
  autoplay: true,
  style: {
    cursor: 'default',
  },
  width: 150,
  height: 150,
};
export default function LottieAnimation({ style = {}, ...restProps }) {
  const callback = restProps.callback || (() => {});
  const lottieProps = { ...defaultOptions, ...restProps };

  return (
    // NOTE: inert needs a string value here or React throws an error (Fixed in React 19)
    <div inert="true">
      <Lottie
        style={{ ...defaultOptions.style, ...style }}
        options={lottieProps}
        eventListeners={[
          {
            eventName: 'complete',
            callback,
          },
        ]}
      />
    </div>
  );
}
