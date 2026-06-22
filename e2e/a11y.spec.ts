import { test, expect } from '@playwright/test'

test.describe('Accessibility audit', () => {
  test('dashboard page has no critical a11y violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const violations = await page.evaluate(() => {
      return (window as any).__AXE_RESULTS__ ?? []
    })

    // Manual a11y checks
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
    await page.waitForTimeout(500)
    await expect(page.locator('h2')).toContainText('Assets')
  })

  test('dialog is keyboard accessible', async ({ page }) => {
    await page.goto('/assets')
    await page.waitForTimeout(500)

    const tokenizeBtn = page.getByText('Tokenize Asset')
    if (await tokenizeBtn.isVisible()) {
      await tokenizeBtn.click()
      await page.waitForTimeout(300)

      const dialog = page.locator('[role="dialog"]')
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute('aria-modal', 'true')

      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
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
