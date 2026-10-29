import { expect, test } from '@playwright/test';

test('mantém a previsão utilizável de 320 px a desktop', async ({ page }) => {
  await page.goto('/');

  const viewports = [
    { width: 320, columns: 2 },
    { width: 375, columns: 2 },
    { width: 768, columns: 3 },
    { width: 1024, columns: 5 },
    { width: 1440, columns: 5 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: 900 });

    const layout = await page.evaluate(() => {
      const forecastGrid = document.querySelector(
        'section[aria-labelledby="forecast-title"] > div:last-child',
      );

      return {
        columns: forecastGrid
          ? getComputedStyle(forecastGrid).gridTemplateColumns.split(' ').length
          : 0,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(layout.columns, `colunas em ${viewport.width}px`).toBe(viewport.columns);
    expect(
      layout.documentWidth,
      `a página não deve ter overflow horizontal em ${viewport.width}px`,
    ).toBeLessThanOrEqual(layout.viewportWidth);
    await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();
  }
});
