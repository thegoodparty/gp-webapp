import Button from '@shared/buttons/Button'

export default function NavButton({ children, className = '', ...restProps }) {
  return (
    <Button
      variant="text"
      className={
        '!py-2 hover:!bg-primary-dark focus-visible:hover:!bg-primary-dark hover:!text-white focus-visible:!bg-white focus-visible:!outline-primary-dark/30 ' +
        className
      }
      {...restProps}
    >
      {children}
    </Button>
  )
}
