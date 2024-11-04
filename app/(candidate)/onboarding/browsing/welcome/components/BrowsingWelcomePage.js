import CardPageWrapper from '@shared/cards/CardPageWrapper';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import React from 'react';
import Image from 'next/image';
import Button from '@shared/buttons/Button';

export const BrowsingWelcomePage = ({ user }) => (
  <CardPageWrapper>
    <Image
      className="mx-auto mb-8"
      src="/images/emojis/party-popper.svg"
      width={80}
      height={80}
      alt="clap"
    />
    <H1 className="text-center mb-4">Welcome, {user.firstName}!</H1>
    <Body2 className="text-center mb-8">
      We are really excited to show you around. Let&apos;s get started!
    </Body2>
    <Button className="block w-full" href="/dashboard" size="large">
      View Dashboard
    </Button>
  </CardPageWrapper>
);
