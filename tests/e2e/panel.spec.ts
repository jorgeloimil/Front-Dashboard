import { expect, test, type Page } from '@playwright/test';
import { articulo, fitcinaHoy, mockApi } from './support/mockApi';

/** Toca un botón de la barra de navegación de abajo. */
const irA = (page: Page, nombre: string) => page.getByRole('navigation', { name: 'Secciones' }).getByRole('button', { name: nombre, exact: true }).click();

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
    await expect(page.getByRole('list', { name: 'Próximas horas' }).getByRole('listitem')).toHaveCount(5);
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

test.describe('Hoy toca (Fitcina)', () => {
  test('muestra las rutinas de hoy con su estado y la racha', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    const tarjeta = page.getByRole('region', { name: 'Hoy toca…' });
    const rutinas = tarjeta.getByRole('list', { name: 'Rutinas de hoy' }).getByRole('listitem');

    await expect(rutinas).toHaveCount(2);
    await expect(rutinas.nth(0)).toContainText('Empuje');
    await expect(rutinas.nth(0)).toContainText('5 ejercicios · intensidad alta');
    await expect(rutinas.nth(0)).toContainText('Hecha');
    await expect(rutinas.nth(1)).toContainText('Core');
    await expect(rutinas.nth(1)).toContainText('1 ejercicio');
    await expect(rutinas.nth(1)).toContainText('Pendiente');
    await expect(tarjeta).toContainText('Racha de 3 días · 2 sesiones esta semana');
  });

  test('en día de descanso lo dice', async ({ page }) => {
    await mockApi(page, { fitcina: { ...fitcinaHoy, rutinas: [] } });
    await page.goto('/');
    await expect(page.getByTestId('fitcina-descanso')).toContainText('Hoy toca descansar');
  });

  test('con datos viejos los muestra y avisa de la hora', async ({ page }) => {
    await mockApi(page, { fitcina: { ...fitcinaHoy, estado: 'DESACTUALIZADO', motivo: 'No se pudo consultar Fitcina' } });
    await page.goto('/');
    const tarjeta = page.getByRole('region', { name: 'Hoy toca…' });
    await expect(tarjeta.getByRole('status')).toHaveText('Fitcina no responde; datos de las 13:00');
    await expect(tarjeta).toContainText('Empuje');
  });

  test('si Fitcina no está disponible avisa sin romper el resto', async ({ page }) => {
    await mockApi(page, {
      fitcina: { ...fitcinaHoy, estado: 'NO_DISPONIBLE', motivo: 'No se pudo consultar Fitcina', rutinas: [], rachaDias: null, sesionesSemana: null },
    });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Hoy toca…' }).getByRole('alert')).toHaveText('Fitcina no responde: No se pudo consultar Fitcina');
    await expect(page.getByRole('region', { name: 'La compra' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Agenda' })).toBeVisible();
  });

  test('sin configurar explica qué variables poner', async ({ page }) => {
    await mockApi(page, { fitcina: { ...fitcinaHoy, estado: 'SIN_CONFIGURAR', rutinas: [], rachaDias: null, sesionesSemana: null } });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Hoy toca…' })).toContainText('FITCINA_EMAIL');
  });

  test('si el backend falla, avisa en la tarjeta y el panel sigue', async ({ page }) => {
    await mockApi(page, { fitcina: null });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Hoy toca…' }).getByRole('alert')).toHaveText('Ha ocurrido un error inesperado');
    await expect(page.getByRole('region', { name: 'El tiempo' })).toBeVisible();
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
    await irA(page, 'Compra');
    await expect(page.getByText('La lista está vacía')).toBeVisible();
  });

  test('añade un artículo con cantidad y lo agrupa por pasillo', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');
    await irA(page, 'Compra');

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
    await irA(page, 'Compra');
    await page.getByLabel('Artículo').fill('   ');
    await expect(page.getByRole('button', { name: 'Añadir' })).toBeDisabled();
    expect(estado.articulos).toHaveLength(0);
  });

  test('marcar comprado lo pasa a Comprados y se puede desmarcar', async ({ page }) => {
    await mockApi(page, { articulos: [articulo(1, 'Pan'), articulo(2, 'Huevos')] });
    await page.goto('/');
    await irA(page, 'Compra');

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
    await irA(page, 'Compra');

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
    await irA(page, 'Compra');
    estado.compraCaida = true;

    await page.getByLabel('Artículo').fill('Café');
    await page.getByRole('button', { name: 'Añadir' }).click();

    await expect(page.getByRole('region', { name: 'La compra' }).getByRole('alert')).toContainText('Ha ocurrido un error inesperado');
    await expect(page.getByLabel('Artículo')).toHaveValue('Café');
  });

  test('se refresca sola con lo que apuntan otros', async ({ page }) => {
    const estado = await mockApi(page);
    await page.goto('/');
    await irA(page, 'Compra');
    await expect(page.getByText('La lista está vacía')).toBeVisible();

    estado.articulos.push(articulo(7, 'Yogures'));
    await page.clock.fastForward(31_000);
    await expect(page.getByRole('checkbox', { name: 'Yogures' })).toBeVisible();
  });
});

test.describe('Diseño de tablet', () => {
  test('el inicio cabe en 1280×800 sin scroll de página y con las ocho tarjetas', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    for (const nombre of ['Agenda', 'La compra', 'El tiempo', 'Luces', 'Hoy toca…', 'Menú de hoy', 'Tareas', 'Súper · noviembre']) {
      await expect(page.getByRole('region', { name: nombre })).toBeVisible();
    }
    const medidas = await page.evaluate(() => ({ alto: document.documentElement.scrollHeight, ventana: window.innerHeight }));
    expect(medidas.alto).toBeLessThanOrEqual(medidas.ventana);
  });

  test('lo que no tiene backend se marca como ejemplo', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    for (const nombre of ['Luces', 'Menú de hoy', 'Tareas', 'Súper · noviembre']) {
      await expect(page.getByRole('region', { name: nombre })).toContainText('Ejemplo');
    }
    const nav = page.getByRole('navigation', { name: 'Secciones' });
    await expect(nav.getByRole('button', { name: 'Menú fase 2' })).toBeDisabled();
    await expect(nav.getByRole('button', { name: 'Casa 3D fase 3' })).toBeDisabled();
  });

  test('tocar la tarjeta de la compra abre la pantalla de compra y la navegación vuelve', async ({ page }) => {
    await mockApi(page, { articulos: [articulo(1, 'Pan')] });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'La compra' })).toContainText('Pan');
    await page.getByRole('button', { name: 'Abrir la compra' }).click();
    await expect(page.getByLabel('Artículo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Compra', exact: true })).toHaveAttribute('aria-current', 'page');
    await irA(page, 'Inicio');
    await expect(page.getByRole('region', { name: 'Agenda' })).toBeVisible();
  });

  test('luces de ejemplo: interruptor y escenas', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    const luces = page.getByRole('region', { name: 'Luces' });
    await expect(luces.getByRole('switch', { name: 'Luz del techo' })).toHaveAttribute('aria-checked', 'false');
    await luces.getByRole('switch', { name: 'Luz del techo' }).click();
    await expect(luces.getByRole('switch', { name: 'Luz del techo' })).toHaveAttribute('aria-checked', 'true');
    await luces.getByRole('button', { name: /Relax/ }).click();
    await expect(luces.getByRole('switch', { name: 'Luz del techo' })).toHaveAttribute('aria-checked', 'false');
    await irA(page, 'Luces');
    await expect(page.getByRole('button', { name: /Relax/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Brillo Lámpara del escritorio')).toHaveValue('30');
  });

  test('el flujo de escanear ticket es un ejemplo y no guarda nada', async ({ page }) => {
    const estado = await mockApi(page, { articulos: [articulo(1, 'Leche')] });
    await page.goto('/');
    await irA(page, 'Compra');
    await page.getByRole('button', { name: /Escanear ticket/ }).click();
    const modal = page.getByRole('dialog', { name: 'Registrar ticket' });
    await expect(modal).toContainText('Ejemplo');
    await expect(modal).toContainText('TOTAL');
    await expect(modal.getByRole('button', { name: /Guardar/ })).toBeDisabled();
    await modal.getByRole('button', { name: 'Cerrar' }).click();
    await expect(modal).toHaveCount(0);
    expect(estado.peticiones.filter((p) => p !== 'GET /')).toEqual([]);
  });

  test('la píldora de avisos sale solo si algo va mal', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await expect(page.getByText('Todo en orden')).toBeVisible();
    await expect(page.getByRole('button', { name: /aviso/ })).toHaveCount(0);

    await mockApi(page, { fitcina: null });
    await page.goto('/');
    await expect(page.getByRole('button', { name: '1 aviso' })).toBeVisible();
    await expect(page.getByText('Con avisos')).toBeVisible();
  });
});

