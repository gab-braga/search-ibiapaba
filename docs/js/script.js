const ORIGEM = 0;
const DESTINO = 1;
let values = [null, null];

function initilizeMap() {
    var url = "https://servicodados.ibge.gov.br/api/v3/malhas/microrregioes/23002?intrarregiao=municipio";

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();

    const mapa = document.getElementById("map");
    mapa.innerHTML = xhttp.responseText;
}

function definirEventoDeCorCidade() {
    const cidades = obterListaCidades();
    for (let cidade of cidades) {
        if (values[ORIGEM] == null) {
            cidade.removeEventListener("mouseenter", aplicarCorCidadeDestino)
            cidade.addEventListener("mouseenter", aplicarCorCidadeOrigem)
            cidade.addEventListener("mouseout", aplicarCorPadraoCidade)
        }
        else if (values[DESTINO] == null) {
            cidade.removeEventListener("mouseenter", aplicarCorCidadeOrigem)
            cidade.addEventListener("mouseenter", aplicarCorCidadeDestino)
            cidade.addEventListener("mouseout", aplicarCorPadraoCidade)
        }
        else {
            cidade.removeEventListener("mouseenter", aplicarCorCidadeOrigem)
            cidade.removeEventListener("mouseenter", aplicarCorCidadeDestino)
            cidade.removeEventListener("mouseout", aplicarCorPadraoCidade)
        }
    }
    definirEventoDeClickCidade();
}

function obterListaCidades() {
    const vicosa = document.getElementById("2314102");
    const tiangua = document.getElementById("2313401");
    const ubajara = document.getElementById("2313609");
    const ibiapina = document.getElementById("2305308");
    const saobenedito = document.getElementById("2312304");
    const carnaubal = document.getElementById("2303402");
    const guaraciaba = document.getElementById("2305001");
    const croata = document.getElementById("2304236");
    return [vicosa, tiangua, ubajara, ibiapina, saobenedito, carnaubal, guaraciaba, croata];
}

const aplicarCorCidadeOrigem = (event) => {
    event.target.classList.add("blue");
    const cidadeId = event.target.id;
    showTitleCidadeOrigem(cidadeId);
}

const aplicarCorCidadeDestino = (event) => {
    event.target.classList.add("red");
    const cidadeId = event.target.id;
    showTitleCidadeDestino(cidadeId);
}

const aplicarCorPadraoCidade = (event) => {
    if(values[ORIGEM] == null) event.target.classList.remove("blue");
    if(values[DESTINO] == null) event.target.classList.remove("red");
    showTitleCidadeOrigem();
    showTitleCidadeDestino();
}

function showTitleCidadeOrigem(cidadeId = null) {
    const titleContainer = document.getElementById("origem-container");
    if(cidadeId) {
        const cidadeName = obterNomeCidadePorId(cidadeId);
        titleContainer.innerHTML = `
            ${cidadeName}
            <button class="close" onclick="refazerCidade(${cidadeId})">
                <img src="assets/close.svg">
            </button>
            `;
    }
    else if(values[ORIGEM] == null) {
        titleContainer.innerHTML = "Selecione no mapa";
    }
}

function showTitleCidadeDestino(cidadeId = null) {
    const titleContainer = document.getElementById("destino-container");
    if(cidadeId) {
        const cidadeName = obterNomeCidadePorId(cidadeId);
        titleContainer.innerHTML = `
            ${cidadeName}
            <button class="close" onclick="refazerCidade(${cidadeId})">
                <img src="assets/close.svg">
            </button>
        `;
    }
    else if(values[DESTINO] == null) {
        titleContainer.innerHTML = "Selecione no mapa";
    }
}

function obterNomeCidadePorId(id) {
    switch (id) {
        case "2314102":
            return "Viçosa do Ceará";
        case "2313401":
            return "Tianguá";
        case "2313609":
            return "Ubajara";
        case "2305308":
            return "Ibiapina";
        case "2312304":
            return "São Benedito";
        case "2303402":
            return "Carnaubal";
        case "2305001":
            return "Guaraciaba do Norte";
        case "2304236":
            return "Croatá";
    }
}

function definirEventoDeClickCidade() {
    const cidades = obterListaCidades();
    for (let cidade of cidades) {
        if (values[ORIGEM] == null) {
            cidade.removeEventListener("click", definirCidadeDeDestino);
            cidade.addEventListener("click", definirCidadeDeOrigem);
        }
        else if (values[DESTINO] == null) {
            cidade.removeEventListener("click", definirCidadeDeOrigem);
            cidade.addEventListener("click", definirCidadeDeDestino);
        }
        else {
            cidade.removeEventListener("click", definirCidadeDeOrigem);
            cidade.removeEventListener("click", definirCidadeDeDestino);
        }
    }
}

const definirCidadeDeOrigem = (event) => {
    const element = event.target;
    element.classList.add("blue");
    const cidadeId = element.id;
    values[ORIGEM] = cidadeId;
    definirEventoDeCorCidade();
    calcularRota();
}

const definirCidadeDeDestino = (event) => {
    const element = event.target;
    element.classList.add("red");
    const cidadeId = element.id;
    values[DESTINO] = cidadeId;
    definirEventoDeCorCidade();
    calcularRota();
}

function refazerCidade(cidadeId) {
    if(values[ORIGEM]==cidadeId) {
        values[ORIGEM] = null;
        reiniciarCorCidadeDeOrigem();
        showTitleCidadeOrigem();
    }
    if(values[DESTINO]==cidadeId) {
        values[DESTINO] = null;
        reiniciarCorCidadeDeDestino();
        showTitleCidadeDestino();
    }
    calcularRota();
    definirEventoDeCorCidade();
    definirEventoDeClickCidade();
}

function reiniciarCorCidadeDeOrigem() {
    const cidades = obterListaCidades();
    for (let cidade of cidades) {
        cidade.classList.remove("blue");
    }
}

function reiniciarCorCidadeDeDestino() {
    const cidades = obterListaCidades();
    for (let cidade of cidades) {
        cidade.classList.remove("red");
    }
}

function calcularRota() {
    const origem = values[ORIGEM];
    const destino = values[DESTINO];
    const resultadosContainer = document.getElementById("resultados-container");
    if(origem != null && destino != null) {
        const resultados = dijkstra(origem, destino);
        showResultados(resultados);
        resultadosContainer.style.display = "block";
    }
    else {
        resultadosContainer.style.display = "none";
    }
}

function showResultados(resultados) {
    const cidadesResult = document.getElementById("cidades-result");
    const distanciaResul = document.getElementById("distancia-result");
    cidadesResult.innerText = resultados.message;
    distanciaResul.innerText = resultados.distancia + " KM";
}

initilizeMap();
definirEventoDeCorCidade();
definirEventoDeClickCidade();