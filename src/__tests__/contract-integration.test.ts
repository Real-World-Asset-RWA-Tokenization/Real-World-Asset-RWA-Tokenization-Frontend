import { describe, it, expect } from 'vitest'
import {
  fetchAssets,
  fetchAssetById,
  fetchInvestors,
  fetchInvestorById,
  fetchDividends,
  fetchComplianceRules,
  fetchTransferRestrictions,
  fetchDashboardMetrics,
  deployToken,
  distributeDividend,
  approveInvestorKyc,
  toggleWhitelist,
} from '@/lib/contracts/services'
import type { Asset, Investor, DividendDistribution } from '@/types'

describe('Contract Service Integration', () => {
  describe('Asset queries', () => {
    let assets: Asset[]

    it('fetchAssets returns array', async () => {
      assets = await fetchAssets()
      expect(Array.isArray(assets)).toBe(true)
      expect(assets.length).toBeGreaterThan(0)
    })

    it('fetchAssetById returns correct asset', async () => {
      const asset = await fetchAssetById('1')
      expect(asset).toBeDefined()
      expect(asset!.id).toBe('1')
      expect(asset!.name).toBeDefined()
      expect(asset!.symbol).toBeDefined()
      expect(asset!.price).toBeDefined()
    })

    it('fetchAssetById returns undefined for unknown id', async () => {
      const asset = await fetchAssetById('nonexistent')
      expect(asset).toBeUndefined()
    })

    it('assets have required compliance fields', async () => {
      const assets = await fetchAssets()
      for (const asset of assets) {
        expect(asset.compliance).toBeDefined()
        expect(typeof asset.compliance.kycRequired).toBe('boolean')
        expect(typeof asset.compliance.transferRestrictions).toBe('boolean')
        expect(typeof asset.compliance.investorWhitelistRequired).toBe('boolean')
      }
    })

    it('assets have distribution fields', async () => {
      const assets = await fetchAssets()
      for (const asset of assets) {
        expect(asset.distribution).toBeDefined()
        expect(asset.distribution.apr).toBeDefined()
        expect(asset.distribution.totalDistributed).toBeDefined()
      }
    })

    it('all asset classes are valid', async () => {
      const validClasses = ['real_estate', 'treasury', 'invoice', 'commodity', 'equity', 'other']
      const assets = await fetchAssets()
      for (const asset of assets) {
        expect(validClasses).toContain(asset.assetClass)
      }
    })
  })

  describe('Investor queries', () => {
    let investors: Investor[]

    it('fetchInvestors returns array', async () => {
      investors = await fetchInvestors()
      expect(Array.isArray(investors)).toBe(true)
      expect(investors.length).toBeGreaterThan(0)
    })

    it('fetchInvestorById returns correct investor', async () => {
      const inv = await fetchInvestorById('1')
      expect(inv).toBeDefined()
      expect(inv!.id).toBe('1')
      expect(inv!.name).toBeDefined()
      expect(inv!.address).toBeDefined()
    })

    it('investors have valid KYC statuses', async () => {
      const validStatuses = ['pending', 'approved', 'rejected', 'expired']
      const investors = await fetchInvestors()
      for (const inv of investors) {
        expect(validStatuses).toContain(inv.kycStatus)
      }
    })

    it('investors have valid KYC providers', async () => {
      const validProviders = ['sep12', 'custom']
      const investors = await fetchInvestors()
      for (const inv of investors) {
        expect(validProviders).toContain(inv.kycProvider)
      }
    })
  })

  describe('Dividend queries', () => {
    let dividends: DividendDistribution[]

    it('fetchDividends returns array', async () => {
      dividends = await fetchDividends()
      expect(Array.isArray(dividends)).toBe(true)
    })

    it('dividends have valid statuses', async () => {
      const dividends = await fetchDividends()
      const validStatuses = ['completed', 'pending', 'failed']
      for (const div of dividends) {
        expect(validStatuses).toContain(div.status)
        expect(div.totalAmount).toBeDefined()
        expect(div.perShare).toBeDefined()
      }
    })
  })

  describe('Compliance queries', () => {
    it('fetchComplianceRules returns rules', async () => {
      const rules = await fetchComplianceRules()
      expect(Array.isArray(rules)).toBe(true)
      expect(rules.length).toBeGreaterThan(0)
      for (const rule of rules) {
        expect(rule.name).toBeDefined()
        expect(rule.type).toBeDefined()
      }
    })

    it('fetchTransferRestrictions returns restrictions', async () => {
      const restrictions = await fetchTransferRestrictions()
      expect(restrictions).toBeDefined()
      expect(restrictions.rules.maxTransferAmount).toBeDefined()
      expect(restrictions.rules.approvedJurisdictions).toBeInstanceOf(Array)
    })
  })

  describe('Dashboard metrics', () => {
    it('fetchDashboardMetrics returns complete metrics', async () => {
      const metrics = await fetchDashboardMetrics()
      expect(metrics).toBeDefined()
      expect(typeof metrics.totalAssets).toBe('number')
      expect(typeof metrics.totalInvestors).toBe('number')
      expect(typeof metrics.totalSupply).toBe('string')
      expect(typeof metrics.totalDistributed).toBe('string')
      expect(typeof metrics.volume24h).toBe('string')
      expect(typeof metrics.uniqueHolders).toBe('number')
    })
  })

  describe('Mutations (simulated)', () => {
    it('deployToken returns a contract id', async () => {
      const id = await deployToken({
        name: 'Test',
        symbol: 'TST',
        assetClass: 'treasury',
        totalSupply: '1000000',
        kycRequired: true,
        whitelistRequired: true,
        transferRestrictions: false,
      })
      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('distributeDividend returns transaction hash', async () => {
      const hash = await distributeDividend('1', '100000', '0.01')
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('approveInvestorKyc succeeds', async () => {
      await expect(approveInvestorKyc('123')).resolves.toBeUndefined()
    })

    it('toggleWhitelist succeeds', async () => {
      await expect(toggleWhitelist('123', true)).resolves.toBeUndefined()
    })
  })
})
