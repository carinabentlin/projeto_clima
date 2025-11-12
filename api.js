/**
 * @fileoverview Lógica de busca e renderização de clima com Open-Meteo.
 * - Busca por nome da cidade (Geocoding API).
 * - Mostra clima atual + previsão de 5 dias (variáveis adicionais).
 * - Sem geolocalização (remoção solicitada).
 * - Inclui mapeamento de ícones por weathercode.
 * - Suporte a tema claro/escuro (toggle).
 */

/* ================================
   Utilidades de UI
==================================*/

/** Atalho para querySelector */
const $ = (sel) => document.querySelector(sel);

/** Exibe mensagem leve para o usuário (área abaixo da busca) */
function showMsg(text = "", type = "warn") {
  const el = $("#mensagem");
  if (!el) return;
  el.textContent = text;
  el.style.color = type === "err" ? "var(--err)"
    : type === "ok" ? "var(--ok)"
      : "var(--warn)";
}

/* ================================
   Mapa de Ícones + descrição por código
==================================*/
function getWeatherIcon(code) {
  const map = {
    0: "wi-day-sunny.svg",        // Céu limpo
    1: "wi-day-cloudy.svg",       // Parcialmente nublado
    2: "wi-day-cloudy.svg",
    3: "wi-cloud.svg",            // Nublado
    45: "wi-fog.svg",             // Névoa
    48: "wi-fog.svg",
    51: "wi-day-rain.svg",        // Chuvisco
    53: "wi-day-rain.svg",
    55: "wi-day-rain.svg",
    61: "wi-rain.svg",            // Chuva
    63: "wi-rain.svg",
    65: "wi-rain.svg",
    71: "wi-snow.svg",            // Neve
    73: "wi-snow.svg",
    75: "wi-snow.svg",
    80: "wi-day-showers.svg",     // Pancadas
    81: "wi-day-showers.svg",
    82: "wi-day-showers.svg",
    95: "wi-day-lightning.svg",   // Tempestade
    96: "wi-day-lightning.svg",
    99: "wi-day-lightning.svg"
  };
  return map[code] || "wi-cloud.svg";
}

function getWeatherText(code) {
  const map = {
    0: "Céu limpo",
    1: "Poucas nuvens",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro gelado",
    51: "Chuvisco fraco",
    53: "Chuvisco moderado",
    55: "Chuvisco intenso",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas fracas",
    81: "Pancadas moderadas",
    82: "Pancadas fortes",
    95: "Tempestade",
    96: "Tempestade com granizo",
    99: "Tempestade severa"
  };
  return map[code] || "Condição desconhecida";
}

/* ================================
   Core – chamadas de API
==================================*/

/**
 * Converte nome da cidade → primeira coordenada encontrada (lat/lon + name).
 * @param {string} cityName
 * @returns {Promise<{latitude:number, longitude:number, name:string}>}
 * @throws {Error} Se não encontrar resultados.
 */
async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&language=pt`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Falha ao geocodificar a cidade.");
  const data = await r.json();
  if (!data.results?.length) throw new Error("Cidade não encontrada.");
  const { latitude, longitude, name, country = "" } = data.results[0];
  return { latitude, longitude, name: country ? `${name}, ${country}` : name };
}

/**
 * Busca clima atual + 5 dias de previsão.
 * Inclui: weathercode, temp max/min, vento máx, precipitação total e umidade média.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Objeto bruto retornado pela Open-Meteo.
 */
async function fetchWeatherBundle(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_sum,relative_humidity_2m_mean` +
    `&timezone=auto`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Erro ao buscar clima.");
  const data = await r.json();
  if (!data.current_weather || !data.daily?.time) {
    throw new Error("Dados climáticos indisponíveis.");
  }
  return data;
}

/* ================================
   Renderização
==================================*/

