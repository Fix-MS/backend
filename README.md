# Fix-MS Backend

This is the backend part of our [Münsterhack](https://muensterhack.de/) 2022 project "Fix-MS", which aims to provide nicer UI for the _flaw report form_ ([Mängelmeldung-Formular](https://www.stadt-muenster.de/maengelmeldung)) provided by the city of Münster. Essentially this part of the solution is going to accept user input from other parts (apps etc.) and forward the submitted issues to the city administration.


## API docs

In- and outputs are always JSON. Status codes are 200 for OK, 400 for invalid JSON, 404 for not found, 415 for wrong mediatype.

`GET /api` -- general API information

`GET /api/reports` -- list all submitted reports

`POST /api/reports` -- add new report. Required fields: `type` (integer), `location` (either string with street and house number, or object with keys `lat` and `lon` indicating coordinates in WSG84/EPSG:4326), `firstname`, `lastname`, and one of `email` and/or `phone` (all strings). Optional: `remark` (string up to 2000 characters). Not yet supported: `file`. Returns JSON with field `id` indicating the identifier of the newly added resource (integer).

`GET /api/reports/<id>` -- retrieve details of the specified report.

