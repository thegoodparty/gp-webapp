import EmailForm from '@shared/inputs/EmailForm';
import MaxWidth from '@shared/layouts/MaxWidth';
import styles from '../shared/ArticleSnippet.module.scss';

export default function SubscribeBlog() {
  return (
    <article className={`${styles.wrapper} bg-teal-300`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={'lg:col-span-3'}>
          <div className="font-black text-xl mt-8 mb-3 text-center">
            Subscribe to our blog!
          </div>
        </div>
        <div className={'lg:col-span-3'}>
          <div className={styles.content}>
            {/* <div className="text-lg font-light lg:w-[80%] mx-auto text-left lg:text-center">          
            </div> */}
            <div className="mx-auto">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="py-4 pl-4 pr-36 mb-5 border-purple border-2 rounded-full w-full"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="py-4 pl-4 pr-36 border-purple border-2 rounded-full w-full"
              />

              <EmailForm
                fullWidth
                forId="5d84452a-01df-422b-9734-580148677d2c"
                pageName="Blog"
                label="Subscribe"
                labelId="subscribe-form"
                buttonFull={true}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
