import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('complete responsive page, real navigation targets, and clean runtime', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BUILT WITH');
  for (const id of ['work', 'about', 'principles', 'services', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#about')).toContainText('Leonardo');
  await expect(page.locator('#about')).toContainText('Sevastian');
  const invalidLinks = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((link) => !document.getElementById(link.getAttribute('href')!.slice(1)))
        .map((link) => link.textContent),
    );
  expect(invalidLinks).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#top').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath('full-page.png'),
    fullPage: true,
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});

test('navigation is keyboard accessible and menus close on Escape', async ({ page }) => {
  await page.goto('/');
  const mobile = (page.viewportSize()?.width ?? 1440) <= 760;
  if (mobile) {
    const trigger = page.getByRole('button', { name: 'Open navigation' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Services' })
      .click();
    await expect(page.getByRole('dialog', { name: 'Navigation' })).not.toBeVisible();
  } else {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Services' })
      .click();
  }
  await expect(page).toHaveURL(/#services$/);
  await page
    .locator('#services')
    .getByRole('heading', { name: 'Website design', exact: true })
    .click();
  await expect(
    page.getByText('Clear structure, expressive visual design, and a considered experience.', {
      exact: false,
    }),
  ).toBeVisible();
});

test('inquiry validates and downloads an honest project brief', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact').getByRole('button', { name: 'Start a project' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Download project brief' }).click();
  expect(
    await dialog
      .locator('input[name="name"]')
      .evaluate((el) => (el as HTMLInputElement).validity.valueMissing),
  ).toBe(true);
  await dialog.getByLabel('Your name').fill('Sample Client');
  await dialog.getByLabel('Email address').fill('sample@example.com');
  await dialog
    .getByLabel('A little about your idea')
    .fill('A thoughtful website for an independent bookstore.');
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Download project brief' }).click();
  const download = await downloadPromise;
  const contents = await readFile((await download.path())!, 'utf8');
  expect(contents).toContain('independent bookstore');
  expect(contents).toContain('sample@example.com');
  await expect(page.getByRole('status')).toContainText('Nothing has been sent');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('reduced motion disables ambient movement and page has no WCAG A/AA violations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Pause ambient motion' })).toBeDisabled();
  expect(
    await page.locator('.sky-image').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});
