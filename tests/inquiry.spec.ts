import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function open(page: Page) {
  await page.goto('/');
  const trigger = page.locator('#contact').getByRole('button', { name: 'Start a project' });
  await trigger.click();
  const dialog = page.locator('.inquiry-dialog');
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}
async function fill(page: Page) {
  const dialog = page.locator('.inquiry-dialog');
  await dialog.getByLabel(/^Your name/).fill('Sample Client');
  await dialog.getByLabel(/^Email/).fill('sample@example.com');
  await dialog.getByLabel(/^Business or organization/).fill('Independent Bookstore');
  await dialog.getByLabel(/^Current website or social/).fill('@bookshop');
  await dialog.getByLabel('New Website', { exact: true }).check();
  await dialog.getByLabel('Booking / Scheduling', { exact: true }).check();
  await dialog
    .getByLabel(/^What are you hoping/)
    .fill('A website that helps readers find books and reserve author events.');
  await dialog.getByLabel(/^Estimated budget/).selectOption('$2,500–$5,000');
  await dialog.getByLabel(/^Ideal timeline/).selectOption('1–2 months');
}

test('inquiry enters focus, traps it, locks scroll, closes, and resumes scrolling', async ({
  page,
}, info) => {
  const { trigger, dialog } = await open(page);
  const close = dialog.getByRole('button', { name: 'Close project inquiry' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Send Project Inquiry' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await expect(page.locator('html')).toHaveClass(/motion-dialog-open/);
  const y = await page.evaluate(() => scrollY);
  await dialog.hover();
  await page.mouse.wheel(0, 350);
  await expect.poll(() => dialog.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
  // Asynchronous page layout refreshes must not move the background either.
  await page.evaluate((value) => window.scrollTo({ top: value - 100, behavior: 'instant' }), y);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(y, 0);
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await dialog.evaluate((el) => el.scrollTo(0, 0));
  await page.screenshot({ path: `/tmp/inquiry-${info.project.name}.png` });
  const audit = await new AxeBuilder({ page })
    .include('.inquiry-dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/motion-dialog-open/);
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, -250);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(y - 100);
});

test('navbar CTA opens the shared inquiry and restores its focus', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'Navbar project button is hidden on mobile.');
  await page.goto('/');
  const trigger = page.locator('.nav-cta');
  await trigger.click();
  await expect(page.locator('.inquiry-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('required and email validation, multiple choices, loading and accepted success', async ({
  page,
}, info) => {
  const { dialog } = await open(page);
  const send = dialog.getByRole('button', { name: 'Send Project Inquiry' });
  await send.click();
  await expect(dialog.getByText('Please tell us your name.')).toBeVisible();
  await expect(dialog.getByLabel(/^Your name/)).toBeFocused();
  await fill(page);
  await dialog.getByLabel(/^Email/).fill('not-an-email');
  await send.click();
  await expect(dialog.getByText('Please enter a valid email address.')).toBeVisible();
  await dialog.getByLabel(/^Email/).fill('sample@example.com');
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/inquiries', async (route) => {
    const data = route.request().postDataJSON();
    expect(data.projectTypes).toEqual(['New Website', 'Booking / Scheduling']);
    expect(data.budget).toBe('$2,500–$5,000');
    expect(data.timeline).toBe('1–2 months');
    expect(data.website).toBe('@bookshop');
    await gate;
    await route.fulfill({ json: { ok: true } });
  });
  await send.click();
  await expect(dialog.getByRole('button', { name: 'Sending your inquiry…' })).toBeDisabled();
  await expect(dialog.getByLabel(/^Your name/)).toBeDisabled();
  release();
  await expect(dialog.getByRole('heading', { name: 'Inquiry received.' })).toBeFocused();
  await page.screenshot({ path: `/tmp/inquiry-success-${info.project.name}.png` });
  await dialog.getByRole('button', { name: 'Return to the site' }).click();
  await expect(dialog).not.toBeVisible();
});

test('delivery errors retain details and allow retry, with reduced motion', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { dialog } = await open(page);
  await expect(dialog).toHaveCSS('transform', 'none');
  await fill(page);
  await page.route('**/api/inquiries', (route) =>
    route.fulfill({
      status: 503,
      json: {
        error:
          'Inquiry delivery is not available yet. Nothing has been sent. Your details are still here.',
      },
    }),
  );
  await dialog.getByRole('button', { name: 'Send Project Inquiry' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Nothing has been sent');
  await expect(dialog.getByLabel(/^Your name/)).toHaveValue('Sample Client');
  await expect(dialog.getByLabel('New Website', { exact: true })).toBeChecked();
  await page.screenshot({ path: `/tmp/inquiry-error-${info.project.name}.png` });
  await page.unroute('**/api/inquiries');
  await page.route('**/api/inquiries', (route) => route.fulfill({ json: { ok: true } }));
  await dialog.getByRole('button', { name: 'Send Project Inquiry' }).click();
  await expect(dialog.getByRole('heading', { name: 'Inquiry received.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/motion-dialog-open/);
});

test('server rejects invalid payloads and honestly reports missing delivery', async ({
  request,
}) => {
  const invalid = await request.post('/api/inquiries', { data: { email: 'invalid' } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).errors).toHaveProperty('projectTypes');
  const valid = await request.post('/api/inquiries', {
    data: {
      name: 'Sample Client',
      email: 'sample@example.com',
      projectTypes: ['New Website'],
      goal: 'An independent bookstore website.',
      budget: 'Not sure yet',
      timeline: 'Flexible',
    },
  });
  expect(valid.status()).toBe(503);
  expect((await valid.json()).error).toContain('Nothing has been sent');
  const foreign = await request.post('/api/inquiries', {
    headers: { origin: 'https://example.com' },
    data: {},
  });
  expect(foreign.status()).toBe(403);
});
