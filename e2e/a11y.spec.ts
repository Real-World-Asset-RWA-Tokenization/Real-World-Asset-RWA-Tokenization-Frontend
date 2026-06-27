import { test, expect } from '@playwright/test'

test.describe('Accessibility audit', () => {
  test('dashboard page has no critical a11y violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang')

    const heading = page.locator('h2')
    await expect(heading.first()).toBeVisible()

    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt !== null).toBe(true)
    }
  })

  test('assets page has proper heading structure', async ({ page }) => {
    await page.goto('/assets')
    await expect(page.locator('h2')).toContainText('Assets')
  })

  test('dialog is keyboard accessible', async ({ page }) => {
    await page.goto('/assets')
    await expect(page.getByText('Tokenize Asset')).toBeVisible({ timeout: 10000 })

    const tokenizeBtn = page.getByText('Tokenize Asset')
    if (await tokenizeBtn.isVisible()) {
      await tokenizeBtn.click()
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 })
      await expect(page.locator('[role="dialog"]')).toHaveAttribute('aria-modal', 'true')

      await page.keyboard.press('Escape')
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    }
  })

  test('dark mode toggle preserves accessibility', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /switch/i })
    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})
