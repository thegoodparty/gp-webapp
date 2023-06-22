import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

const Text = ({ children }) => (
  <p style={{ whiteSpace: 'pre-line' }}>{children}</p>
);

const dtrOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <img
        src={node.data?.target?.fields?.file?.url}
        alt={node.data?.target?.fields?.title}
        className="faq-image"
      />
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
  },
};

// returns only articles that match the page.
const contentfulHelper = (rawRichTextField) => {
  try {
    let doc = rawRichTextField;
    // console.log(require('util').inspect(doc));
    if (typeof doc === 'string') {
      doc = JSON.parse(rawRichTextField);
    }
    return documentToReactComponents(doc, dtrOptions);
  } catch (e) {
    console.log('error at helper');
    console.log(e);
    return '';
  }
};

// export const CmsContentWrapper = styled.div`
//   margin-top: 28px;
//   font-size: 14px;
//   line-height: 20px;
//   letter-spacing: 0.1px;
//   @media only screen and (min-width: ${({ theme }) =>
//       theme.breakpointsPixels.md}) {
//     font-size: 16px;
//     line-height: 20px;
//   }

//   h1 {
//     font-size: 27px;
//     line-height: 35px;
//     margin: 0;
//     @media only screen and (min-width: ${({ theme }) =>
//         theme.breakpointsPixels.md}) {
//       font-size: 36px;
//       line-height: 42px;
//     }
//   }

//   h2 {
//     font-size: 23px;
//     line-height: 30px;
//     margin: 0;
//     @media only screen and (min-width: ${({ theme }) =>
//         theme.breakpointsPixels.md}) {
//       font-size: 28px;
//       line-height: 36px;
//     }
//   }

//   h3 {
//     font-size: 19px;
//     line-height: 25px;
//     font-weight: 600;
//     margin: 0;
//     @media only screen and (min-width: ${({ theme }) =>
//         theme.breakpointsPixels.md}) {
//       font-size: 26px;
//       line-height: 32px;
//     }
//   }
//   p {
//     font-size: 14px;
//     line-height: 20px;
//     letter-spacing: 0.1px;
//     @media only screen and (min-width: ${({ theme }) =>
//         theme.breakpointsPixels.md}) {
//       font-size: 16px;
//       line-height: 20px;
//     }
//   }
//   ul {
//     list-style-type: none;
//     li {
//       margin: 10px 0;
//     }
//     p {
//       margin-block-start: 10px;
//       margin-block-end: 10px;
//     }
//   }
// `;

export default contentfulHelper;

export const cmsToPlainText = (content, limit) => {
  if (!content) {
    return '';
  }
  let text = documentToPlainTextString(content);
  if (text && limit) {
    return text.substring(0, limit - 3) + '...';
  }
  return text;
};
