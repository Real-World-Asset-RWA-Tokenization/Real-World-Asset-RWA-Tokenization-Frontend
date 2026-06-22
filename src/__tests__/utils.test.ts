import { describe, it, expect } from 'vitest'
import { formatCurrency, shortenAddress, formatNumber, formatDate, timeAgo, getStatusColor } from '@/lib/utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats number as USD', () => {
      expect(formatCurrency(1234.5)).toBe('$1,234.50')
    })

    it('formats string number', () => {
      expect(formatCurrency('5000000')).toBe('$5,000,000.00')
    })

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('handles NaN', () => {
      expect(formatCurrency('abc')).toBe('$0.00')
    })
  })

  describe('shortenAddress', () => {
    it('shortens long address', () => {
      expect(shortenAddress('GCK3ABC123DEF456')).toBe('GCK3AB...DEF456')
    })

    it('handles empty string', () => {
      expect(shortenAddress('')).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('formats with commas', () => {
      expect(formatNumber('1234567')).toBe('1,234,567')
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
  })
})
