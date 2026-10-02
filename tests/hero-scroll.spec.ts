import { test, expect, type Page } from '@playwright/test';

async function slowWheel(page: Page, amount: number) {
  const count = Math.ceil(Math.abs(amount) / 20);
  for (let step = 0; step < count; step++) {
    await page.mouse.wheel(0, amount / count);
    // Simulate deliberate slow input, rather than teleporting with scrollTo.
    await page.waitForTimeout(45);
  }
  await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/);
}

async function geometry(page: Page) {
  return page.locator('.hero').evaluate((hero) => {
    const box = (selector: string) => hero.querySelector(selector)!.getBoundingClientRect();
    const group = box('.hero-type');
    const line = box('.hero-line-content');
    const script = box('.hero-serif-content');
    const image = box('.sky-image');
    const frame = hero.getBoundingClientRect();
    return {
      scroll: scrollY,
      lineOffset: line.top - group.top,
      scriptOffset: script.top - group.top,
      scriptX: script.left - line.left,
      frame: { top: frame.top, bottom: frame.bottom, left: frame.left, right: frame.right },
      image: { top: image.top, bottom: image.bottom, left: image.left, right: image.right },
      copyOpacity: Number(getComputedStyle(hero.querySelector('.hero-bottom')!).opacity),
      headlineOpacity: Number(getComputedStyle(hero.querySelector('.hero-type')!).opacity),
      progress: Math.max(0, Math.min(1, -frame.top / frame.height)),
      width: innerWidth,
      height: innerHeight,
    };
  });
}

test('hero remains composed at every tenth of a slow scroll, forwards and backwards', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  if (process.env.HERO_WIDE) await page.setViewportSize({ width: 2048, height: 1009 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Pause ambient motion' })).toBeEnabled();
  await expect(page.locator('.hero-work-link')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero')).not.toHaveAttribute('data-hero-entering', '');
  await page.evaluate(() => document.fonts.ready);
  const initial = await geometry(page);
  const length = initial.frame.bottom - initial.frame.top;
  const frames = [];
  for (let percent = 0; percent <= 100; percent += 10) {
    const target = percent === 0 ? 0 : initial.frame.top + (length * percent) / 100;
    const current = await page.evaluate(() => scrollY);
    if (target > current) await slowWheel(page, target - current);
    const state = await geometry(page);
    frames.push({ percent, ...state });
    expect(state.lineOffset).toBeCloseTo(initial.lineOffset, 1);
    expect(state.scriptOffset).toBeCloseTo(initial.scriptOffset, 1);
    expect(state.scriptX).toBeCloseTo(initial.scriptX, 1);
    expect(state.headlineOpacity).toBeGreaterThanOrEqual(0.84);
    expect(state.copyOpacity).toBeGreaterThanOrEqual(0.34);
    if (state.frame.bottom > 0) {
      expect(state.image.top).toBeLessThanOrEqual(Math.max(0, state.frame.top));
      expect(state.image.bottom).toBeGreaterThanOrEqual(Math.min(state.height, state.frame.bottom));
      expect(state.image.left).toBeLessThanOrEqual(state.frame.left);
      expect(state.image.right).toBeGreaterThanOrEqual(state.frame.right);
    }
    await expect(page.locator('.hero-serif')).toHaveCSS('overflow', 'visible');
    await expect(page.locator('.hero-line-content')).toHaveCSS('transform', 'none');
    await expect(page.locator('.hero-serif-content')).toHaveCSS('transform', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`hero-${percent}.png`) });
    // Stopping must not leave another scrub tween catching up after Lenis settles.
    const still = await geometry(page);
    expect(still.scriptOffset).toBeCloseTo(state.scriptOffset, 1);
    expect(still.headlineOpacity).toBeCloseTo(state.headlineOpacity, 2);
  }
  for (const percent of [70, 40, 10, 0]) {
    const target = percent ? initial.frame.top + (length * percent) / 100 : 0;
    await slowWheel(page, target - (await page.evaluate(() => scrollY)));
    const state = await geometry(page);
    expect(state.scriptOffset).toBeCloseTo(initial.scriptOffset, 1);
    expect(state.lineOffset).toBeCloseTo(initial.lineOffset, 1);
    await page.screenshot({ path: info.outputPath(`hero-reverse-${percent}.png`) });
  }
  await expect(page.locator('.hero .pin-spacer')).toHaveCount(0);
  await info.attach('hero-scroll-geometry', {
    body: JSON.stringify(frames, null, 2),
    contentType: 'application/json',
  });
  expect(errors).toEqual([]);
});

test('scrolling during the entrance completes the composition; pause and reduced motion restore it', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero')).toHaveAttribute('data-hero-entering', '');
  await slowWheel(page, 60);
  await expect(page.locator('.hero')).not.toHaveAttribute('data-hero-entering', '');
  await expect(page.locator('.hero-work-link')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-serif-content')).toHaveCSS('transform', 'none');
  await page.screenshot({ path: info.outputPath('hero-interrupted-entrance.png') });
  await page.getByRole('button', { name: 'Pause ambient motion' }).click();
  await expect(page.locator('.hero-image')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-type')).toHaveCSS('transform', 'none');
  await page.getByRole('button', { name: 'Resume ambient motion' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-image')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-type')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-serif')).toHaveCSS('overflow', 'visible');
  await expect(page.getByRole('button', { name: 'Pause ambient motion' })).toBeDisabled();
});
