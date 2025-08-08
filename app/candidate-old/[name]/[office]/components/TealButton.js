export default function TealButton({ children, ...restProps }) {
  return (
    <div
      className="p-3 text-center rounded  font-medium cursor-pointer transition-colors text-white bg-[#008080] hover:bg-[#013838]"
      {...restProps}
    >
      {children}
    </div>
  )
}
