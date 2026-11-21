# Scene spec, version 1

A scene is one JSON file. The engine reads nothing else. Unknown ids, kinds, hues, icons and tags are errors, so a typo fails loudly at `validate`.

```json
{
  "version": 1,
  "title": "How a prompt travels through an LLM gateway",
  "subtitle": "One request, followed hop by hop.",
  "theme": "daylight",
  "cast": [],
  "links": [],
  "steps": []
}
```

`steps` is optional. Without it the scene is a still and everything is on the board.

## The grid

Positions are `[gx, gy]` in cells. `gx` runs down and to the right on screen; `gy` runs down and to the left. `[0, 0]` is the back corner. Fractions are fine. Larger `gx + gy` is closer to the viewer and is drawn in front.

## cast

Every entity has `id`, `kind` and `at`. Ids are lowercase letters, digits and dashes, unique across cast and links.

| Field | Applies to | Values |
|---|---|---|
| `id` | all | `gw`, `user-db` |
| `kind` | all | `node` `store` `client` `actors` `queue` `zone` `note` `ring` |
| `at` | all | `[gx, gy]`: the centre of its footprint. For a `note`, the point its card floats above. |
| `label` | all but `note` | Up to 22 characters. Drawn under the entity. |
| `sub` | solids | A second, smaller caption line. |
| `labelSide` | solids | `below` (default), `left`, `right`. Use a side when a block in front would cover the caption. |
| `hue` | all but `note` | `neutral` `blue` `green` `amber` `red` `violet` `teal` |
| `state` | all | `ok` (default), `warn`, `down`, `ghost` |
| `badge` | solids | A short pill above the entity: `"429"` or `{ "text": "429", "tone": "bad" }`. Tones: `good` `warn` `bad` `info`. |
| `icon` | `node`, `store` | See the icon list below. |
| `size` | `node`, `store` | `s` `m` `l` |
| `shape` | `node` | `block` (default), `slab`, `tower` |
| `count` | `actors` | 1 to 9 |
| `slots`, `fill`, `axis` | `queue` | Capacity (2 to 10), how many are filled, and `x` or `y` |
| `span` | `zone` | `[cells along gx, cells along gy]`. Required. |
| `title`, `lines` | `note` | A bold title and up to six lines. A line starting `+ ` reads good, `- ` bad, `! ` warning. |
| `radius`, `marks`, `arcs` | `ring` | Radius in cells. `marks`: `{ "at": degrees, "label", "hue", "kind": "node" or "key" }`, with 0 at the back and angles running clockwise. `arcs`: `{ "from", "to", "hue" }`. |

Solids are `node`, `store`, `client`, `actors` and `queue`: the kinds that occupy floor, block links and are checked for spacing.

Icons: `server` `disk` `globe` `lock` `key` `bolt` `route` `shield` `gauge` `clock` `chip` `spark` `doc` `search` `filter` `code` `user` `cloud` `chart` `queue` `layers` `gear` `box` `mail` `check` `cross` `bank` `table` `eye` `coin`.

## links

| Field | Values |
|---|---|
| `id`, `from`, `to` | `from` and `to` are cast ids. |
| `via` | How the link runs along the lattice. `x`: along gx, then gy (default). `y`: along gy, then gx. `xyx` or `yxy`: two elbows through a shared bus line. `straight`: direct. Entities that share a row or column always get a straight run. |
| `bend` | For `xyx` and `yxy`: where the bus line sits between the two ends, from 0 to 1. Default 0.5. |
| `style` | `solid` (default), `dashed`, `pulse` (dotted: heartbeats, polling), `cut` (broken, in the error colour), `off` (greyed) |
| `arrows` | `end` (default), `both`, `none` |
| `label` | Up to 26 characters, on a pill at the midpoint. |

A link is on the board only while both of its ends are. You rarely need to `show` a link: it appears with its ends.

## steps

Each step is one beat of the lesson.

| Field | Persists? | Meaning |
|---|---|---|
| `title` | text | Required. The step's heading. |
| `tag` | text | `problem` `idea` `mechanism` `failure` `fix` `tradeoff` `recap` |
| `body` | text | Array of paragraphs. Under 80 words in total. `` `code` `` and `**bold**` are the only markup. |
| `idea` | text | One sentence set apart as the key idea. Optional. |
| `changes` | text | What this step changed, as lines starting `+ `, `~ `, `- ` or `! `. Optional. |
| `show` | **yes** | Ids that enter here. |
| `hide` | **yes** | Ids that leave here. |
| `set` | **yes** | Patches by id: `{ "db": { "state": "down", "badge": "timeout" } }`. May change any field except `id`, `kind`, `from`, `to`. Clear with `null`. |
| `gauges` | **yes** | Numbers the reader watches: `{ "p99": { "label": "p99 latency", "value": "820 ms", "tone": "warn" } }`. Later steps may send only what changed: `{ "p99": { "value": "95 ms", "tone": "good" } }`. `null` removes a gauge. |
| `focus` | no | Ids to spotlight. Everything else dims for this step. |
| `packets` | no | What travels: `{ "on": "app-gw", "kind": "request", "count": 2, "reverse": false, "label": "POST /chat" }`. Kinds: `request` `response` `event` `data` `error`. `reverse` runs from `to` back to `from`. |

### How entering works

An id that appears in any step's `show` is off the board until that step. Every other id is on the board from step 1. So step 1 needs no `show` list: leave out of all `show` lists whatever should be there at the start.

### Worked fragment

```json
{
  "title": "Provider B says slow down", "tag": "failure",
  "body": ["Provider B answers 429: too many requests."],
  "focus": ["gw", "pb"],
  "packets": [{ "on": "gw-pb", "kind": "error", "reverse": true }],
  "set": { "pb": { "state": "warn", "badge": { "text": "429", "tone": "bad" } }, "gw-pb": { "style": "cut" } }
}
```

The `set` here persists. Two steps later the scene restores it:

```json
"set": { "pb": { "state": "ok", "badge": null }, "gw-pb": { "style": "solid" } }
```

`explain` would have shown `pb(state=warn badge="429")` on every step in between.

## Themes

`"theme"` names a file in `themes/`. A theme is tokens only: colours, fonts, stroke width, corner rounding. To make your own, copy one, change values, and pass its path: `--theme ./brand.json`. The engine refuses a theme with a missing token and lists what is missing.
