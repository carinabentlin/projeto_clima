// Detecta ambiente para testes
let fetchFunction = fetch;
try { fetchFunction = require("node-fetch"); } catch (e) {}

// Converte o código do tempo para ícone + texto
function interpretarClima(code) {
  const tabela = {
    0: ["☀️", "Céu limpo"],
    1: ["🌤️", "Parcialmente nublado"],
    2: ["⛅", "Nublado"],
    3: ["☁️", "Nublado"],
    45: ["🌫️", "Nevoeiro"],
    48: ["🌫️", "Nevoeiro"],
    51: ["🌦️", "Chuvisco"],
    61: ["🌧️", "Chuva"],
    71: ["❄️", "Neve"],
    95: ["⛈️", "Tempestade"]
  };
  return tabela[code] || ["❓", "Condição desconhecida"];
}

async function buscarClima() {
  const cidade = document.getElementById("cidade").value.trim();
  const resultado = document.getElementById("resultado");

  if (!cidade) return alert("Digite o nome de uma cidade.");

  try {
    const geo = await fetchFunction(`https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`).then(r => r.json());
    if (!geo.results) {
      resultado.innerHTML = `<div class="erro-msg">Cidade não encontrada.</div>`;
      return;
    }

    const { latitude, longitude, name, country } = geo.results[0];

    const clima = await fetchFunction(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
      .then(r => r.json())
      .then(d => d.current_weather);

    const [icon, descricao] = interpretarClima(clima.weathercode);

    /* Define tema dia/noite */
    document.body.className = clima.is_day ? "dia" : "noite";

    resultado.innerHTML = `
      <div class="weather-card">
        <div class="temp-display">${icon} ${clima.temperature}°</div>
        <p class="city-label">${name}, ${country}</p>
        <p class="description">${descricao}</p>
      </div>`;
  } catch {
    resultado.innerHTML = `<div class="erro-msg">Não foi possível obter o clima. Tente novamente.</div>`;
  }
}
