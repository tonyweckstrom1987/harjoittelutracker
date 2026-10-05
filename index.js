const express = require('express');
const app = express();
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('tracker.db');
app.use(express.json());
app.use(express.static('public'));

db.exec(`
    CREATE TABLE IF NOT EXISTS yritykset (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nimi TEXT NOT NULL,
        tila TEXT,
        yhteyshenkilo TEXT,
        muistiinpanot TEXT,
        hakupaiva TEXT
    )
`);

app.get('/', (req, res) => {
    res.send('Palvelin toimii!');
});

app.get('/yritykset', (req, res) => {
    const haeKaikki = db.prepare('SELECT * FROM yritykset');
    const yritykset = haeKaikki.all();
    res.json(yritykset);
});

function nimiOnValidi(nimi) {
    return typeof nimi === 'string' && nimi.trim() !== '';
}

app.post('/yritykset', (req, res) => {
    const { nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva } = req.body;

    if (!nimiOnValidi(nimi)) {
        return res.status(400).json({ virhe: 'Nimi on pakollinen' });
    }

    const lisaaYritys = db.prepare(
        'INSERT INTO yritykset (nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva) VALUES (?, ?, ?, ?, ?)'
    );
    lisaaYritys.run(nimi, tila ?? null, yhteyshenkilo ?? null, muistiinpanot ?? null, hakupaiva ?? null);

    res.status(201).json({ viesti: 'Yritys lisätty' });
});

app.delete('/yritykset/:id', (req, res) => {
    const poistaYritys = db.prepare('DELETE FROM yritykset WHERE id = ?');
    const tulos = poistaYritys.run(req.params.id);

    if (tulos.changes === 0) {
        return res.status(404).json({ virhe: 'Yritystä ei löytynyt' });
    }

    res.json({ viesti: 'Yritys poistettu' });
});

app.put('/yritykset/:id', (req, res) => {
    const { nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva } = req.body;

    if (!nimiOnValidi(nimi)) {
        return res.status(400).json({ virhe: 'Nimi on pakollinen' });
    }

    const paivitaYritys = db.prepare(
        'UPDATE yritykset SET nimi = ?, tila = ?, yhteyshenkilo = ?, muistiinpanot = ?, hakupaiva = ? WHERE id = ?'
    );
    const tulos = paivitaYritys.run(nimi, tila ?? null, yhteyshenkilo ?? null, muistiinpanot ?? null, hakupaiva ?? null, req.params.id);

    if (tulos.changes === 0) {
        return res.status(404).json({ virhe: 'Yritystä ei löytynyt' });
    }

    res.json({ viesti: 'Yritys päivitetty' });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ virhe: 'Virheellinen JSON' });
    }
    console.error(err);
    res.status(500).json({ virhe: 'Palvelinvirhe' });
});

app.listen(3000, () => {
    console.log('Palvelin käynnissä portissa 3000');
});
