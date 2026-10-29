import { expect, type Page, test } from '@playwright/test';

const city = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brasil',
  admin1: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

const forecast = {
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
};

async function mockSearch(page: Page, response: object, delay = 0) {
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    await route.fulfill({ json: response });
  });
}

async function mockForecast(page: Page) {
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: forecast });
  });
}

async function submitSearch(page: Page, query = 'São Paulo') {
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill(query);
  await page.getByRole('button', { name: 'Buscar' }).click();
}

async function expectGeoCitiesSkin(page: Page) {
  await page.mouse.move(0, 0);
  await expect(page.locator('.rainbow-divider').first()).toBeVisible();
  const styles = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const header = document.querySelector('.site-header');
    const button = document.querySelector('.geo-button');
    const ticker = document.querySelector('.ticker');
    const divider = document.querySelector('.rainbow-divider');
    const unitToggle = document.querySelector('.unit-toggle');
    const title = document.querySelector('h1');

    return {
      colors: [
        root.getPropertyValue('--geo-magenta').trim(),
        root.getPropertyValue('--geo-cyan').trim(),
        root.getPropertyValue('--geo-yellow').trim(),
        root.getPropertyValue('--geo-purple').trim(),
        root.getPropertyValue('--geo-lime').trim(),
      ],
      buttonColor: button ? getComputedStyle(button).backgroundColor : '',
      buttonTextColor: button ? getComputedStyle(button).color : '',
      tickerColor: ticker ? getComputedStyle(ticker).backgroundColor : '',
      headerBorder: header ? getComputedStyle(header).borderStyle : '',
      headerShadow: header ? getComputedStyle(header).boxShadow : '',
      unitColor: unitToggle ? getComputedStyle(unitToggle).backgroundColor : '',
      tiledBackground: getComputedStyle(document.body).backgroundImage,
      divider: divider ? getComputedStyle(divider).backgroundImage : '',
      titleFont: title ? getComputedStyle(title).fontFamily : '',
    };
  });

  expect(styles.colors).toEqual(['#ff00a8', '#00e5ff', '#fff000', '#7b2cff', '#39ff14']);
  expect(styles.buttonColor).toBe('rgb(255, 0, 168)');
  expect(styles.buttonTextColor).toBe('rgb(36, 18, 59)');
  expect(styles.tickerColor).toBe('rgb(123, 44, 255)');
  expect(styles.headerBorder).toBe('ridge');
  expect(styles.headerShadow).toContain('rgb(0, 229, 255)');
  expect(styles.unitColor).toBe('rgb(255, 240, 0)');
  expect(styles.tiledBackground).toContain('radial-gradient');
  expect(styles.divider).toContain('linear-gradient');
  expect(styles.titleFont).toContain('Georgia');
}

test('mantém busca, seleção e previsão por teclado em 320px e desktop', async ({ page }) => {
  await mockSearch(page, { results: [city] });
  await mockForecast(page);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo principal' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const searchbox = page.getByRole('searchbox', { name: 'Buscar cidade' });
  await expect(searchbox).toBeFocused();
  await expect
    .poll(() => searchbox.evaluate((element) => getComputedStyle(element).outlineStyle))
    .toBe('dashed');
  await searchbox.fill('São Paulo');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('button', { name: /São Paulo.*Brasil/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /São Paulo.*Brasil/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();

  const widths = [
    { width: 320, columns: 2 },
    { width: 375, columns: 2 },
    { width: 768, columns: 3 },
    { width: 1280, columns: 5 },
  ];

  for (const viewport of widths) {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    const layout = await page.evaluate(() => {
      const forecastGrid = document.querySelector('.forecast-grid');
      const essentials = [
        document.querySelector('.site-header'),
        document.querySelector('.search-form'),
        document.querySelector('.current-card'),
        ...document.querySelectorAll('.forecast-card'),
      ];

      return {
        columns: forecastGrid
          ? getComputedStyle(forecastGrid).gridTemplateColumns.split(' ').length
          : 0,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        essentialsFit: essentials.every((element) => {
          if (!element) return true;
          const bounds = element.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= window.innerWidth;
        }),
      };
    });

    expect(layout.columns, `colunas em ${viewport.width}px`).toBe(viewport.columns);
    expect(layout.documentWidth, `overflow em ${viewport.width}px`).toBeLessThanOrEqual(
      layout.viewportWidth,
    );
    expect(layout.essentialsFit, `conteúdo cortado em ${viewport.width}px`).toBe(true);
    await expectGeoCitiesSkin(page);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedMotion = await page.locator('.ticker-track').evaluate((element) => {
    return Number.parseFloat(getComputedStyle(element).animationDuration);
  });
  expect(reducedMotion).toBeLessThan(0.001);
});

test('mantém o visual GeoCities no estado sem resultados', async ({ page }) => {
  await mockSearch(page, { results: [] });
  await page.goto('/');
  await submitSearch(page, 'Atlantis');
  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expectGeoCitiesSkin(page);
});

test('mantém o visual GeoCities no estado de erro e permite nova tentativa', async ({ page }) => {
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ status: 500, body: 'Falha de rede' });
  });
  await page.goto('/');
  await submitSearch(page);
  await expect(page.getByRole('heading', { name: 'Algo deu errado' })).toBeVisible();
  await expectGeoCitiesSkin(page);
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});

