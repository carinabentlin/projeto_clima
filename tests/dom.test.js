
// Monta um DOM mínimo para a tela
document.body.innerHTML = `
  <button id="buscar">Buscar</button>
  <input id="cidade" />
  <div id="mensagem"></div>
  <div id="resultado"></div>
`;

const { onSearch } = require("../api.js");

// Aguarda a resolução das Promises agendadas (jsdom)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
    // Novo mock a cada teste
    global.fetch = jest.fn();
    // Garante valor no campo (senão onSearch sai antes)
    document.getElementById("cidade").value = "São Paulo";
});

describe("Testes da Interface (DOM)", () => {
    test("Botão Buscar existe", () => {
        const btn = document.getElementById("buscar");
        expect(btn).not.toBeNull();
    });

    test("Quando clicar no botão, faz 2 chamadas de fetch (geocode + forecast)", async () => {
        // 1ª chamada: geocoding
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                results: [
                    { latitude: -23.55, longitude: -46.63, name: "São Paulo", country: "Brasil" },
                ],
            }),
        });

        // 2ª chamada: previsão
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                current_weather: { temperature: 22, weathercode: 1 },
                daily: {
                    time: ["2025-01-01"],
                    weathercode: [1],
                    temperature_2m_max: [25],
                    temperature_2m_min: [19],
                    windspeed_10m_max: [10],
                    precipitation_sum: [2],
                    relative_humidity_2m_mean: [40],
                },
            }),
        });

        const btn = document.getElementById("buscar");
        // Liga o handler real que seu app usa
        btn.addEventListener("click", onSearch);

        // Dispara a ação do usuário
        btn.click();

        // Dá tempo para as Promises resolverem
        await flushPromises();
        await flushPromises();

        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test("Campo de busca existe", () => {
        const input = document.getElementById("cidade");
        expect(input).not.toBeNull();
    });
});
