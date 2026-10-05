# Projektisuunnitelma — harjoittelutracker

> Projekti toteutetaan työtehtävänä: **tilaaja / työnantaja on Lauri Ahmas (Taitotalo)**, toteuttaja on Tony Weckström. Dokumentit on kirjoitettu tilaajalle luettaviksi.

## Projektin perustiedot

| Kenttä | Sisältö |
|---|---|
| Projekti | Harjoittelutracker |
| Tilaaja (työnantaja) | Lauri Ahmas, Taitotalo |
| Toteuttaja | Tony Weckström |
| Toimitus | Julkinen GitHub-repo (koodi, README, UML, aikataulu, testaussuunnitelma, testiraportti), linkki tilaajalle sähköpostitse tai Teamsissa |
| Työajan seuranta | Projektin työaikakirjaus (Excel) |

## Tausta ja tavoite

Työkalu harjoittelupaikkahakemusten seurantaan: mihin yrityksiin on haettu, missä vaiheessa hakuprosessi on ja mitä muistiinpanoja kustakin on. Tavoitteena on korvata hajallaan olevat muistiinpanot yhdellä selkeällä listalla.

## Tekniikat

- Node.js + Express (backend, REST-rajapinta)
- SQLite (`node:sqlite`, Noden sisäänrakennettu tietokanta)
- HTML / CSS / JavaScript (frontend, `public/`-kansio)

Perustelu: kevyt, ei ulkoisia palveluita eikä lisenssikuluja, käynnistyy kahdella komennolla.

## Toiminnan kulku

```
Selain (public/)
   ↓  fetch()
Express-palvelin (index.js, portti 3000)
   ↓  SQL (valmisteltu kysely)
SQLite-tietokanta (tracker.db, taulu: yritykset)
```

## Vaatimukset (user storyt)

| Käyttäjänä haluan... | Toteutus |
|---|---|
| nähdä kaikki hakemani yritykset | `GET /yritykset` |
| lisätä uuden yrityksen | `POST /yritykset` |
| päivittää yrityksen tilan ja muistiinpanot | `PUT /yritykset/:id` |
| poistaa yrityksen listalta | `DELETE /yritykset/:id` |

## Rajaukset

- Yksi käyttäjä, ei kirjautumista.
- Ei ulkoisia palveluita: data tallennetaan paikalliseen SQLite-tiedostoon.

## Hyväksymiskriteerit (tilaajan näkökulmasta)

- Yrityksen voi lisätä, hakea, päivittää ja poistaa.
- Tiedot säilyvät palvelimen uudelleenkäynnistyksen yli.
- Projektin voi käynnistää README:n ohjeilla (`npm install`, `node index.js`).
- Virhetilanteissa käyttäjä saa selkeän viestin (ei pinojälkeä) — täyttyy 5.10.2026 tehtyjen korjausten jälkeen (ks. testiraportti, ajo 2).
- Dokumentaatio (UML, aikataulu, testaussuunnitelma, testiraportti) on repossa.

## Riskit

| Riski | Vaikutus | Hallinta |
|---|---|---|
| Syötteen tarkistus puuttui | Virheelliset tai puuttuvat tiedot kaatoivat pyynnön | Validointi lisätty 5.10.2026 |
| Aikataulu venyy | Palautus myöhästyy | Korjaukset priorisoidaan vakavuuden mukaan |
| Tietokantatiedosto katoaa | Data menetetään | `tracker.db` pidetään pois versionhallinnasta, varmuuskopio käsin |
