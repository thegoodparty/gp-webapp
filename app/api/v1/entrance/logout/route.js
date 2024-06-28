import { NextResponse } from 'next/server';
import { deleteTokenCookie } from 'helpers/tokenCookie';

export const DELETE = async () =>
  deleteTokenCookie(new NextResponse(null, { status: 204 }));
