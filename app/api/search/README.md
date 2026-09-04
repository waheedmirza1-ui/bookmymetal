# Search API contract

`GET /api/search?q=<natural-language-query>&type=all|product|service`

The route currently provides a deterministic local catalog adapter so the React UI has a real API boundary. The next adapter can replace the catalog with MySQL full-text/search indexes and AI intent extraction without changing the frontend contract.

Planned inputs: text, speech transcript, image-analysis query.
Planned output: ranked products/services, seller, location, specs, media and actions.
