import { reviewTextParts } from '../helpers/highlight-review'

interface HighlightedReviewTextProps {
  text: string
  highlightedPhrases?: readonly string[]
}

export function HighlightedReviewText({ text, highlightedPhrases }: HighlightedReviewTextProps) {
  return <>{reviewTextParts(text, highlightedPhrases).map((part, index) =>
    part.highlighted ? <mark key={index}>{part.text}</mark> : part.text,
  )}</>
}
