'use client';
import Button from '@mui/material/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { FaTwitter } from 'react-icons/fa';

async function login() {
  try {
    const api = gpApi.entrance.twitterLogin;

    const { url } = await gpFetch(api);
    window.location.href = url;
  } catch (e) {
    return false;
  }
}

export default function TwitterButton({ mode = 'login' }) {
  const handleLogin = async () => {
    await login();
  };
  return (
    <Button
      fullWidth
      onClick={handleLogin}
      data-cy="twitter-social-login"
      style={{ borderRadius: '8px', backgroundColor: '#7DD3FC' }}
    >
      <div className="text-xs lg:text-sm bg-sky-300 text-white relative  py-4 px-1 w-full">
        <span className="absolute left-3 t-4 lg:text-xl">
          <FaTwitter />
        </span>
        <div className="font-bold">Twitter</div>
      </div>
    </Button>
  );
}