test.describe('Responsive', () => {
  for (const [nombre, ancho, alto] of [['tablet en vertical', 768, 1024], ['móvil', 390, 844]] as const) {
    test(`${nombre}: sin desbordes laterales y con las tarjetas completas`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: alto });
      await mockApi(page, { articulos: [articulo(1, 'Pan')] });
      await page.goto('/');
      await expect(page.getByTestId('tiempo-actual')).toBeVisible();

      // Ninguna pantalla se sale de lado
      for (const pantalla of ['Inicio', 'Compra', 'Luces']) {
        await irA(page, pantalla);
        const ancho_ = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(ancho_, pantalla).toBeLessThanOrEqual(ancho);
      }

      // La navegación cabe entera y sus botones son táctiles
      await irA(page, 'Inicio');
      const botones = page.getByRole('navigation', { name: 'Secciones' }).getByRole('button');
      for (const boton of await botones.all()) {
        if (!(await boton.isVisible())) continue;
        const caja = await boton.boundingBox();
        expect(caja!.x + caja!.width).toBeLessThanOrEqual(ancho + 1);
        expect(caja!.height).toBeGreaterThanOrEqual(44);
      }

      // Ninguna tarjeta recorta su contenido: la pantalla hace scroll en su lugar
      const recortadas = await page.evaluate(() =>
        [...document.querySelectorAll('main section')]
          .filter((s) => s.scrollHeight > s.clientHeight + 1 && getComputedStyle(s).overflow === 'hidden')
          .map((s) => s.getAttribute('aria-label')),
      );
      expect(recortadas).toEqual([]);
    });
  }

  test('en el móvil solo salen las tres secciones que existen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockApi(page);
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Secciones' });
    await expect(nav.getByRole('button', { name: 'Luces', exact: true })).toBeVisible();
    await expect(nav.getByRole('button', { name: /Menú/ })).toBeHidden();
  });
});
