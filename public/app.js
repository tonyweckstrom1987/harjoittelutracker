let muokattavaId = null;
let kaikkiYritykset = [];

function haeYritykset() {
    fetch('/yritykset')
        .then(response => response.json())
        .then(yritykset => {
            kaikkiYritykset = yritykset;
            const lista = document.getElementById('lista');
            lista.innerHTML = '';

            yritykset.forEach(yritys => {
                lista.innerHTML += `
                    <div>
                        <strong>${yritys.nimi}</strong> — ${yritys.tila}<br>
                        ${yritys.yhteyshenkilo}<br>
                        ${yritys.muistiinpanot}<br>
                        ${yritys.hakupaiva}<br>
                        <button onclick="poistaYritys(${yritys.id})">Poista</button>
                        <button onclick="muokkaaYritys(${yritys.id})">Muokkaa</button>
                    </div>
                    <hr>
                `;
            });
        });
}

haeYritykset();

document.getElementById('lomake').addEventListener('submit', (event) => {
    event.preventDefault();

    const yritysData = {
        nimi: document.getElementById('nimi').value,
        tila: document.getElementById('tila').value,
        yhteyshenkilo: document.getElementById('yhteyshenkilo').value,
        muistiinpanot: document.getElementById('muistiinpanot').value,
        hakupaiva: document.getElementById('hakupaiva').value
    };

    const osoite = muokattavaId ? `/yritykset/${muokattavaId}` : '/yritykset';
    const metodi = muokattavaId ? 'PUT' : 'POST';

    fetch(osoite, {
        method: metodi,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yritysData)
    })
        .then(() => {
            haeYritykset();
            event.target.reset();
            muokattavaId = null;
        });
});

function poistaYritys(id) {
    fetch(`/yritykset/${id}`, { method: 'DELETE' })
        .then(() => haeYritykset());
}

function muokkaaYritys(id) {
    const yritys = kaikkiYritykset.find(y => y.id === id);

    document.getElementById('nimi').value = yritys.nimi;
    document.getElementById('tila').value = yritys.tila;
    document.getElementById('yhteyshenkilo').value = yritys.yhteyshenkilo;
    document.getElementById('muistiinpanot').value = yritys.muistiinpanot;
    document.getElementById('hakupaiva').value = yritys.hakupaiva;

    muokattavaId = id;
}