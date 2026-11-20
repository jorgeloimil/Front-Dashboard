import { expect, test } from '@playwright/test';
import { articulo, mockApi } from './support/mockApi';

test.describe('Cabecera', () => {
  test('muestra la hora y la fecha de casa', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await expect(page.getByTestId('hora')).toHaveText('13:00');
    await expect(page.getByTestId('fecha')).toHaveText('Viernes, 20 de noviembre');
  });
});

test.describe('Tiempo', () => {
  test('muestra el tiempo actual, las horas y los días', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    const actual = page.getByTestId('tiempo-actual');
    await expect(actual).toContainText('11°');
    await expect(actual).toContainText('Parcialmente nublado');
    await expect(actual).toContainText('63 %');
    await expect(page.getByRole('list', { name: 'Próximas horas' }).getByRole('listitem')).toHaveCount(6);
    await expect(page.getByRole('list', { name: 'Próximos días' })).toContainText('Hoy');
    await expect(page.getByRole('list', { name: 'Próximos días' })).toContainText('sáb');
  });

  test('si falla, avisa sin romper el resto', async ({ page }) => {
    await mockApi(page);
    await page.route('**/api/tiempo', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"detail":"Servicio no disponible"}' }));
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'El tiempo' }).getByRole('alert')).toHaveText('Servicio no disponible');
    await expect(page.getByRole('region', { name: 'La compra' })).toBeVisible();
  });
});

test.describe('Agenda', () => {
  test('agrupa los eventos por día', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    const agenda = page.getByRole('region', { name: 'Agenda' });

    // El viaje empezó ayer y acaba mañana a las 10:00: hoy dura todo el día y sale también mañana
    await expect(agenda.getByRole('region', { name: 'Hoy' })).toContainText('Viaje de trabajo');
    await expect(agenda.getByRole('region', { name: 'Hoy' })).toContainText('Todo el día');
    await expect(agenda.getByRole('region', { name: 'Mañana' })).toContainText('hasta 10:00');
    // Los días sin nada no salen (martes, jueves...), pero Hoy sí
    await expect(agenda.getByRole('region', { name: 'Lunes 23' })).toContainText('17:15 – 18:00');
    await expect(agenda.getByRole('region', { name: 'Lunes 23' })).toContainText('Clínica Sonrisas');
    await expect(agenda.getByRole('region', { name: 'Miércoles 25' })).toContainText('Todo el día');
    await expect(agenda.getByRole('region', { name: 'Martes 24' })).toHaveCount(0);
  });

  test('sin calendarios explica cómo conectarlos', async ({ page }) => {
    await mockApi(page, { sinCalendarios: true });
    await page.goto('/');
    const agenda = page.getByRole('region', { name: 'Agenda' });
    await expect(agenda).toContainText('No hay ningún calendario conectado');
    await expect(agenda.getByRole('region', { name: 'Hoy' })).toContainText('Nada apuntado');
  });
});

test.describe('Lista de la compra', () => {
  test('lista vacía', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await expect(page.getByText('La lista está vacía')).toBeVisible();
  });

  test('añade un artículo con cantidad y lo agrupa por pasillo', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');

    await page.getByLabel('Artículo').fill('Leche semidesnatada');
    await page.getByLabel('Cantidad').fill('6 bricks');
    await page.getByRole('button', { name: 'Añadir' }).click();

    const pasillo = page.getByRole('region', { name: 'Lácteos y huevos' });
    await expect(pasillo.getByRole('checkbox', { name: 'Leche semidesnatada' })).toContainText('6 bricks');
    await expect(page.getByLabel('Artículo')).toHaveValue('');
    expect(estado.articulos).toHaveLength(1);
  });

  test('no envía artículos en blanco', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');
    await page.getByLabel('Artículo').fill('   ');
    await expect(page.getByRole('button', { name: 'Añadir' })).toBeDisabled();
    expect(estado.articulos).toHaveLength(0);
  });

  test('marcar comprado lo pasa a Comprados y se puede desmarcar', async ({ page }) => {
    await mockApi(page, { articulos: [articulo(1, 'Pan'), articulo(2, 'Huevos')] });
    await page.goto('/');

    await page.getByRole('checkbox', { name: 'Pan' }).click();
    const comprados = page.getByRole('region', { name: 'Comprados' });
    await expect(comprados.getByRole('checkbox', { name: 'Pan' })).toBeChecked();
    await expect(page.getByText('1 por comprar')).toBeVisible();

    await comprados.getByRole('checkbox', { name: 'Pan' }).click();
    await expect(page.getByRole('region', { name: 'Comprados' })).toHaveCount(0);
    await expect(page.getByText('2 por comprar')).toBeVisible();
  });

  test('quita un artículo y limpia los comprados', async ({ page }) => {
    const estado = await mockApi(page, {
      articulos: [articulo(1, 'Pan', { comprado: true }), articulo(2, 'Huevos'), articulo(3, 'Sal', { comprado: true })],
    });
    await page.goto('/');

    await page.getByRole('button', { name: 'Quitar Huevos' }).click();
    await expect(page.getByRole('checkbox', { name: 'Huevos' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Limpiar' }).click();
    await expect(page.getByRole('region', { name: 'Comprados' })).toHaveCount(0);
    expect(estado.articulos).toHaveLength(0);
    expect(estado.peticiones).toContain('DELETE /comprados');
  });

  test('si el servidor falla, avisa y no pierde lo escrito', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');
    estado.compraCaida = true;

    await page.getByLabel('Artículo').fill('Café');
    await page.getByRole('button', { name: 'Añadir' }).click();

    await expect(page.getByRole('region', { name: 'La compra' }).getByRole('alert')).toContainText('Ha ocurrido un error inesperado');
    await expect(page.getByLabel('Artículo')).toHaveValue('Café');
  });

  test('se refresca sola con lo que apuntan otros', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');
    await expect(page.getByText('La lista está vacía')).toBeVisible();

    estado.articulos.push(articulo(7, 'Yogures'));
    await page.clock.fastForward(31_000);
    await expect(page.getByRole('checkbox', { name: 'Yogures' })).toBeVisible();
  });
});
