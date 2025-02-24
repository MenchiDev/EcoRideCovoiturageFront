
const annonceBtn = document.getElementById("btnAnnonce");
annonceBtn.addEventListener("click", accesse);


document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('FormId');
    const filterForm = document.querySelector('#filterModal form');
    const searchResults = document.getElementById('result');

    searchResults.style.display = 'none'; // Masquer les résultats au chargement

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const departure = searchForm.querySelector('input[placeholder="Départ"]').value;
        const destination = searchForm.querySelector('input[placeholder="Destination"]').value;
        const date = document.getElementById('date-input').value;

        filterResults(departure, destination, date);

        searchResults.style.display = 'flex'; // Afficher les résultats après la recherche
    });

    filterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const maxPrice = filterForm.querySelector('input[placeholder="Ex : 50"]').value;
        const maxHours = filterForm.querySelector('input[placeholder="Heures"]').value;
        const maxMinutes = filterForm.querySelector('input[placeholder="Minutes"]').value;
        const minRating = filterForm.querySelector('input[placeholder="Ex : 4.5"]').value;
        const eco = filterForm.querySelector('#ecologique').checked;

        filterResults(null, null, null, maxPrice, maxHours, maxMinutes, minRating, eco);

        searchResults.style.display = 'flex'; // Afficher les résultats après le filtrage
    });

    function filterResults(departure, destination, date, maxPrice, maxHours, maxMinutes, minRating, eco) {
        const resultItems = searchResults.querySelectorAll('.col-md-6');

        resultItems.forEach(item => {
            const itemDeparture = item.querySelector('.fw-bold.fs-4 span').textContent.split(' → ')[0].trim();
            const itemDestination = item.querySelector('.fw-bold.fs-4 span').textContent.split(' → ')[1].trim();
            const itemDate = item.querySelector('p:nth-child(4)').textContent.split(' : ')[1];
            const itemTime = item.querySelector('p:nth-child(4)').textContent.split(' : ')[1].split(' ')[1];
            const itemDuration = item.querySelector('p:nth-child(6)').textContent.split(' : ')[1];
            const itemPrice = item.querySelector('p:nth-child(3)').textContent.split(' : ')[1].replace(' €', '');
            const itemRating = item.querySelector('small').textContent.replace('⭐ ', '');
            const itemEco = item.querySelector('p:nth-child(7)').textContent.includes('✅');

            let match = true;

            if (departure && !itemDeparture.toLowerCase().includes(departure.toLowerCase())) {
                match = false;
            }
            if (destination && !itemDestination.toLowerCase().includes(destination.toLowerCase())) {
                match = false;
            }
            if (date && itemDate !== date) {
                match = false;
            }
            if (maxPrice && parseFloat(itemPrice) > parseFloat(maxPrice)) {
                match = false;
            }
            if (minRating && parseFloat(itemRating) < parseFloat(minRating)) {
                match = false;
            }
            if (eco && !itemEco) {
                match = false;
            }

            if (match) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }

            if (match) {
                const duration = calculateDuration(itemTime, itemDuration);
                item.querySelector('p:nth-child(6)').textContent = `Durée : ${duration}`;
            }
        });
    }

    function calculateDuration(startTime, duration) {
        const [startHours, startMinutes] = startTime.split(':');
        const [durationHours, durationMinutes] = duration.split(':');

        let totalMinutes = parseInt(startHours) * 60 + parseInt(startMinutes) + parseInt(durationHours) * 60 + parseInt(durationMinutes);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
    }
});




 
   