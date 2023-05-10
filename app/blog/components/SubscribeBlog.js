import EmailFirstLastForm from '@shared/inputs/EmailFirstLastForm';
import MaxWidth from '@shared/layouts/MaxWidth';
import styles from '../shared/ArticleSnippet.module.scss';

export default function SubscribeBlog() {
  return (
    <article className={`${styles.ctaWrapper} bg-teal-300`}>
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
              <EmailFirstLastForm
                fullWidth
                formId="5d84452a-01df-422b-9734-580148677d2c"
                pageName="Blog"
                label="Subscribe"
                labelId="subscribe-form"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
