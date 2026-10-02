import { test, expect } from '@playwright/test';

test('hero choreography preserves layout and supports reduced motion', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.hero-work-link')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-line-content')).toHaveCSS('transform', 'none');
  await page.screenshot({ path: `/tmp/portfolio-motion/hero-${info.project.name}.png` });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.mouse.wheel(0, 280);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  await page.screenshot({ path: `/tmp/portfolio-motion/hero-scroll-${info.project.name}.png` });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(page.locator('.hero-image')).toHaveCSS('transform', 'none');
  await expect(page.getByRole('button', { name: 'Pause ambient motion' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('project presentations hold briefly on desktop and remain native on mobile', async ({
  page,
}, info) => {
  await page.goto('/');
  const desktop = (page.viewportSize()?.width ?? 0) >= 1024;
  const pins = page.locator('#work .pin-spacer');
  await expect(pins).toHaveCount(desktop ? (info.project.name === 'laptop' ? 1 : 2) : 0);
  for (const [index, name] of ['solace', 'daybreak'].entries()) {
    const presentation = page.locator(`.project-${name} .project-presentation`);
    const pinned = desktop && (info.project.name !== 'laptop' || index === 1);
    const target = await presentation.evaluate(
      (el) => el.getBoundingClientRect().top + scrollY - 40 + 60,
    );
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), target);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(target, 0);
    if (pinned) {
      await expect(presentation).toHaveCSS('position', 'fixed');
      const before = await presentation.boundingBox();
      await page.mouse.wheel(0, 60);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(target + 50);
      const after = await presentation.boundingBox();
      expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
    }
    await page.screenshot({
      path: `/tmp/portfolio-motion/work-${index + 1}-${info.project.name}.png`,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.mouse.wheel(0, 400);
    if (pinned) {
      await expect(presentation).not.toHaveCSS('position', 'fixed');
      // Crossing the pin boundary in reverse must restore normal flow smoothly.
      await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(target + 460, 0);
      await page.mouse.wheel(0, -400);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(target + 60, 0);
      await expect(presentation).toHaveCSS('position', 'fixed');
      await page.mouse.wheel(0, -140);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(target - 80, 0);
      await expect(presentation).not.toHaveCSS('position', 'fixed');
      await expect.poll(async () => (await presentation.boundingBox())!.y).toBeCloseTo(60, 0);
    }
    const details = page.locator(`.project-${name} .project-details`);
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('p')).toBeVisible();
    await details.locator('summary').click();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pins).toHaveCount(0);
  await expect(page.locator('.project-scroll-image').first()).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(pins).toHaveCount(desktop ? (info.project.name === 'laptop' ? 1 : 2) : 0);
  if (desktop) {
    await page.setViewportSize({ width: 1280, height: 650 });
    await expect(pins).toHaveCount(0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(pins).toHaveCount(2);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(pins).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
  }
});

test('principles remain readable in normal flow with sequential emphasis', async ({
  page,
}, info) => {
  await page.goto('/');
  const words = page.locator('.principle .text-reveal');
  for (const index of [0, 2, 4]) {
    await words.nth(index).scrollIntoViewIfNeeded();
    await expect(words.nth(index)).toHaveCSS('opacity', '1');
    await expect(words.nth(index + 1)).toHaveCSS('opacity', '1');
    await expect(words.nth(index)).toHaveCSS('transform', 'none');
    await page.screenshot({
      path: `/tmp/portfolio-motion/principle-${index / 2 + 1}-${info.project.name}.png`,
    });
  }
  await expect(page.locator('#principles .pin-spacer')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const word of await words.all()) await expect(word).toHaveCSS('transform', 'none');
});

test('UI motion preserves scrolling, focus, image framing, and layout stability', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    const metrics = { cls: 0 };
    Object.assign(window, { motionMetrics: metrics });
    new PerformanceObserver((list) => {
      for (const item of list.getEntries()) {
        const entry = item as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!entry.hadRecentInput) metrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await expect(page.locator('.hero-work-link')).toHaveCSS('opacity', '1');
  const mobile = info.project.name === 'mobile';
  const art = page.locator('.project-art').first();
  const hoverLayer = art.locator('.image-hover-layer');
  await art.scrollIntoViewIfNeeded();
  await expect(art.locator('.image-reveal')).toHaveCSS('clip-path', 'inset(0px 0px 0%)');
  if (!mobile) {
    await art.hover();
    await expect(hoverLayer).toHaveCSS('transform', 'matrix(1.035, 0, 0, 1.035, 0, 0)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(hoverLayer).toHaveCSS('transform', 'none');
    await page.mouse.move(0, 0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  } else {
    await art.tap();
    await expect(hoverLayer).toHaveCSS('transform', 'none');
  }
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `/tmp/portfolio-motion/about-${info.project.name}.png`,
    animations: 'disabled',
  });
  const trigger = page.locator('#contact').getByRole('button', { name: 'Start a project' });
  await trigger.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `/tmp/portfolio-motion/contact-${info.project.name}.png`,
    animations: 'disabled',
  });
  const cls = await page.evaluate(
    () => (window as Window & { motionMetrics?: { cls: number } }).motionMetrics!.cls,
  );
  expect(cls).toBeLessThan(0.05);
  await info.attach('layout-stability', {
    body: JSON.stringify({ cls }),
    contentType: 'application/json',
  });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /Tell us what/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('transform', 'none');
  await expect(page.locator('html')).toHaveClass(/motion-dialog-open/);
  const y = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, -200);
  await page.screenshot({ path: `/tmp/portfolio-motion/dialog-${info.project.name}.png` });
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/motion-dialog-open/);
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(20);
  if (mobile) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCSS('opacity', '1');
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCSS('transform', 'none');
    await page.screenshot({ path: `/tmp/portfolio-motion/menu-mobile.png` });
    await page.keyboard.press('Escape');
  }
});

test.describe('static fallback', () => {
  test.use({ javaScriptEnabled: false });
  test('essential content is visible without JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('#work').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Solace', exact: true })).toBeVisible();
    await expect(page.locator('.project-photo').first()).toBeVisible();
    await page.locator('#principles').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'PURPOSE over decoration.' })).toBeVisible();
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
});
