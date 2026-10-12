import { describe, expect, it } from 'vitest'
import { customerMentions } from './customer-mentions'

describe('customerMentions', () => {
  it('counts a tag once per review, ignoring casing and extra whitespace', () => {
    expect(customerMentions([
      { id: 'one', text: 'One.', tags: [' Quality  of Work ', 'quality of work', 'Service'] },
      { id: 'two', text: 'Two.', tags: ['QUALITY OF WORK'] },
    ])).toEqual([{ label: 'Quality of Work', count: 2 }, { label: 'Service', count: 1 }])
  })

  it('shows the top five by count and keeps API encounter order for ties', () => {
    expect(customerMentions([
      { id: 'one', text: 'One.', tags: ['Quality', 'Professionalism', 'Communication', 'Service', 'Experience', 'Other'] },
      { id: 'two', text: 'Two.', tags: ['Professionalism', 'Communication'] },
    ])).toEqual([
      { label: 'Professionalism', count: 2 }, { label: 'Communication', count: 2 },
      { label: 'Quality', count: 1 }, { label: 'Service', count: 1 }, { label: 'Experience', count: 1 },
    ])
  })

  it('omits missing and blank tags without generating topics from the review copy', () => {
    expect(customerMentions([{ id: 'one', text: 'Great service.' }, { id: 'two', text: 'Helpful.', tags: ['', ' '] }])).toEqual([])
    expect(customerMentions([])).toEqual([])
  })
})
