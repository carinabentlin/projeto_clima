// Importa a função real de API
const { fetchWeatherBundle } = require("../api.js");

// Antes de cada teste, substituímos fetch() por um mock (simulação)
beforeEach(() => {
  global.fetch = jest.fn();
});

describe("Testes da função fetchWeatherBundle", () => {

  test("Retorna objeto de clima quando a API responde corretamente", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_weather: { temperature: 22, windspeed: 10, weathercode: 1 },
        daily: { time: ["2025-01-01"], weathercode: [1] }
      })
    });

    const clima = await fetchWeatherBundle(-23.55, -46.63);

    expect(clima.current_weather.temperature).toBe(22);
    expect(clima.current_weather.windspeed).toBe(10);
  });

  test("Lança erro quando a API não retorna current_weather", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        daily: { time: ["2025-01-01"], weathercode: [1] }
      })
    });

    await expect(fetchWeatherBundle(-23.55, -46.63))
      .rejects.toThrow("Dados climáticos indisponíveis.");
  });

  test("Lança erro quando status da API é diferente de ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchWeatherBundle(-23.55, -46.63))
      .rejects.toThrow("Erro ao buscar clima.");
  });

});