test('mantém o visual GeoCities durante o carregamento e reduz movimento', async ({ page }) => {
  await mockSearch(page, { results: [city] }, 1500);
  await page.goto('/');
  await submitSearch(page);
  const loading = page.getByRole('status', { name: 'Buscando cidades...' });
  await expect(loading).toBeVisible();
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await expectGeoCitiesSkin(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.loading-wheel')).toHaveCSS('animation-name', 'none');
});

test('busca vazia ou com espaços não envia uma requisição', async ({ page }) => {
  let requests = 0;
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    requests += 1;
    await route.fulfill({ json: { results: [] } });
  });
  await page.goto('/');
  await submitSearch(page, '   \t ');

  await expect(page.getByRole('alert')).toHaveText('Digite o nome de uma cidade para buscar.');
  expect(requests).toBe(0);
});

test('mantém hover e foco visível no controle de unidade', async ({ page }) => {
  await page.goto('/');
  const fahrenheit = page.getByRole('button', { name: 'Fahrenheit' });
  await fahrenheit.hover();
  await expect(fahrenheit).toHaveCSS('background-color', 'rgb(92, 22, 210)');
  for (let tab = 0; tab < 6; tab += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(fahrenheit).toBeFocused();
  await expect
    .poll(() => fahrenheit.evaluate((element) => getComputedStyle(element).outlineStyle))
    .toBe('dashed');
});

test('mantém o estado vazio para geocodificação sem resultados', async ({ page }) => {
  await mockSearch(page, { results: [] });
  await page.goto('/');
  await submitSearch(page, 'Lugar inexistente');

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Buscar cidade' })).toHaveValue(
    'Lugar inexistente',
  );
});

test('repete a geocodificação após falha de rede com a mesma consulta', async ({ page }) => {
  const submittedQueries: string[] = [];
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    submittedQueries.push(new URL(route.request().url()).searchParams.get('name') ?? '');
    if (submittedQueries.length === 1) {
      await route.abort('failed');
      return;
    }
    await route.fulfill({ json: { results: [city] } });
  });
  await page.goto('/');
  await submitSearch(page, 'São Paulo');

  await expect(page.getByRole('heading', { name: 'Algo deu errado' })).toBeVisible();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('button', { name: /São Paulo.*Brasil/ })).toBeFocused();
  expect(submittedQueries).toEqual(['São Paulo', 'São Paulo']);
});

test('repete a previsão após falha de rede para as coordenadas selecionadas', async ({ page }) => {
  await mockSearch(page, { results: [city] });
  const requestedCoordinates: string[] = [];
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    const url = new URL(route.request().url());
    requestedCoordinates.push(`${url.searchParams.get('latitude')},${url.searchParams.get('longitude')}`);
    if (requestedCoordinates.length === 1) {
      await route.abort('failed');
      return;
    }
    await route.fulfill({ json: forecast });
  });
  await page.goto('/');
  await submitSearch(page);
  const result = page.getByRole('button', { name: /São Paulo.*Brasil/ });
  await expect(result).toBeVisible();
  await result.click();

  await expect(page.getByRole('heading', { name: 'Algo deu errado' })).toBeVisible();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  expect(requestedCoordinates).toEqual(['-23.55,-46.63', '-23.55,-46.63']);
});
