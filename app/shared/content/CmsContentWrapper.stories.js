import CmsContentWrapper from './CmsContentWrapper'

const content = (
  <>
    <h2>
      <b>After the Election: Tying Up Loose Ends</b>
    </h2>
    <p>
      Win or lose, there are a few housekeeping details that need to be managed
      before you officially close down your political campaign. Many of these
      are legal requirements related to the disbursement of unspent campaign
      funds and other assets.&nbsp;
    </p>
    <p>
      The <b>Federal Election Commission (FEC)</b> has very detailed{' '}
      <a href="https://www.fec.gov/help-candidates-and-committees/winding-down-candidate-campaign/">
        <u>directives regarding campaign closure</u>
      </a>
      . States may have additional requirements for political campaigns. For
      example, campaign statements and reports must still be filed until your
      election committee is officially terminated in California.&nbsp;&nbsp;
    </p>
    <p>
      Excess campaign funds must first be used to pay off any debts incurred
      during the campaign. Once that is accomplished, candidates have some
      discretion as to how to disperse the remainder of campaign funds and other
      assets, such as office equipment.{' '}
    </p>
  </>
)

export default {
  title: 'Content/CmsContentWrapper',
  component: CmsContentWrapper,
  tags: ['autodocs'],
  args: {
    children: content,
  },
}

export const Default = {}
