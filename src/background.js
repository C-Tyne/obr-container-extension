import OBR from '@owlbear-rodeo/sdk';
import { EXTENSION_ID, CONTAINER_KEY, LOOT_KEY } from './constants.js';

const CONTEXT_MENU_ID = `${EXTENSION_ID}/toggle-container`;

function isContainer(item) {
  return item?.metadata?.[CONTAINER_KEY] === true;
}

OBR.onReady(async () => {
  await OBR.contextMenu.create({
    id: CONTEXT_MENU_ID,
    icons: [
      {
        icon: '/icon.svg',
        label: 'Toggle container',
      },
    ],
    async onClick(context) {
      const role = await OBR.player.getRole();

      if (role !== 'GM') {
        await OBR.notification.show('Only the GM can change container status.');
        return;
      }

      if (!context.items.length) {
        await OBR.notification.show('Select at least one token first.');
        return;
      }

      const shouldEnable = context.items.some((item) => !isContainer(item));

      await OBR.scene.items.updateItems(context.items, (items) => {
        for (const item of items) {
          item.metadata[CONTAINER_KEY] = shouldEnable;

          if (shouldEnable && typeof item.metadata[LOOT_KEY] !== 'string') {
            item.metadata[LOOT_KEY] = '';
          }

          if (!shouldEnable) {
            delete item.metadata[LOOT_KEY];
          }
        }
      });

      await OBR.notification.show(
        shouldEnable
          ? 'Marked selected token(s) as containers.'
          : 'Removed container flag from selected token(s).'
      );
    },
  });
});
