# harjoittelutracker

Työkalu omien työssäoppimispaikkahakemusten seurantaan — mitä yrityksiä olen hakenut, missä vaiheessa hakuprosessi on, ja muistiinpanot kustakin. Rakennettu koska tarvitsin itse tavan pitää kirjaa hauista ensi vuoden työssäoppimispaikkaa varten.

## Käytetyt tekniikat

- Node.js + Express (backend, REST-rajapinta)
- SQLite (`node:sqlite`, sisäänrakennettu tietokanta — ei ulkoisia riippuvuuksia)
- HTML/CSS/JavaScript (frontend)

## Käyttö

1. Kloonaa repo
2. Aja `npm install` (asentaa Expressin)
3. Aja `node index.js`
4. Avaa selaimessa `localhost:3000`

## Miksi oma backend

Data tallennetaan omaan SQLite-tietokantaan valmiin pilvipalvelun (esim. Firebase) sijaan tarkoituksella — tavoitteena oli oppia rakentamaan REST-rajapinta ja tietokantayhteys itse alusta asti, ei vain käyttää valmista ratkaisua.