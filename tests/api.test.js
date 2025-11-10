const { buscarClimaPorCoordenadas } = require("../api.js");

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("Testes da função buscarClimaPorCoordenadas", () => {

  test("Retorna dados de clima quando a API responde corretamente", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_weather: { temperature: 22, windspeed: 10 }
      })
    });

    const clima = await buscarClimaPorCoordenadas(-23.55, -46.63);

    expect(clima).toHaveProperty("temperature", 22);
    expect(clima).toHaveProperty("windspeed", 10);
  });

  test("Lança erro quando a API não retorna current_weather", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    await expect(buscarClimaPorCoordenadas(-23.55, -46.63))
      .rejects.toThrow("Clima não disponível para esta localização");
  });

  test("Lança erro quando status da API é diferente de ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false
    });

    await expect(buscarClimaPorCoordenadas(-23.55, -46.63))
      .rejects.toThrow("Erro ao buscar clima");
  });

});
