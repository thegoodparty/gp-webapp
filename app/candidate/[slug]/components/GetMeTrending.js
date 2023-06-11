import PrimaryButton from '@shared/buttons/PrimaryButton';
import CopyToClipboard from '@shared/utils/CopyToClipboard';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { candidateHash } from 'helpers/candidateHelper';
import { BsMegaphone } from 'react-icons/bs';
import { RiClipboardLine, RiShareForwardLine } from 'react-icons/ri';
import ShareButton from './ShareButton';

export default function GetMeTrending(props) {
  const { candidate } = props;
  const hashtag = candidateHash(candidate);
  return (
    <div className="relative mb-6">
      <div className="bg-[#8875FF] rounded-2xl h-full w-full absolute -bottom-6"></div>
      <div className="bg-[#F2B165] rounded-2xl h-full w-full absolute -bottom-3"></div>
      <div className="bg-lime-500 rounded-2xl pt-5 pb-4 px-6 relative z-10 flex">
        <div className="mr-2 pt-2">
          <BsMegaphone />
        </div>
        <div>
          <H4>Get me trending</H4>
          <H2 className="mt-6 mb-7">#{hashtag}</H2>
          <div className="flex">
            <CopyToClipboard text={`#${hashtag}`}>
              <PrimaryButton>
                <div className="text-lime-500 flex items-center">
                  <div className="mr-2">Copy</div>
                  <RiClipboardLine />
                </div>
              </PrimaryButton>
            </CopyToClipboard>
            <div className="ml-2">
              <ShareButton {...props}>
                <PrimaryButton>
                  <div className="text-lime-500 flex items-center">
                    <div className="mr-2">Share</div>
                    <RiShareForwardLine />
                  </div>
                </PrimaryButton>
              </ShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
