# Testiraportti — harjoittelutracker

> Tilaaja (työnantaja): Lauri Ahmas, Taitotalo · Toteuttaja: Tony Weckström

## Yhteenveto

| Kenttä | Sisältö |
|---|---|
| Testauksen kohde | REST-reitit `/yritykset` (GET, POST, PUT, DELETE) ja tietokannan toiminta |
| Testauspäivä | 5.10.2026 |
| Ympäristö | Node.js v22.22.0, Express, `node:sqlite`, uusi tyhjä `tracker.db`; testit ajettu `curl`-kutsuilla. Koodi: `index.js` GitHubin `main`-haarasta. Testit ajoi Claude (tekoäly) Tonyn pyynnöstä erillisessä ympäristössä. |
| Suoritetut testit | 10 / 11 testitapausta (TC-UI-01 ei vielä suoritettu) |
| Tulokset | **Pass: 7 · Fail: 3** |
| Havaitut ongelmat | Ks. alla (3 virhettä + 1 lisähavainto) |
| Johtopäätös tilaajalle | Perustoiminnot (lisäys, haku, päivitys, poisto, tallennus) toimivat. Syötteen tarkistus ja virheenkäsittely puuttuvat, joten ohjelma ei vielä täytä hyväksymiskriteeriä "selkeät virheilmoitukset". Suositus: korjaukset (ongelmat 1–3) tehdään ennen toimitusta ja testit ajetaan uudelleen. |

## Tulokset

| ID | Toteutunut tulos | Status |
|---|---|---|
| TC-GET-01 | Palautti listan JSON-muodossa, HTTP 200 | Pass |
| TC-GET-02 | Tyhjällä taululla palautti `[]`, HTTP 200 | Pass |
| TC-POST-01 | Yritys lisättiin, HTTP 201, viesti "Yritys lisätty", näkyy listassa | Pass |
| TC-POST-02 | Tyhjällä nimellä (`""`) yritys **lisättiin** (HTTP 201). Jos kenttiä puuttuu kokonaan tai nimi on `null`, palvelin palauttaa HTTP 500 ja näyttää virheen pinojäljen | **Fail** |
| TC-POST-03 | 5000 merkin muistiinpano tallentui kokonaisena, HTTP 201 | Pass |
| TC-PUT-01 | Tila päivittyi (`Haettu` → `Haastattelu`), viesti "Yritys päivitetty" | Pass |
| TC-PUT-02 | Olemattomalla id:llä (99999) palautui HTTP 200 ja "Yritys päivitetty", vaikka mitään ei päivitetty | **Fail** |
| TC-DEL-01 | Yritys poistui listasta, viesti "Yritys poistettu" | Pass |
| TC-DEL-02 | Olemattomalla id:llä (99999) palautui HTTP 200 ja "Yritys poistettu", vaikka mitään ei poistettu | **Fail** |
| TC-DB-01 | Palvelimen uudelleenkäynnistyksen jälkeen kaikki tiedot olivat tallessa | Pass |
| TC-UI-01 | Ei suoritettu (käyttöliittymää ei testattu) | — |

## Havaitut ongelmat

| # | Ongelma | Vakavuus | Prioriteetti | Korjausehdotus |
|---|---|---|---|---|
| 1 | Pakollisen kentän `nimi` tarkistus puuttuu: tyhjä merkkijono hyväksytään, puuttuva arvo aiheuttaa HTTP 500 | Keskitaso | P2 | Tarkista syöte reitin alussa, palauta HTTP 400 ja selkeä viesti |
| 2 | Pinojälki (tiedostopolut, koodirivit) näkyy käyttäjälle virhetilanteessa | Keskitaso | P2 | Lisää virheenkäsittely (`try/catch`) ja palauta yleinen virheviesti |
| 3 | `PUT` ja `DELETE` kertovat onnistuneensa myös olemattomalla id:llä | Matala | P3 | Tarkista muuttuneiden rivien määrä; palauta HTTP 404 jos 0 |
| 4 | Lisähavainto: kaikki viisi kenttää vaaditaan `POST`-pyynnössä, vaikka vain `nimi` on pakollinen tietokannassa (undefined-arvo kaataa kyselyn) | Matala | P3 | Anna puuttuville kentille oletusarvo (esim. `null`) |

## Lisätestit (suunnitelman ulkopuolella)

| Testi | Tulos |
|---|---|
| SQL-injektioyritys nimikentässä (`x'); DROP TABLE yritykset;--`) | Pass — teksti tallentui sellaisenaan, taulu säilyi (valmistellut kyselyt suojaavat) |
| Virheellinen JSON (`{bad`) | Pass — HTTP 400 |

## Riskit

- Käyttäjä voi tallentaa tyhjän nimen, jolloin lista sisältää tunnistamattomia rivejä.
- Virheilmoitukset paljastavat palvelimen sisäistä rakennetta, jos sovellus joskus julkaistaan verkkoon.
- Käyttöliittymää ei ole testattu, joten lomakkeen toiminta on varmistamatta.

## Seuraavat toimet

1. Suorita TC-UI-01 selaimessa.
2. Korjaa ongelmat 1–3 (vaihe 6 aikataulussa) ja aja kaikki testit uudelleen (regressiotestaus).
