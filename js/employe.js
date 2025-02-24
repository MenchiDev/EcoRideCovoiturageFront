alert("sa marche")
document.addEventListener("DOMContentLoaded", function() {
    // Simulation des trajets en cours
    const trajets = [
        { id: 1, chauffeur: "Jean Dupont", depart: "Paris", arrivee: "Lyon", date: "2025-02-25", participants: 3 },
        { id: 2, chauffeur: "Alice Martin", depart: "Marseille", arrivee: "Nice", date: "2025-02-26", participants: 2 }
    ];

    const avis = [
        { id: 1, passager: "Luc", chauffeur: "Jean Dupont", commentaire: "Super trajet !", note: 5 },
        { id: 2, passager: "Sophie", chauffeur: "Alice Martin", commentaire: "Conduite dangereuse", note: 2 }
    ];

    const problemes = [
        { id: 1, chauffeur: "Jean Dupont", passager: "Luc", probleme: "Retard important" },
        { id: 2, chauffeur: "Alice Martin", passager: "Sophie", probleme: "Problème de sécurité" }
    ];

    // Remplir le tableau des trajets
    const trajetsTable = document.getElementById("trajets-table-body");
    trajets.forEach(trajet => {
        const row = `<tr>
            <td>${trajet.id}</td>
            <td>${trajet.chauffeur}</td>
            <td>${trajet.depart}</td>
            <td>${trajet.arrivee}</td>
            <td>${trajet.date}</td>
            <td>${trajet.participants}</td>
        </tr>`;
        trajetsTable.innerHTML += row;
    });

    // Remplir la liste des avis
    const avisList = document.getElementById("avis-list");
    avis.forEach(a => {
        const item = `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${a.passager} → ${a.chauffeur} : "${a.commentaire}" (${a.note}/5)
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="validerAvis(${a.id})">✔</button>
                <button class="btn btn-danger btn-sm" onclick="refuserAvis(${a.id})">✖</button>
            </div>
        </li>`;
        avisList.innerHTML += item;
    });

    // Remplir le tableau des trajets problématiques
    const problemesTable = document.getElementById("problemes-table-body");
    problemes.forEach(p => {
        const row = `<tr>
            <td>${p.id}</td>
            <td>${p.chauffeur}</td>
            <td>${p.passager}</td>
            <td>${p.probleme}</td>
            <td><button class="btn btn-primary btn-sm">Consulter</button></td>
        </tr>`;
        problemesTable.innerHTML += row;
    });
});

function validerAvis(id) {
    alert(`Avis ${id} validé ✅`);
}

function refuserAvis(id) {
    alert(`Avis ${id} refusé ❌`);
}