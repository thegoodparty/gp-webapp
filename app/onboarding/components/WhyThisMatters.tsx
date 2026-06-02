interface WhyThisMattersProps {
  text?: string
  title?: string
  children?: React.ReactNode
}

export const WhyThisMatters = ({
  text,
  title = 'Why this matters',
  children,
}: WhyThisMattersProps): React.JSX.Element => (
  <aside className="rounded-xl border border-base-border p-5 flex flex-col gap-2">
    <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
      {title}
    </span>
    <p className="text-sm text-foreground">{children ?? text}</p>
  </aside>
)
