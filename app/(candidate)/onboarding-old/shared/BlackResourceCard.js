import { MdOutlineFileDownload } from 'react-icons/md';

export default function BlackResourceCard({ card }) {
  const { title, description, link } = card;
  let isDownload = true;
  if (link.charAt(0) === '/') {
    isDownload = false;
  }
  return (
    <div
      key={title}
      className="p-6 bg-black text-white rounded-lg flex flex-col justify-between"
    >
      <div>
        <h4 className="font-black text-xl">{title}</h4>
        <div className="text-sm my-4">{description}</div>
      </div>
      <div>
        <div
          className={`items-center  py-2  rounded-md inline-flex ${
            isDownload ? 'bg-gp-yellow text-black px-4' : ' text-gp-yellow'
          }`}
        >
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs font-black tracking-widest mr-2"
          >
            {isDownload ? 'DOWNLOAD' : 'READ MORE'}
          </a>
          {isDownload && <MdOutlineFileDownload />}
        </div>
      </div>
    </div>
  );
}
