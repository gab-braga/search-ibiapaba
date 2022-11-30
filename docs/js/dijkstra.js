class Cidade {
    id;
    nome;
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
    }
}

class Vertice {
    rotulo;
    cidade;
    arestas;

    origem = false;
    precedente = 0;
    distanciaAcumulada = Number.MAX_SAFE_INTEGER;
    constructor(rotulo, cidade, arestas) {
        this.rotulo = rotulo;
        this.cidade = cidade;
        this.arestas = arestas;
    }
}

class Aresta {
    adjacente;
    distancia;
    constructor(adjacente, distancia) {
        this.adjacente = adjacente;
        this.distancia = distancia;
    }
}

const vicosa = new Cidade(2314102, "Viçosa");
const tiangua = new Cidade(2313401, "Tianguá");
const ubajara = new Cidade(2313609, "Ubajara");
const ipiapina = new Cidade(2305308, "Ibiapina");
const saobenedito = new Cidade(2312304, "São Benedito");
const carnaubal = new Cidade(2303402, "Carnaubal");
const guaraciaba = new Cidade(2305001, "Guaraciaba do Norte");
const croata = new Cidade(2304236, "Croatá");

const A = new Vertice("A", vicosa, [
    new Aresta(tiangua, 31.4),
    new Aresta(tiangua, 33.4)
]);
const B = new Vertice("B", tiangua, [
    new Aresta(vicosa, 31.4),
    new Aresta(vicosa, 33.4),
    new Aresta(ubajara, 16.7)
]);
const C = new Vertice("C", ubajara, [
    new Aresta(tiangua, 16.7),
    new Aresta(ipiapina, 8.7)
]);
const D = new Vertice("D", ipiapina, [
    new Aresta(ubajara, 8.7),
    new Aresta(saobenedito, 14.2)
]);
const E = new Vertice("E", saobenedito, [
    new Aresta(ipiapina, 14.2),
    new Aresta(carnaubal, 25.0),
    new Aresta(carnaubal, 19.1),
    new Aresta(guaraciaba, 22.7)
]);
const F = new Vertice("F", carnaubal, [
    new Aresta(saobenedito, 25.0),
    new Aresta(saobenedito, 19.1),
    new Aresta(guaraciaba, 26.2),
    new Aresta(croata, 41.0)
]);
const G = new Vertice("G", guaraciaba, [
    new Aresta(saobenedito, 22.7),
    new Aresta(carnaubal, 26.2),
    new Aresta(croata, 36.6)
]);
const H = new Vertice("H", croata, [
    new Aresta(carnaubal, 41.0),
    new Aresta(guaraciaba, 36.6)
]);

const GRAFO = [A, B, C, D, E, F, G, H];

function dijkstra(idCidadeOrigem, idCidadeDestino) {
    reiniciarDados();
    const origem = obterVerticePorIdCidade(idCidadeOrigem);
    origem.origem = true;
    origem.distanciaAcumulada = 0;

    percorrerArestas(origem);
    const caminho = obterCaminho(idCidadeDestino);
    return obterResultado(caminho)
}

function obterVerticePorIdCidade(id) {
    for(let i = 0; i < GRAFO.length; i++) {
        const vertice = GRAFO[i];
        if(vertice.cidade.id == id) {
            return vertice;
        }
    }
}

function percorrerArestas(vertice) {
    const arestas = vertice.arestas;
    for(let i = 0; i < arestas.length; i++) {
        const aresta = arestas[i];
        const adjacente = obterVerticePorIdCidade(aresta.adjacente.id);
        if(!adjacente.origem) {
            const distanciaAcumulada = vertice.distanciaAcumulada + aresta.distancia;
            if(distanciaAcumulada < adjacente.distanciaAcumulada) {
                adjacente.precedente = vertice;
                adjacente.distanciaAcumulada = distanciaAcumulada;
                percorrerArestas(adjacente);
            }
        }
    }
}

function obterCaminho(destino) {
    let index = -1;
    for(let i = 0; i < GRAFO.length; i++) {
        const vertice = GRAFO[i];
        if(vertice.cidade.id == destino) {
            index = i;
            break;
        }
    }
    if(index == -1) throw new Error("Destino não existe.");

    let caminho = [];
    let vertice = GRAFO[index];
    while(!vertice.origem) {
        caminho.unshift(vertice);
        vertice = vertice.precedente;
    }
    caminho.unshift(vertice);
    return caminho;
}

function obterResultado(caminho) {
    let message = "";
    let distancia = caminho[caminho.length-1].distanciaAcumulada;
    for(let i = 0; i < caminho.length; i++) {
        message += caminho[i].cidade.nome;
        message += (i+1 < caminho.length) ? ", " : ".";
    }
    return {message, distancia};
}

function reiniciarDados() {
    for(let i = 0; i < GRAFO.length; i++) {
        const vertice = GRAFO[i];
        vertice.origem = false;
        vertice.precedente = 0;
        vertice.distanciaAcumulada = Number.MAX_SAFE_INTEGER;
    }
}