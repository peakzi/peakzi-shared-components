import { describe, expect, it } from 'vitest'
import { chartExportImageTheme } from './chartTheme'

describe('chartExportImageTheme', () => {
  it('forces a plain white chart background for exports', () => {
    expect(chartExportImageTheme().chart).toEqual({ backgroundColor: '#ffffff' })
  })

  it('overrides axis grid lines and labels with fixed light-theme colors', () => {
    const { xAxis, yAxis } = chartExportImageTheme()
    for (const axis of [xAxis, yAxis]) {
      expect(axis.gridLineColor).toBe('#d9d9e3')
      expect(axis.lineColor).toBe('#d9d9e3')
      expect(axis.labels.style.color).toBe('#52526a')
      expect(axis.title.style.color).toBe('#52526a')
    }
  })

  it('overrides title, legend, and series/pie/pyramid data-label colors for readability on white', () => {
    const theme = chartExportImageTheme()
    expect(theme.title.style.color).toBe('#1f1e5a')
    expect(theme.legend.itemStyle.color).toBe('#1f1e5a')
    expect(theme.plotOptions.series.dataLabels.style.color).toBe('#1f1e5a')
    expect(theme.plotOptions.pie.dataLabels.style.color).toBe('#1f1e5a')
    expect(theme.plotOptions.pyramid.dataLabels.style.color).toBe('#1f1e5a')
  })

  it('returns the same fixed values on every call, independent of any live theme', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('peakzi-dark')
    try {
      expect(chartExportImageTheme()).toEqual(chartExportImageTheme())
      expect(chartExportImageTheme().chart.backgroundColor).toBe('#ffffff')
    } finally {
      document.documentElement.removeAttribute('data-theme')
      document.documentElement.classList.remove('peakzi-dark')
    }
  })
})
