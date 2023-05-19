'use client';
import { setCookie } from 'helpers/cookieHelper';

export default function CandidateCookie({ campaign }) {
  const { launchStatus, slug, candidateSlug } = campaign;
  let candidateCookie = slug;
  if (launchStatus === 'launched') {
    candidateCookie = `candidate-${candidateSlug}`;
  }
  setCookie('candidate', candidateCookie);

  return null;
}
