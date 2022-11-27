const btn = document.getElementById("btn-calcular");
btn.addEventListener("click", () => {
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    if(origem == 0 || destino == 0) {
        showMessage("Preencha os campos!", "danger");
    }
    else if(origem == destino) {
        showMessage("A origem não pode ser igual ao destino!", "danger");
    }
    else {
        const result = dijkstra(origem, destino);
        showMessage(result);
    }
});


function showMessage(msg, type = "primary") {
    const msgContainer = document.getElementById("msg-container");
    msgContainer.innerHTML = `
    <div class="alert alert-${type} mt-3"" role="alert">
        ${msg}
    </div>
    `;
}