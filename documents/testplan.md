# Testaussuunnitelma — harjoittelutracker

> Tilaaja (työnantaja): Lauri Ahmas, Taitotalo · Toteuttaja: Tony Weckström

## 1. Johdanto

Harjoittelutracker on työssäoppimishakemusten seurantatyökalu (Node.js/Express + SQLite). Testauksen tavoite on varmistaa, että yritysten lisäys, haku, päivitys ja poisto toimivat ja että virhetilanteet eivät riko palvelinta.

## 2. Testauksen kohde

Testataan:
- REST-reitit `GET`, `POST`, `PUT`, `DELETE` osoitteessa `/yritykset`
- Tietojen tallentuminen SQLite-tietokantaan (`yritykset`-taulu)
- Käyttöliittymän perustoiminnot (`public/`)

## 3. Testaustavat

| Taso | Mitä | Miten |
|---|---|---|
| API-testaus | Reitit palauttavat oikean vastauksen ja tilakoodin | Käsin selaimella / Postmanilla / `fetch`-kutsuilla |
| Tietokantatestaus | Muutokset näkyvät tallennetussa datassa | Haku `GET /yritykset` muutoksen jälkeen |
| Frontend-testaus | Lomake ja lista toimivat | Käsin selaimessa |
| Regressiotestaus | Korjaukset eivät riko vanhaa | Kaikki testitapaukset ajetaan uudelleen ennen palautusta |

Testit ajetaan käsin; automaattisia testejä ei ole tässä vaiheessa (mahdollinen jatkokehitys).

## 4. Testauksen rajaukset (mitä ei testata)

- Suorituskyky ja kuormitus (yksi käyttäjä)
- Kirjautuminen ja käyttöoikeudet (ei toteutettu)
- Eri selainten välinen yhteensopivuus (testataan vain yhdellä selaimella)

## 5. Aikataulu

| Vaihe | Ajankohta |
|---|---|
| API- ja tietokantatestit | heti dokumentoinnin jälkeen (vk 41) |
| Frontend-testit | vk 41–42 |
| Korjausten jälkeinen regressiotestaus | vk 42–43, ennen palautusta |

## 6. Vastuut

Kehittäjä ja testaaja: Tony Weckström (yksittäinen opiskelijaprojekti).

## 7. Riskit

| Riski | Seuraus | Torjunta |
|---|---|---|
| Syötteen tarkistusta ei ole | Tyhjä tai virheellinen data voi päätyä tietokantaan tai aiheuttaa virheen | Testitapaukset negatiivisille syötteille, korjaus tarvittaessa |
| Tietokanta on yksi tiedosto (`tracker.db`) | Tiedoston poisto häviää kaiken datan | Varmuuskopio ennen testejä |
| Vain käsin testaus | Virheet voivat jäädä huomaamatta | Selkeät, toistettavat testitapaukset |

## 8. Testitapaukset

Tulokset: ks. `testraport.md`. (TC-UI-01 ei ole vielä suoritettu.)

| ID | Kuvaus | Tyyppi | Testivaiheet | Odotettu tulos |
|---|---|---|---|---|
| TC-GET-01 | Yritysten haku | Positiivinen | Lähetä `GET /yritykset` | Lista JSON-muodossa, tilakoodi 200 |
| TC-GET-02 | Haku kun tietokanta on tyhjä | Edge case | Tyhjennä taulu, lähetä `GET /yritykset` | Tyhjä lista `[]`, ei virhettä |
| TC-POST-01 | Yrityksen lisäys kaikilla kentillä | Positiivinen | Lähetä `POST /yritykset` kaikilla kentillä | Tilakoodi 201, viesti "Yritys lisätty", yritys näkyy listassa |
| TC-POST-02 | Yrityksen lisäys ilman nimeä | Negatiivinen | Lähetä `POST /yritykset` tyhjällä `nimi`-kentällä | Lisäystä ei tehdä, selkeä virheilmoitus |
| TC-POST-03 | Hyvin pitkä muistiinpano | Edge case | Lähetä `POST` 5000 merkin muistiinpanolla | Tallentuu kokonaisena, palvelin ei kaadu |
| TC-PUT-01 | Tilan päivitys | Positiivinen | Lähetä `PUT /yritykset/:id` uudella `tila`-arvolla | Viesti "Yritys päivitetty", muutos näkyy haussa |
| TC-PUT-02 | Päivitys olemattomalla id:llä | Negatiivinen | Lähetä `PUT /yritykset/99999` | Ei kaadu; ilmoitus ettei yritystä löydy |
| TC-DEL-01 | Yrityksen poisto | Positiivinen | Lähetä `DELETE /yritykset/:id` | Viesti "Yritys poistettu", yritys ei enää listassa |
| TC-DEL-02 | Poisto olemattomalla id:llä | Negatiivinen | Lähetä `DELETE /yritykset/99999` | Ei kaadu; ilmoitus ettei yritystä löydy |
| TC-DB-01 | Tietojen säilyminen | Positiivinen | Lisää yritys, käynnistä palvelin uudelleen, hae lista | Yritys on edelleen listassa |
| TC-UI-01 | Lisäys lomakkeella | Positiivinen | Täytä lomake käyttöliittymässä ja lähetä | Yritys ilmestyy listaan |
