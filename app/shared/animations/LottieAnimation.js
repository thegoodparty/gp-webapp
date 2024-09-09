'use client';
import Lottie from 'react-lottie';
const defaultOptions = {
  loop: false,
  autoplay: true,
  // rendererSettings: {
  //   preserveAspectRatio: 'xMidYMid slice',
  // },
  style: {
    cursor: 'default',
  },
  width: 150,
  height: 150,
};
export default function LottieAnimation({ style = {}, ...restProps }) {
  const callback = restProps.callback || (() => {});
  const lottieProps = { ...defaultOptions, ...restProps };
  console.log(`lottieProps =>`, lottieProps);
  return (
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
  );
}
