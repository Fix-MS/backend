# Fix-MS Backend

This is the backend part of our [Münsterhack](https://muensterhack.de/) 2022 project "Fix-MS", which aims to provide nicer UI for the _flaw report form_ ([Mängelmeldung-Formular](https://www.stadt-muenster.de/maengelmeldung)) provided by the city of Münster. Essentially this part of the solution is going to accept user input from other parts (apps etc.) and forward the submitted issues to the city administration.


## API docs

In- and outputs are always JSON. Status codes are 200 for OK, 400 for invalid JSON, 404 for not found, 415 for wrong mediatype.

`GET /api` -- general API information

`GET /api/reports` -- list all submitted reports

`POST /api/reports` -- add new report. Required fields: `type` (integer, see list below), `location` (either string with street and house number, or object with keys `lat` and `lon` indicating coordinates in WSG84/EPSG:4326), `firstname`, `lastname`, and one of `email` and/or `phone` (all strings). Optional: `remark` (string up to 2000 characters), `final` (boolean indicating whether the report can be submitted to the city administration server straight away, or is preliminary and still needs confirmation; defaults to false). Not yet supported: `file`. Returns JSON with field `id` indicating the identifier of the newly added resource (integer).

`GET /api/reports/<id>` -- retrieve details of the specified report.

`PUT /api/reports/<id>` -- change the specified report, any field you like, but especially to change `final` from `false` to `true` to trigger report submission. The payload must adhere to the same requirements as during creation of the resource via POST (see above).


## Flaw type list

As extracted from the original Stadt Münster form:

- Ampel, Verkehrszeichen
    - Ampel komplett ausgefallen (73)
    - einzelnes Signal am Mast ausgefallen (74)
    - einzelnes Signal über der Fahrbahn ausgefallen (78)
    - überflüssiges Verkehrsschild (79)
    - Ampel durch Pflanze verdeckt (103)
    - Verkehrsschild verdeckt / beschädigt / entwendet (112)
- Beleuchtung
    - Leuchte an Straße, Geh- oder Radweg defekt (75)
    - Leuchtenmast beschädigt (76)
    - Leuchtenglas/-wanne beschädigt (77)
- Bushaltestelle
    - Glasbruch Wartehalle (120)
    - Glasbruch Vitrine (121)
    - Deckenbeleuchtung defekt (122)
    - Vitrinenbeleuchtung defekt (123)
    - Bank verschmutzt (124)
    - Graffiti (125)
    - Wartehalle verschmutzt (126)
    - Fahrplan fehlt (127)
- Geh-/Radweg, Radverkehr
    - lose Gehwegplatten/Pflastersteine (80)
    - Behinderung durch Pflanzen (81)
    - starke Verschmutzung/Scherben (83)
    - "Schrottfahrrad" (84)
    - Behinderung durch Sperrpfosten/Umlaufsperren (85)
    - Sperrpfosten/ Umlaufsperre fehlt (86)
    - Fahrradbox: Tür defekt (118)
    - Fahrradbox vermüllt (119)
    - Pfosten schief, verdreht, umgefallen (135)
- Radwegweisung
    - Radwegweiser fehlt, Befestigung defekt (136)
    - Radwegweiser unkenntlich (verdreckt, beschmiert, verklebt, verblasst, zugewachsen) (137)
- Grünanlage, Spielplatz
    - Spielgerät beschädigt (87)
    - Bank beschädigt (88)
    - Pflanzung/Bäume beschädigt (89)
    - starke Verschmutzung/Scherben (90)
    - "wilde" Müllablagerung (91)
- Eichenprozessionsspinner
    - Eichenprozessionsspinner an öffentlichen Kindergärten / öffentlichen Schulen (128)
    - Eichenprozessionsspinner an öffentlichen Spielplätzen, Sport-/Freizeitanlagen (129)
    - Eichenprozessionsspinner an Krankenhäusern / anderen öffentlichen Einrichtungen (130)
    - Eichenprozessionsspinner an Bushaltestellen (131)
    - Eichenprozessionsspinner an Bäumen zwischen der Bebauung (132)
    - Eichenprozessionsspinner an Straßenbäumen (133)
    - Eichenprozessionsspinner an Bäumen an städtischen Waldwegen (134)
- Straße
    - Schlagloch (92)
    - Behinderung durch Pflanzen (93)
    - stark verschmutzte Fahrbahn (94)
    - Überflutung, Straßenablauf verstopft (95)
    - Unebenheiten durch Kanaldeckel (104)
    - stark schadhafte Fahrbahnmarkierung (105)
- Brücken
    - Schaden am Brückenbelag (113)
    - Schaden am Brückengeländer (114)
    - Graffitis (115)
    - Brückenabläufe verstopft (116)
    - lose Teile (Steine, Abdeckungen) (117)
- Gewässer
    - Abflusshindernis/Rückstau (96)
    - Müll, "Schrottfahrrad" (97)
    - Nagetierbefall (98)
- Kanalisation
    - Kanaldeckel fehlt / defekt (99)
    - Rattenbefall (100)
    - Verstopfung/Rückstau (101)
    - Geruchsbelästigung (102)
