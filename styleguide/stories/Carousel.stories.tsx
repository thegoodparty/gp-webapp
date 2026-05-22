import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Carousel>

const images = [
  {
    src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80',
    alt: 'Photo by Drew Beamer',
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&dpr=2&q=80',
    alt: 'Photo by Daniele Levis Pelusi',
  },
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&dpr=2&q=80',
    alt: 'Photo by Aiony Haust',
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&dpr=2&q=80',
    alt: 'Photo by Christina Morillo',
  },
]

type PlaygroundArgs = {
  orientation: 'horizontal' | 'vertical'
  loop: boolean
  align: 'start' | 'center' | 'end'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    orientation: 'horizontal',
    loop: false,
    align: 'center',
  },
  argTypes: {
    loop: {
      control: 'boolean',
      description: 'embla-carousel loop option.',
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'embla-carousel slide alignment option.',
    },
  },
  render: ({ orientation, loop, align }) => (
    <Carousel
      orientation={orientation}
      opts={{ loop, align }}
      className={orientation === 'horizontal' ? 'w-full max-w-xs' : 'h-72'}
    >
      <CarouselContent
        className={orientation === 'vertical' ? '-mt-1 h-72' : undefined}
      >
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className={
              orientation === 'vertical' ? 'pt-1 basis-1/2' : undefined
            }
          >
            <div className="p-1">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-square h-full w-full rounded-md object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-square h-full w-full rounded-md object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const WithMultipleItems: Story = {
  render: () => (
    <Carousel opts={{ align: 'start' }} className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-square h-full w-full rounded-md object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Loop: Story = {
  render: () => (
    <Carousel opts={{ loop: true }} className="w-full max-w-xs">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-square h-full w-full rounded-md object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
