import { expect, test } from '@playwright/test';

test('mantém a previsão utilizável de 320 px a desktop', async ({ page }) => {
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      json: {
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            country: 'Brasil',
            admin1: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            timezone: 'America/Sao_Paulo',
          },
        ],
      },
    });
  });
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      json: {
        timezone: 'America/Sao_Paulo',
        current: {
          temperature_2m: 24,
          relative_humidity_2m: 68,
          weather_code: 2,
          wind_speed_10m: 12,
          precipitation: 0.4,
          pressure_msl: 1014,
        },
        current_units: {
          temperature_2m: '°C',
          relative_humidity_2m: '%',
          weather_code: 'wmo code',
          wind_speed_10m: 'km/h',
          precipitation: 'mm',
          pressure_msl: 'hPa',
        },
        daily: {
          time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
          weather_code: [0, 2, 3, 61, 0],
          temperature_2m_min: [18, 19, 17, 16, 18],
          temperature_2m_max: [27, 26, 23, 22, 28],
        },
        daily_units: {
          weather_code: 'wmo code',
          temperature_2m_min: '°C',
          temperature_2m_max: '°C',
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /São Paulo.*Brasil/ }).click();
  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();

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
