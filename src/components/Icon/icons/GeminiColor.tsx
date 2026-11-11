import { GEMINI_PATH } from './gemini-path'

/** Preserve the supplied artwork; scope paint-server IDs to each SVG instance. */
export function GeminiColor({ id }: { id: string }) {
  return <>
    <path d={GEMINI_PATH} fill="#3186FF" />
    {[0, 1, 2].map((index) => <path key={index} d={GEMINI_PATH} fill={`url(#${id}-gemini-${index})`} />)}
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id={`${id}-gemini-0`} x1="7" x2="11" y1="15.5" y2="12">
        <stop stopColor="#08B962" /><stop offset="1" stopColor="#08B962" stopOpacity="0" />
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id={`${id}-gemini-1`} x1="8" x2="11.5" y1="5.5" y2="11">
        <stop stopColor="#F94543" /><stop offset="1" stopColor="#F94543" stopOpacity="0" />
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id={`${id}-gemini-2`} x1="3.5" x2="17.5" y1="13.5" y2="12">
        <stop stopColor="#FABC12" /><stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
      </linearGradient>
    </defs>
  </>
}
