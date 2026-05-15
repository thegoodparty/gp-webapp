interface WhyWeAskProps {
  text?: string
  title?: string
  children?: React.ReactNode
}

export const WhyWeAsk = ({
  text,
  title = 'Why this matters',
  children,
}: WhyWeAskProps): React.JSX.Element => (
  <aside className="rounded-xl border border-base-border p-5 flex flex-col gap-2">
    <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
      {title}
    </span>
    <p className="text-sm text-foreground">{children ?? text}</p>
  </aside>
)