/**
 * Renderiza o card principal e a grade de 5 dias no #resultado.
 * @param {string} cityLabel Nome da cidade formatado
 * @param {Object} weather Objeto retornado por fetchWeatherBundle
 */
function renderWeather(cityLabel, weather) {
  const { current_weather, daily } = weather;
  const code = current_weather.weathercode;
  const icon = getWeatherIcon(code);
  const text = getWeatherText(code);

  // Card principal (temperatura centralizada)
  const mainCard = `
    <article class="card-main">
      <div class="current-top">
        <img src="assets/img/${icon}" alt="${text}" />
        <div>
          <h2 class="city-name">${cityLabel}</h2>
          <p class="current-desc">${text}</p>
        </div>
      </div>
      <div class="temp-block">
        <h3 class="temp-value">${Math.round(current_weather.temperature)}°</h3>
      </div>
    </article>
  `;

  // Título da seção dos próximos dias
  const sectionTitle = `<h3 class="section-title">Previsão para os próximos 5 dias:</h3>`;

  // Cards de 5 dias
  const dayCards = daily.time
    .slice(0, 5)
    .map((iso, i) => {
      const dayName = new Date(iso).toLocaleDateString("pt-BR", { weekday: "long" });
      const wCode = daily.weathercode[i];
      const wIcon = getWeatherIcon(wCode);
      const wText = getWeatherText(wCode);
      const tmax = Math.round(daily.temperature_2m_max[i]);
      const tmin = Math.round(daily.temperature_2m_min[i]);
      const wind = Math.round(daily.windspeed_10m_max[i]); // km/h
      const rain = Math.round(daily.precipitation_sum[i]); // mm
      const rh = daily.relative_humidity_2m_mean?.[i];
      const rhStr = (typeof rh === "number") ? `${Math.round(rh)}%` : "—";

      return `
        <article class="card-small" aria-label="${dayName}">
          <img src="assets/img/${wIcon}" alt="${wText}" />
          <div class="day-name">${dayName}</div>
          <div class="minmax">${tmax}° / ${tmin}°</div>
          <div class="meta">💨 Vento: ${wind} km/h</div>
          <div class="meta">🌧 Chuva: ${rain} mm</div>
          <div class="meta">💧 Umidade: ${rhStr}</div>
        </article>
      `;
    })
    .join("");

  $("#resultado").innerHTML = `${mainCard}${sectionTitle}<div class="card-small-container">${dayCards}</div>`;
}

/* ================================
   Controlador (UI events)
==================================*/

/**
 * Faz a busca ao clicar em "Buscar" ou pressionar Enter.
 */
async function onSearch() {
  const input = $("#cidade");
  const q = (input?.value || "").trim();
  if (!q) {
    showMsg("Digite o nome de uma cidade.");
    return;
  }
  showMsg(""); // limpa mensagens

  try {
    // 1) Geocoding → 2) Forecast → 3) Render
    const { latitude, longitude, name } = await geocodeCity(q);
    const data = await fetchWeatherBundle(latitude, longitude);
    renderWeather(name, data);
  } catch (err) {
    console.error(err);
    showMsg(err.message || "Não foi possível obter os dados agora.", "err");
  }
}

/* ================================
   Tema Claro/Escuro
==================================*/
function toggleTheme() {
  const html = document.documentElement; // <html>
  const current = html.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  // Ícone do botão
  const btn = $("#toggleTheme");
  if (btn) btn.textContent = next === "light" ? "🌙" : "☀️";
}

/* ================================
   Bind de eventos
==================================*/
document.addEventListener("DOMContentLoaded", () => {
  $("#buscar")?.addEventListener("click", onSearch);
  $("#cidade")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onSearch();
  });
  $("#toggleTheme")?.addEventListener("click", toggleTheme);
});

// ===============================
// Export para testes (Node/Jest)
// ===============================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    geocodeCity,
    fetchWeatherBundle,
    getWeatherText,
    getWeatherIcon,
    onSearch
  };

}