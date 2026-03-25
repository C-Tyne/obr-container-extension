import OBR from '@owlbear-rodeo/sdk';
import { CONTAINER_KEY, LOOT_KEY } from './constants.js';

const app = document.getElementById('app');

let currentPlayerRole = 'PLAYER';
let selectedItemId = null;
let saveTimeout = null;

function isContainer(item) {
  return item?.metadata?.[CONTAINER_KEY] === true;
}

function getLootText(item) {
  return typeof item?.metadata?.[LOOT_KEY] === 'string' ? item.metadata[LOOT_KEY] : '';
}

function renderEmpty(message) {
  app.innerHTML = `
    <div class="panel">
      <div>
        <h1>Container Notes</h1>
        <p class="muted">${message}</p>
      </div>
    </div>
  `;
}

function renderEditor(item) {
  const canEdit = currentPlayerRole === 'GM';
  const lootText = getLootText(item);
  const itemName = item.text?.plainText || item.name || 'Selected token';

  app.innerHTML = `
    <div class="panel">
      <div class="header">
        <div>
          <h1>Container Notes</h1>
          <p class="muted">${itemName}</p>
        </div>
        <span class="badge">Container</span>
      </div>

      <label class="label" for="loot-text">Loot contents</label>
      <textarea
        id="loot-text"
        class="textarea"
        placeholder="Add loot details, item descriptions, coin amounts, clues, or trap notes..."
        ${canEdit ? '' : 'readonly'}
      >${escapeHtml(lootText)}</textarea>

      <div class="footer">
        <span id="status" class="muted">${canEdit ? 'Changes save automatically.' : 'Read-only for players.'}</span>
      </div>
    </div>
  `;

  if (!canEdit) return;

  const textarea = document.getElementById('loot-text');
  const status = document.getElementById('status');

  textarea.addEventListener('input', () => {
    const nextValue = textarea.value;
    status.textContent = 'Saving...';

    window.clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(async () => {
      if (!selectedItemId) return;

      try {
        const items = await OBR.scene.items.getItems([selectedItemId]);
        const item = items[0];

        if (!item) {
          status.textContent = 'Selected token no longer exists';
          return;
        }

        await OBR.scene.items.updateItems([item], (draftItems) => {
          for (const draftItem of draftItems) {
            draftItem.metadata[LOOT_KEY] = nextValue;
            draftItem.metadata[CONTAINER_KEY] = true;
          }
        });

        status.textContent = 'Saved';
      } catch (error) {
        console.error(error);
        status.textContent = 'Failed to save';
      }
    }, 250);
  });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function refresh() {
  const selection = await OBR.player.getSelection();

  if (!selection || selection.length === 0) {
    selectedItemId = null;
    renderEmpty('Select a token to view its container notes.');
    return;
  }

  if (selection.length > 1) {
    selectedItemId = null;
    renderEmpty('Select a single token to inspect or edit its container notes.');
    return;
  }

  selectedItemId = selection[0];
  const [item] = await OBR.scene.items.getItems([selectedItemId]);

  if (!item) {
    renderEmpty('The selected token could not be found.');
    return;
  }

  if (!isContainer(item)) {
    renderEmpty(
      currentPlayerRole === 'GM'
        ? 'This token is not a container yet. Right-click it and choose “Toggle container”.'
        : 'This token is not marked as a container.'
    );
    return;
  }

  renderEditor(item);
}

OBR.onReady(async () => {
  currentPlayerRole = await OBR.player.getRole();
  await refresh();

  OBR.player.onChange(async (player) => {
    currentPlayerRole = player.role;
    await refresh();
  });

  OBR.scene.items.onChange(async () => {
    await refresh();
  });
});
