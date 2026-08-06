import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  shortenAddress,
  formatNumber,
  formatCompactNumber,
  formatDate,
  timeAgo,
  getStatusColor,
  getAssetClassLabel,
  getAssetClassColor,
  cn,
} from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes and resolves conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-sm', undefined, 'text-base')).toBe('text-base')
    })
  })

  describe('formatCurrency', () => {
    it('formats number as USD', () => {
      expect(formatCurrency(1234.5)).toBe('$1,234.50')
    })

    it('formats string number', () => {
      expect(formatCurrency('5000000')).toBe('$5,000,000.00')
    })

    it('respects decimal precision argument', () => {
      expect(formatCurrency('125000', 4)).toBe('$125,000.0000')
      expect(formatCurrency('1234.56', 0)).toBe('$1,235')
    })

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('handles NaN', () => {
      expect(formatCurrency('abc')).toBe('$0.00')
      expect(formatCurrency(undefined as unknown as string)).toBe('$0.00')
    })
  })

  describe('shortenAddress', () => {
    it('shortens long address with default length', () => {
      expect(shortenAddress('GCK3ABC123DEF456')).toBe('GCK3AB...DEF456')
    })

    it('shortens with custom length', () => {
      expect(shortenAddress('GCK3ABC123DEF456', 8)).toBe('GCK3ABC1...23DEF456')
    })

    it('handles empty string', () => {
      expect(shortenAddress('')).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('formats with commas', () => {
      expect(formatNumber('1234567')).toBe('1,234,567')
    })

    it('returns 0 for NaN', () => {
      expect(formatNumber('nope')).toBe('0')
    })
  })

  describe('formatCompactNumber', () => {
    it('formats billions', () => {
      expect(formatCompactNumber('1500000000')).toBe('1.50B')
    })
    it('formats millions', () => {
      expect(formatCompactNumber('12500000')).toBe('12.50M')
    })
    it('formats thousands', () => {
      expect(formatCompactNumber('5000')).toBe('5.00K')
    })
    it('formats small numbers as-is', () => {
      expect(formatCompactNumber(847)).toBe('847.00')
    })
    it('handles NaN', () => {
      expect(formatCompactNumber('bad')).toBe('0')
    })
  })

  describe('formatDate', () => {
    it('formats ISO date string', () => {
      const result = formatDate('2025-06-01T00:00:00Z')
      expect(result).toContain('Jun')
      expect(result).toContain('2025')
    })
  })

  describe('timeAgo', () => {
    it('returns "just now" for recent dates', () => {
      expect(timeAgo(new Date().toISOString())).toBe('just now')
    })
    it('returns minutes ago', () => {
      const past = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(timeAgo(past)).toBe('5m ago')
    })
    it('returns hours ago', () => {
      const past = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      expect(timeAgo(past)).toBe('3h ago')
    })
    it('returns days ago', () => {
      const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      expect(timeAgo(past)).toBe('2d ago')
    })
    it('falls back to formatted date for older dates', () => {
      const past = '2020-01-01T00:00:00Z'
      expect(timeAgo(past)).toContain('Jan')
    })
  })

  describe('getStatusColor', () => {
    it('returns emerald for active', () => {
      expect(getStatusColor('active')).toBe('emerald')
    })
    it('returns amber for pending', () => {
      expect(getStatusColor('pending')).toBe('amber')
    })
    it('returns red for rejected', () => {
      expect(getStatusColor('rejected')).toBe('red')
    })
    it('returns blue for paused and expired', () => {
      expect(getStatusColor('paused')).toBe('blue')
      expect(getStatusColor('expired')).toBe('blue')
    })
    it('returns slate for unknown statuses', () => {
      expect(getStatusColor('whatever')).toBe('slate')
    })
  })

  describe('getAssetClassLabel', () => {
    it('maps known asset classes to labels', () => {
      expect(getAssetClassLabel('real_estate')).toBe('Real Estate')
      expect(getAssetClassLabel('treasury')).toBe('Treasury')
      expect(getAssetClassLabel('equity')).toBe('Equity')
    })
    it('falls back to the raw value for unknown classes', () => {
      expect(getAssetClassLabel('crypto')).toBe('crypto')
    })
  })

  describe('getAssetClassColor', () => {
    it('returns a color class for known classes', () => {
      expect(getAssetClassColor('real_estate')).toContain('violet')
      expect(getAssetClassColor('equity')).toContain('rose')
    })
    it('falls back to the other color', () => {
      expect(getAssetClassColor('nope')).toContain('slate')
    })
  })
})
