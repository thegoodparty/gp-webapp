'use client';
import YellowButtonClient from '@shared/buttons/YellowButtonClient';

export default function GetStartedButton({ openModalCallback, id }) {
  return (
    <YellowButtonClient onClick={openModalCallback} id={id}>
      <span className="font-black">BOOK A MEETING</span>
    </YellowButtonClient>
  );
}
