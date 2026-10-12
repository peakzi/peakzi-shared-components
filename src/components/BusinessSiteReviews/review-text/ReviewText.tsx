import { reviewTextParts } from '../helpers/highlight-review'

interface ReviewTextProps {
  text: string
  highlightedPhrases?: readonly string[]
  featured?: boolean
}

function HighlightedText({ text, highlightedPhrases }: ReviewTextProps) {
  return <>{reviewTextParts(text, highlightedPhrases).map((part, index) =>
    part.highlighted ? <mark key={index}>{part.text}</mark> : part.text)}</>
}

export function ReviewText({ text, highlightedPhrases = [], featured = false }: ReviewTextProps) {
  const characters = Array.from(text)
  const limit = featured ? 320 : 160
  if (characters.length <= limit) return <blockquote><HighlightedText text={text} highlightedPhrases={highlightedPhrases} /></blockquote>

  const preview = characters.slice(0, limit).join('').replace(/\s+\S*$/u, '').trimEnd()
  return (
    <details className="pz-business-reviews__text">
      <summary>
        <span className="pz-business-reviews__preview"><HighlightedText text={preview} highlightedPhrases={highlightedPhrases} />…</span>
        <span className="pz-business-reviews__read-more">Read full review</span>
        <span className="pz-business-reviews__read-less">Show less</span>
      </summary>
      <blockquote><HighlightedText text={text} highlightedPhrases={highlightedPhrases} /></blockquote>
    </details>
  )
}
