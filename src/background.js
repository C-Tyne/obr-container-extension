import OBR from "@owlbear-rodeo/sdk";

const ID = "io.github.c-tyne.obr-container-extension";
const METADATA_KEY = `${ID}/container`;

OBR.onReady(() => {
  OBR.contextMenu.create({
    id: `${ID}/toggle-container`,
    icons: [
      {
        icon: "/obr-container-extension/icon.svg",
        label: "Toggle Container",
        filter: {
          min: 1,
          roles: ["GM"],
          permissions: ["UPDATE"],
        },
      },
    ],
    async onClick(context) {
      await OBR.scene.items.updateItems(context.items, (items) => {
        for (const item of items) {
          const current = item.metadata[METADATA_KEY];
          if (current) {
            delete item.metadata[METADATA_KEY];
          } else {
            item.metadata[METADATA_KEY] = {
              enabled: true,
              loot: "",
            };
          }
        }
      });
    },
  });
});