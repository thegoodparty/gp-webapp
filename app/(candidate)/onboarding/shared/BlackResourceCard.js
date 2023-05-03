import { MdOutlineFileDownload } from 'react-icons/md';

export default function BlackResourceCard({ card }) {
  const { title, description, link } = card;
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
        <div className="items-center bg-gp-yellow text-black  py-2 px-4 rounded-md inline-flex">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs font-black tracking-widest mr-2"
          >
            DOWNLOAD
          </a>
          <MdOutlineFileDownload />
        </div>
      </div>
    </div>
  );
}
