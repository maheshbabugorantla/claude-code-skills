# Layout rules

The validator enforces most of this. These rules get the first draft close, so the validator has little to say.

## Reading direction

The eye follows links. Lay the main flow along `gx` (down-right on screen) at one `gy`. Put what a step consults (a store, a cache, a rule) off to the side along `gy`, on the same `gx` as the entity that consults it.

```
gy 0     [store]            [target A]
gy 2.6   [client] -> [service] -> [target B]
gy 5.2          [cache]     [target C]
         gx 0     gx 2.9    gx 6.6
```

## Spacing

- Keep neighbours **2.4 to 2.8 cells** apart, centre to centre. Under 2 and captions collide; over 3.2 and the board empties out and labels shrink.
- A body hides the floor just behind it, and a link that arrives from behind stops where it meets the body's outline. So give a link 3 to 3.5 cells when it runs into an `l` node or a store from the back (from lower `gx` or `gy`). The validator tells you when too little of a link shows.
- Whole stage: about **8 by 6 cells** for a lesson. The validator warns past 840 by 600 units, where phone labels get small.
- At most 9 solids on the board in any step. More than that is two lessons.

## The diagonal trap

Two entities whose `gx - gy` is nearly equal stack vertically on screen: the nearer one hides the farther one's caption. Offset one of them by a cell along either axis, or set `"labelSide": "left"` or `"right"` on the farther one.

## Fan-out

One source to several targets in a column: give the outer links `"via": "xyx"`. They leave along a shared trunk, split on one bus line, and arrive straight. Move the bus with `"bend"` if it would pass under something.

```json
{ "id": "gw-pa", "from": "gw", "to": "pa", "via": "xyx" },
{ "id": "gw-pb", "from": "gw", "to": "pb" },
{ "id": "gw-pc", "from": "gw", "to": "pc", "via": "xyx" }
```

## Links

- A link that would run under a third entity: flip `via` between `x` and `y` first; move the entity second.
- One link per pair. Show a round trip with `"arrows": "both"` and a `reverse` packet.
- Use `cut`, `pulse` and `off` for what they mean (broken, periodic, inactive). Use `dashed` for optional or asynchronous paths.

## Notes and zones

- Pin a `note` where the board is empty, usually near the back corner `[0, 0]`. It floats above its point and never blocks a link.
- A `zone` goes around entities that share a boundary. Size its `span` to clear their footprints by half a cell.

## Colour

- Give one `hue` to one role across the whole lesson: all model providers violet, the thing being taught blue.
- Leave most entities `neutral`. Colour is how the reader finds the subject.
- `red` and `amber` read as trouble. Keep them for trouble, or set `state` instead.

## Focus

Spotlight two to four ids: the entities the step is about. On a phone the view moves to frame them, so a focus list that spans the whole board defeats it.
