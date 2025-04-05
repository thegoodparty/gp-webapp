import H3 from '@shared/typography/H3'

export const P2VSection = ({ title, children }) => (
  <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
    {typeof title === 'string' ? <H3>{title}</H3> : title}
    {children}
  </div>
)
