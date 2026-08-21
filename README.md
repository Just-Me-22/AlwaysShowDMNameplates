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


## License

GPL-3.0-or-later
