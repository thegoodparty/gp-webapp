import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description:
        'Single allows one item open at a time; multiple allows any number.',
    },
    collapsible: {
      control: 'boolean',
      description:
        'Only applies when type is "single". Allows closing the open item.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable every item in the accordion.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

const items = [
  {
    value: 'item-1',
    question: 'What is GoodParty.org?',
    answer:
      'GoodParty.org is a nonpartisan civic tech organization that helps independent candidates run, win, and serve free from party affiliation and donor influence.',
  },
  {
    value: 'item-2',
    question: 'Who can use the platform?',
    answer:
      'Any independent candidate running for local, state, or federal office is welcome to use our tools to organize a campaign.',
  },
  {
    value: 'item-3',
    question: 'How much does it cost?',
    answer:
      'The core platform is free. Pro features are available for candidates who need additional outreach and AI capabilities.',
  },
]

export const Playground: Story = {
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      {items.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      {items.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>
          With <code>type=&quot;multiple&quot;</code> any number of items can be
          open at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>
          Each item is independent. Opening this one does not collapse the
          others.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section three</AccordionTrigger>
        <AccordionContent>
          Useful for FAQ-style content or any layout where users may want to
          compare expanded sections.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-2"
      className="w-full max-w-md"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Collapsed by default</AccordionTrigger>
        <AccordionContent>This item starts closed.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>
          Set <code>defaultValue</code> on the root to pre-open an item.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Also collapsed</AccordionTrigger>
        <AccordionContent>This item also starts closed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Enabled item</AccordionTrigger>
        <AccordionContent>This item can be toggled normally.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>You should not be able to see this.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another enabled item</AccordionTrigger>
        <AccordionContent>This one works too.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
