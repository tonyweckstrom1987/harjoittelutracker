# Testiraportti — harjoittelutracker

> Tilaaja (työnantaja): Lauri Ahmas, Taitotalo · Toteuttaja: Tony Weckström

## Yhteenveto

| Kenttä | Sisältö |
|---|---|
| Testauksen kohde | REST-reitit `/yritykset` (GET, POST, PUT, DELETE) ja tietokannan toiminta |
| Testauspäivä | 5.10.2026 (ajo 1: ennen korjauksia, ajo 2: korjausten jälkeen) |
| Ympäristö | Node.js v22.22.0, Express, `node:sqlite`, uusi tyhjä `tracker.db`; testit ajettu `curl`-kutsuilla. Koodi: `index.js` GitHubin `main`-haarasta. Testit ajoi Claude (tekoäly) Tonyn pyynnöstä erillisessä ympäristössä. |
| Suoritetut testit | 11 / 11 testitapausta |
| Tulokset ajo 1 (ennen korjauksia) | **Pass: 7 · Fail: 3** |
| Tulokset ajo 2 (korjausten jälkeen) | **Pass: 11 · Fail: 0** (API-testit curlilla, TC-UI-01 selaimella, ks. ajo 3) |
| Havaitut ongelmat | Ks. alla (3 virhettä + 1 lisähavainto) |
| Johtopäätös tilaajalle | Ajossa 1 perustoiminnot toimivat, mutta syötteen tarkistus ja virheenkäsittely puuttuivat. Ne korjattiin samana päivänä (ks. ajo 2 alla), ja kaikki ajetut testit menevät nyt läpi. Käyttöliittymätesti (TC-UI-01) ajettiin myös ja meni läpi (ajo 3). |

## Tulokset, ajo 1 (ennen korjauksia)

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

## Havaitut ongelmat (ajo 1, korjattu — ks. ajo 2)

| # | Ongelma | Vakavuus | Prioriteetti | Korjausehdotus |
|---|---|---|---|---|
| 1 | Pakollisen kentän `nimi` tarkistus puuttuu: tyhjä merkkijono hyväksytään, puuttuva arvo aiheuttaa HTTP 500 | Keskitaso | P2 | Tarkista syöte reitin alussa, palauta HTTP 400 ja selkeä viesti |
| 2 | Pinojälki (tiedostopolut, koodirivit) näkyy käyttäjälle virhetilanteessa | Keskitaso | P2 | Lisää virheenkäsittely (`try/catch`) ja palauta yleinen virheviesti |
| 3 | `PUT` ja `DELETE` kertovat onnistuneensa myös olemattomalla id:llä | Matala | P3 | Tarkista muuttuneiden rivien määrä; palauta HTTP 404 jos 0 |
| 4 | Lisähavainto: kaikki viisi kenttää vaaditaan `POST`-pyynnössä, vaikka vain `nimi` on pakollinen tietokannassa (undefined-arvo kaataa kyselyn) | Matala | P3 | Anna puuttuville kentille oletusarvo (esim. `null`) |

## Korjaukset ja ajo 2

Ongelmat 1–4 korjattiin tiedostossa `index.js` (5.10.2026):

- `POST` ja `PUT` tarkistavat, että `nimi` on ei-tyhjä merkkijono. Muuten vastaus on HTTP 400 ja `{"virhe": "Nimi on pakollinen"}`.
- Puuttuville kentille (`tila`, `yhteyshenkilo`, `muistiinpanot`, `hakupaiva`) käytetään arvoa `null`, joten pelkällä nimellä lisäys onnistuu.
- `PUT` ja `DELETE` palauttavat HTTP 404 ja `{"virhe": "Yritystä ei löytynyt"}`, jos id:llä ei ole riviä.
- Yleinen virheenkäsittelijä palauttaa HTTP 500 ja viestin "Palvelinvirhe" ilman pinojälkeä; virheellinen JSON palauttaa HTTP 400.

Ajo 2 tehtiin samalla tavalla kuin ajo 1 (Node.js v22.22.0, `curl`, uusi tyhjä `tracker.db`, ajaja Claude).

| ID | Toteutunut tulos ajossa 2 | Status |
|---|---|---|
| TC-GET-01 | Lista JSON-muodossa, HTTP 200 | Pass |
| TC-GET-02 | `[]`, HTTP 200 | Pass |
| TC-POST-01 | HTTP 201, "Yritys lisätty" | Pass |
| TC-POST-02 | Tyhjä nimi, puuttuva nimi ja `null`: kaikki HTTP 400 "Nimi on pakollinen", riviä ei lisätty | Pass |
| TC-POST-03 | 5000 merkin muistiinpano tallentui kokonaisena, HTTP 201 | Pass |
| TC-PUT-01 | Tila päivittyi, HTTP 200 | Pass |
| TC-PUT-02 | Olematon id 99999: HTTP 404 "Yritystä ei löytynyt". Tyhjä nimi: HTTP 400 | Pass |
| TC-DEL-01 | Yritys poistui, HTTP 200 | Pass |
| TC-DEL-02 | Olematon id 99999: HTTP 404 "Yritystä ei löytynyt" | Pass |
| TC-DB-01 | Uudelleenkäynnistyksen jälkeen kaikki rivit tallessa | Pass |
| TC-UI-01 | Ajettu ajossa 3 | Pass |

Regressio: SQL-injektioyritys tallentui tekstinä ja taulu säilyi, virheellinen JSON palautti HTTP 400 (ei muutosta ajoon 1 verrattuna).

Huom: korjausten vaikutus `public/`-käyttöliittymään testattiin ajossa 3.

## Ajo 3: käyttöliittymä (TC-UI-01) ja XSS-korjaus

Ajettu 5.10.2026 automatisoidulla selaimella (Playwright, Chromium, ajaja Claude) paikallista palvelinta vasten, uusi tyhjä `tracker.db`. Koodi: GitHubin `main`, korjausten jälkeen.

| ID | Toteutunut tulos | Status |
|---|---|---|
| TC-UI-01 | Lomakkeen täyttö (nimi, tila, yhteyshenkilö, muistiinpano, päivä) ja lähetys: yritys ilmestyi listaan kaikkine kenttineen | Pass |
| Lisätesti: HTML nimessä | Nimeksi `<img src=x onerror=alert(1)>`: teksti näkyy sellaisenaan, ei `img`-elementtiä sivulla, ei dialogeja (`escapeHtml` toimii) | Pass |

## Lisätestit (suunnitelman ulkopuolella, ajo 1)

| Testi | Tulos |
|---|---|
| SQL-injektioyritys nimikentässä (`x'); DROP TABLE yritykset;--`) | Pass — teksti tallentui sellaisenaan, taulu säilyi (valmistellut kyselyt suojaavat) |
| Virheellinen JSON (`{bad`) | Pass — HTTP 400 |

## Jäljellä olevat riskit

- Testit on ajettu käsin curlilla; automaattisia testejä ei ole.
- XSS-riski (`innerHTML`) korjattiin `escapeHtml`-funktiolla ja varmistettiin ajossa 3.
- Käyttöliittymä ei näytä virheilmoituksia (esim. 400-vastaus tyhjästä nimestä ei näy käyttäjälle); lomakkeen `required`-kenttä estää tyhjän nimen selaimessa.

## Seuraavat toimet

1. Harkitse automaattisia testejä (esim. Playwright tai Node-testiajuri) jatkokehityksenä.
