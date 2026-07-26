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

app.post('/yritykset', (req, res) => {
    const { nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva } = req.body;

    const lisaaYritys = db.prepare(
        'INSERT INTO yritykset (nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva) VALUES (?, ?, ?, ?, ?)'
    );
    lisaaYritys.run(nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva);

    res.status(201).json({ viesti: 'Yritys lisätty' });
});

app.delete('/yritykset/:id', (req, res) => {
    const poistaYritys = db.prepare('DELETE FROM yritykset WHERE id = ?');
    poistaYritys.run(req.params.id);

    res.json({ viesti: 'Yritys poistettu' });
});

app.put('/yritykset/:id', (req, res) => {
    const { nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva } = req.body;

    const paivitaYritys = db.prepare(
        'UPDATE yritykset SET nimi = ?, tila = ?, yhteyshenkilo = ?, muistiinpanot = ?, hakupaiva = ? WHERE id = ?'
    );
    paivitaYritys.run(nimi, tila, yhteyshenkilo, muistiinpanot, hakupaiva, req.params.id);

    res.json({ viesti: 'Yritys päivitetty' });
});

app.listen(3000, () => {
    console.log('Palvelin käynnissä portissa 3000');
});