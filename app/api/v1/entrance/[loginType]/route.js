import { NextResponse } from 'next/server';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { setTokenCookie } from 'helpers/tokenCookie';

export async function PUT(request, { params: { loginType } }) {
  const data = await request.json();
  const api = gpApi.entrance.login;
  const { token, user, newUser } = await gpFetch(
    {
      ...api,
      url: `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/entrance/${loginType}`,
    },
    data,
  );

  if (!token) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return setTokenCookie(NextResponse.json({ user, newUser }), token);
}
