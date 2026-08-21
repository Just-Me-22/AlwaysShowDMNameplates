# AlwaysShowDMNameplates

An [Equicord](https://github.com/Equicord/Equicord) userplugin that keeps
nameplates visible on every DM in your list, instead of only on the one you are
hovering.

Discord builds the nameplate for a DM row only while that row is hovered,
focused, or is the conversation you currently have open. Everything else in the
list sits plain. This drops that condition, so any row belonging to someone with
a nameplate shows it all the time.

Rows for people without a nameplate are untouched, because there is nothing to
show.

## Requirements

Equicord installed **from source**. Userplugins are compiled into the bundle, so
this will not work on the installer's prebuilt build. See
[Equicord's installation guide](https://github.com/Equicord/Equicord).

## Install

Clone into your Equicord checkout's userplugins folder:

```bash
cd Equicord/src/userplugins
git clone https://github.com/Just-Me-22/AlwaysShowDMNameplates alwaysShowDMNameplates
cd ../..
pnpm build
```

Restart or reload Discord (Ctrl+R), then enable **AlwaysShowDMNameplates** in
Equicord's plugin settings and reload once more. Patches are applied at startup,
so enabling alone does nothing until the next reload.

## How it works

The DM row component works out whether to show a plate in one expression:

```js
e3 = null != N && (a || G || e_)
```

`N` is the nameplate, `a` is whether the row is the open conversation, `G` is
hover and `e_` is keyboard focus. Anything that fails all three gets
`nameplate: undefined` passed down, and the nameplate component returns `null`,
so there is no element in the page at all. That is worth knowing if you came here
after trying to do this in CSS: there is nothing to select, which is why no
stylesheet can fix it.

The patch rewrites the line to `e3 = null != N` and stops there. That one
variable also drives the `nameplated` class on the row's icon container and the
close button's plate styling, so all three follow along without needing their own
patches.

The `find` is a regular expression rather than a string, because nothing stable
and unique enough sits nearby. It uses Vencord's `\i` wildcard for the minified
names, which is what lets it survive Discord renaming them between builds. It
matches one module, once.

## Plates stay still until you hover them

The nameplate component takes a `hovered` prop, and it would have been the
shorter way to do this. It is also the wrong one. That prop does not decide
whether the plate renders, only whether it animates:

```js
animate = isFocused && !reducedMotion && (hovered || selected)
```

Forcing it to `true` would set every plate in the list playing video at once, all
the time. Leaving it alone means the plates are all visible but static, and only
the row under your cursor animates, which is what Discord does today anyway. On a
long DM list that difference is the whole cost of the plugin.

One consequence worth knowing: a nameplate whose art has no video renders as an
`<img>`, not a `<video>`. If you go looking in the inspector, counting `video`
elements will under-report what is on screen.

## Spacing

With plates on every row, neighbouring plates end up touching. No CSS ships with
this plugin, but if you want a gap, this is the cheap way to write it:

```css
[class*="privateChannels_"] li[class*="dm_"] {
  margin-bottom: 4px;
}
```

It keys off the row's own class, so there is no `:has()` and no `:nth-child`
involved, both of which get expensive in a list Discord reorders every time a
message arrives. `dm_` also means the Friends, Nitro, Shop, Family Center and
Quests rows keep their normal spacing.

## License

GPL-3.0-or-later
