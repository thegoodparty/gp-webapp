'use client';
import Lottie from 'react-lottie';
const defaultOptions = {
  loop: false,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
  width: 150,
  height: 150,
};
export default function LottieAnimation(props) {
  const callback = props.callback || (() => {});
  return (
    <Lottie
      options={{ ...defaultOptions, ...props }}
      eventListeners={[
        {
          eventName: 'complete',
          callback,
        },
      ]}
    />
  );
}
