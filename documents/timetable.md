# Aikataulu — harjoittelutracker

Tilaaja: Lauri Ahmas · Toteuttaja: Tony Weckström.
Tavoite: projekti on dokumentoitu, testattu ja julkinen GitHubissa tilaajalle toimitettavaksi.

Tilat: **Valmis** = tehty ennen lopputehtävää · **Suunniteltu** = tehdään tästä eteenpäin.
Suunniteltujen vaiheiden viikot ovat ehdotus; lopullinen deadline sovitaan tilaajan kanssa (ei vielä tiedossa).

| Vaihe | Sisältö | Tuotos | Tila |
|---|---|---|---|
| 1. Suunnittelu ja pohja | Idea, tekniikoiden valinta, repositoryn luonti | GitHub-repo, README | Valmis |
| 2. Backend ja tietokanta | Express-palvelin, SQLite-taulu `yritykset`, neljä reittiä | `index.js` | Valmis |
| 3. Frontend | Käyttöliittymä listan katseluun ja muokkaukseen | `public/` | Valmis |
| 4. Dokumentaatio (vk 41, 5.10.–11.10.) | UML-kaavio, aikataulu, testaussuunnitelma, README | `documents/`, README | Valmis (5.10.2026) |
| 5. Testaus (vk 41–42) | Testitapaukset ajetaan, tulokset raporttiin | `documents/testraport.md` | API-testit tehty 5.10.2026; käyttöliittymätesti (TC-UI-01) jäljellä |
| 6. Korjaukset (vk 42–43) | Syötteen tarkistus, 404 olemattomalle id:lle, selkeät virheilmoitukset | päivitetty `index.js` | Suunniteltu |
| 7. Regressiotestaus (vk 43) | Testit ajetaan uudelleen korjausten jälkeen | päivitetty testiraportti | Suunniteltu |
| 8. Toimitus | Repo julkiseksi tarkistettu, linkki tilaajalle | GitHub-linkki | Suunniteltu |

## Välitavoitteet (tilaajalle raportoitavat)

| Tavoite | Ajankohta (ehdotus) |
|---|---|
| Dokumentaatio valmis | vk 41 |
| Testiraportti ensimmäinen versio | vk 41 |
| Korjatut virheet ja uusi testiraportti | vk 43 |
| Toimitus tilaajalle | sovitaan |

## Työaikakirjaus

Työtunnit kirjataan projektin työaikakirjaukseen (Excel), jotta tilaaja näkee käytetyn ajan. Tähän mennessä käytettyjä tunteja ei ole vielä kirjattu.

## Testaus aikataulussa

Testausta ei jätetä vain loppuun: reitit testataan heti kun ne valmistuvat, ja koko järjestelmä ajetaan läpi uudelleen ennen toimitusta (regressiotestaus). Ks. `testplan.md`.
