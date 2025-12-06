import H3 from '@shared/typography/H3'

interface P2VSectionProps {
  title: string | React.ReactNode
  children: React.ReactNode
}

export const P2VSection = ({ title, children }: P2VSectionProps): React.JSX.Element => (
  <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
    {typeof title === 'string' ? <H3>{title}</H3> : title}
    {children}
  </div>
)


