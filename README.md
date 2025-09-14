# Harvester

Aggregate data scrapped from web pages.

## API

### Params

Required:

- `url` — A URL of a page to scrape.
- `itemSelector` — A CSS selector used to identify the items on the page.

Optional:

- `debug` — A boolean indicating whether to include debug information in the response.
- `exclude` — A comma-separated list of words an item's text content must contain to be excluded in
  the result.
- `include` — A comma-separated list of words an item's text content must contain to be included in
  the result.
- `linkSelector` — A CSS selector used to identify an `<a>` element within each item that has a href
  attribute to be used as a link. If the item itself is an `<a>` element, this param can be omitted.
- `titleSelector` — A CSS selector used to identify an element containing the title of an item. If
  omitted, the title will be all the text content of the item.

### Examples

> [!NOTE]
> For readability the params in the following examples have not been correctly encoded.

#### Basic

Request:

```
GET https://harvestor.particlesystem.com/source?url=https://example.com&itemSelector=.item
```

Response:

```json
{
  "fetchedAt": "2025-09-14T04:00:04Z",
  "items": [
    {
      "firstSeen": "2025-09-13T01:23:21Z",
      "title": "Item 1",
      "url": "https://example.com/item1"
    },
    {
      "firstSeen": "2025-09-12T03:34:08Z",
      "title": "Item 2",
      "url": "https://example.com/item2"
    }
  ],
  "ok": true
}
```

#### Debug Info

Request:

```
GET https://harvestor.particlesystem.com/source?url=https://example.com&itemSelector=.item&debug=true
```

> [!NOTE]
> For readability the params in the example above have not been correctly encoded.

Response:

```json
{
  "debug": {
    "htmlSamples": [
      "<div class=\"item\"><a href=\"https://example.com/item1\">Item 1</a></div>",
      "<div class=\"item\"><a href=\"https://example.com/item2\">Item 2</a></div>"
    ],
    "itemsMatched": 2,
    "itemsRemovedByExcludeFilter": 3,
    "itemsRemovedByIncludeFilter": 1
  },
  "fetchedAt": "2025-09-14T04:00:04Z",
  "items": [
    {
      "firstSeen": "2025-09-13T01:23:21Z",
      "title": "Item 1",
      "url": "https://example.com/item1"
    },
    {
      "firstSeen": "2025-09-12T03:34:08Z",
      "title": "Item 2",
      "url": "https://example.com/item2"
    }
  ],
  "ok": true
}
```
