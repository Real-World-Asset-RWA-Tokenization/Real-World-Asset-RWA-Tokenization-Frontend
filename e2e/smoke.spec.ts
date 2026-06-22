import { test, expect } from '@playwright/test'

test.describe('RWA Tokenization Frontend', () => {
  test('loads the dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Dashboard')
    await expect(page.getByText('Total Assets')).toBeVisible()
    await expect(page.getByText('Total Investors')).toBeVisible()
    await expect(page.getByText('Total Supply')).toBeVisible()
  })

  test('navigates to assets page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Assets' }).click()
    await expect(page.locator('h2')).toContainText('Assets')
    await expect(page.locator('button')).toContainText('Tokenize Asset')
  })

  test('navigates to investors page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Investors' }).click()
    await expect(page.locator('h2')).toContainText('Investors')
  })

  test('navigates to dividends page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Dividends' }).click()
    await expect(page.locator('h2')).toContainText('Dividend')
  })

  test('navigates to compliance page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Compliance' }).click()
    await expect(page.locator('h2')).toContainText('Compliance')
  })

  test('navigates to settings page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page.locator('h2')).toContainText('Settings')
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class')

    await page.getByRole('button', { name: /switch/i }).click()
    const toggledClass = await html.getAttribute('class')
    expect(toggledClass).not.toBe(initialClass)

    await page.getByRole('button', { name: /switch/i }).click()
    const restoredClass = await html.getAttribute('class')
    expect(restoredClass).toBe(initialClass)
  })

  test('asset detail page loads from list', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Assets' }).click()
    await page.waitForTimeout(500)

    const firstCard = page.locator('[class*="cursor-pointer"]').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await expect(page.locator('h2')).toBeVisible()
    }
  })

  test('search filters assets', async ({ page }) => {
    await page.goto('/assets')
    await page.waitForTimeout(500)

    const searchInput = page.locator('input[placeholder="Search assets..."]')
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Manhattan')
    await expect(page.getByText('Manhattan Prime Office')).toBeVisible()
  })
})
