import { ANGI_PATHS, ANGI_OUTLINE_PATHS, BBB_OUTLINE_PATHS } from './platform-paths'

export function AngiMonochrome() {
  return <>{ANGI_PATHS.map(({ d }, i) => <path key={i} d={d} fill="currentColor" />)}</>
}

export function AngiColor() {
  return <>{ANGI_PATHS.map((path, i) => <path key={i} {...path} />)}</>
}

export function AngiOutline() {
  return <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    {ANGI_OUTLINE_PATHS.map((d, i) => <path key={i} d={d} />)}
  </g>
}

export function BbbOutline() {
  return <>{BBB_OUTLINE_PATHS.map((d, i) => <path key={i} d={d} fill="currentColor" />)}</>
}
