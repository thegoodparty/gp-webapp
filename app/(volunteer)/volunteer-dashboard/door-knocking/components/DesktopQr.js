import Image from 'next/image';
import qrImg from 'public/images/qr/qr-door-knocking.png';
import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import Paper from '@shared/utils/Paper';

export default function DesktopQr() {
  return (
    <div className="hidden lg:block">
      <Paper>
        <div className="flex py-32  flex-col items-center">
          <Image src={qrImg} alt="qr" width={180} height={180} />
          <H3 className="text-center mt-8">
            Hey, friend. We appreciate your interest in door knocking,
            <br />
            however, we only support door knocking for volunteers on our mobile
            site.{' '}
          </H3>
          <Body1 className="text-center mt-4">
            Scan this QR code on your mobile device to get started.{' '}
          </Body1>
        </div>
      </Paper>
    </div>
  );
}
