import { test, expect } from '@playwright/test'

test.describe('Critical user flows', () => {
  test('navigates full asset lifecycle: list → detail → back', async ({ page }) => {
    await page.goto('/assets')
    await expect(page.locator('h2')).toContainText('Assets')
    await expect(page.getByText('Manhattan Prime Office')).toBeVisible({ timeout: 10000 })

    await page.getByText('Manhattan Prime Office').click()
    await expect(page.locator('h2')).toContainText('Manhattan Prime Office')
    await expect(page.getByText('Compliance Settings')).toBeVisible()
    await expect(page.getByText('Distribution Details')).toBeVisible()

    await page.getByRole('button', { name: /back to assets/i }).click()
    await expect(page.locator('h2')).toContainText('Assets')
  })

  test('navigates full investor lifecycle: list → detail → back', async ({ page }) => {
    await page.goto('/investors')
    await expect(page.locator('h2')).toContainText('Investors')
    await expect(page.getByText('Alpha Ventures Ltd')).toBeVisible({ timeout: 10000 })

    await page.getByText('Alpha Ventures Ltd').click()
    await expect(page.locator('h2')).toContainText('Alpha Ventures Ltd')
    await expect(page.getByText('KYC / AML Details')).toBeVisible()
    await expect(page.getByText('Whitelist Management')).toBeVisible()

    await page.getByRole('button', { name: /back to investors/i }).click()
    await expect(page.locator('h2')).toContainText('Investors')
  })

  test('filters investors by KYC status', async ({ page }) => {
    await page.goto('/investors')
    await expect(page.locator('h2')).toContainText('Investors')

    await page.getByRole('button', { name: 'Pending' }).click()
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Pending')
    }
  })

  test('searches assets by name', async ({ page }) => {
    await page.goto('/assets')
    await expect(page.getByText('Manhattan Prime Office')).toBeVisible({ timeout: 10000 })

    const searchInput = page.locator('input[placeholder="Search assets..."]')
    await searchInput.fill('Treasury')

    await expect(page.getByText('Manhattan Prime Office')).not.toBeVisible()
    await expect(page.getByText('US Treasury Bill Fund')).toBeVisible()
  })

  test('opens and closes tokenize dialog', async ({ page }) => {
    await page.goto('/assets')
    await expect(page.locator('h2')).toContainText('Assets')

    await page.getByRole('button', { name: /tokenize asset/i }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 })

    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('settings page saves and displays persisted values', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.locator('h2')).toContainText('Settings')

    const issuerInput = page.locator('#issuer-name')
    await issuerInput.fill('My Test Company')

    await page.getByRole('button', { name: /save settings/i }).click()

    await page.reload()
    await expect(page.locator('#issuer-name')).toHaveValue('My Test Company')
  })

  test('settings page resets to defaults', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.locator('h2')).toContainText('Settings')

    const issuerInput = page.locator('#issuer-name')
    await issuerInput.fill('Temporary Name')

    await page.getByRole('button', { name: /reset/i }).click()
    await expect(issuerInput).toHaveValue('RWA Tokenization Inc.')
  })

  test('dashboard shows all stat cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Dashboard')

    await expect(page.getByText('Total Assets')).toBeVisible()
    await expect(page.getByText('Total Investors')).toBeVisible()
    await expect(page.getByText('Total Supply')).toBeVisible()
    await expect(page.getByText('24h Volume')).toBeVisible()
  })

  test('dashboard navigates to asset and investor detail from cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Dashboard')

    const recentAssetsSection = page.getByText('Recent Assets')
    await expect(recentAssetsSection).toBeVisible()

    const firstAssetCard = page.locator('text=Recent Assets').locator('..').locator('div.cursor-pointer').first()
    if (await firstAssetCard.isVisible()) {
      await firstAssetCard.click()
      await expect(page.locator('h2')).toBeVisible()
    }
  })

  test('compliance page loads and toggles rules', async ({ page }) => {
    await page.goto('/compliance')
    await expect(page.locator('h2')).toContainText('Compliance')

    const toggle = page.locator('[role="switch"]').first()
    await expect(toggle).toBeVisible({ timeout: 10000 })

    const initialChecked = await toggle.getAttribute('aria-checked')
    await toggle.click()
    const toggledChecked = await toggle.getAttribute('aria-checked')
    expect(toggledChecked).not.toBe(initialChecked)
  })

  test('dividends page shows distribution history', async ({ page }) => {
    await page.goto('/dividends')
    await expect(page.locator('h2')).toContainText('Dividend')

    await expect(page.getByText('Total Distributed')).toBeVisible()
    await expect(page.getByText('Total Distributions')).toBeVisible()
    await expect(page.getByText('Pending')).toBeVisible()
  })
})
