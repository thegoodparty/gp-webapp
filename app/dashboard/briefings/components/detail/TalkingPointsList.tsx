type Props = {
  points: string[]
  pathPrefix: string
}

/**
 * Bulleted list of talking points. Each point gets its own json-path
 * anchor so phase 4 can resolve selections inside a single point.
 */
export default function TalkingPointsList({
  points,
  pathPrefix,
}: Props): React.JSX.Element | null {
  if (points.length === 0) return null
  return (
    <ul className="list-disc! space-y-1 pl-5 text-sm leading-6 text-foreground">
      {points.map((p, i) => (
        <li
          key={`${pathPrefix}/${i}`}
          className="list-item!"
          data-briefing-json-path={`${pathPrefix}/${i}`}
        >
          {p}
        </li>
      ))}
    </ul>
  )
}
