# Owlbear Rodeo Container Notes

A small Owlbear Rodeo extension that lets a GM mark a token as a **container** and attach loot text to it.

## What it does

- Adds a **context menu action** for GMs to mark selected tokens as containers
- Stores loot text directly on the token's **metadata**
- Shows an **action popover** where the selected container's contents can be viewed
- Lets the **GM edit** the contents in a simple textarea
- Players can still open the panel and **read** container contents, but they cannot edit them

## How it works

The Owlbear Rodeo docs recommend:

- using a `manifest.json` entry point for extension loading,
- using item `metadata` to store extension data on scene items,
- using `OBR.contextMenu.create(...)` to add context menu buttons,
- using `OBR.scene.items.updateItems(...)` to mutate selected items, and
- checking the current player role via `OBR.player.getRole()` / `OBR.player.onChange(...)`.

## Local development

```bash
npm install
npm run dev
```

Then load this manifest in Owlbear Rodeo:

```text
http://localhost:5173/manifest.json
```

## Production build

```bash
npm run build
```

Then host the generated `dist` folder and add the hosted `manifest.json` URL to Owlbear Rodeo.

## Suggested usage flow

1. Select a token on the **Character** layer.
2. Right-click it and choose **Mark as container**.
3. Click the **Container Notes** action in the top-left.
4. Edit the loot text in the textarea.

## Metadata keys used

- `com.openai.container-notes/is-container`
- `com.openai.container-notes/loot-text`
