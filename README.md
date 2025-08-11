# Harvester

Use CSS selectors to grab lists of stuff from various websites and list them altogether on a single
page.


## API

Accepts a `GET` request like this:

```
https://harvestor.particlesystem.com/api?url=https://example.com&itemSelector=.item
```

> [!NOTE]
> For readability the params in the example above have not been correctly encoded.

And returns a JSON response like this:

```json
{
  "items": [
    {
      "title": "Item 1",
      "link": "https://example.com/item1"
    },
    {
      "title": "Item 2",
      "link": "https://example.com/item2"
    }
  ],
  "debug": {
    "itemsFound": 2,
    "itemsAfterFilter": 2,
    "firstTitle": "Item 1",
    "firstLink": "https://example.com/item1"
  }
}
```

### Params

| Name | Description |
|------|-------------|
| `itemFilter` | A string an item's text content must contain to be included in the result. |
| `itemSelector` | **Required** A CSS selector used to identify the items on the page. |
| `linkSelector` | A CSS selector used to identify an `<a>` element within each item that has a href attribute to be used as a link. |
| `titleSelector` | A CSS selector used to identify an element containing the title of an item. If omitted, the title will be all the text content of the item. |
| `url` | **Required** A URL of a page to scrape. |
