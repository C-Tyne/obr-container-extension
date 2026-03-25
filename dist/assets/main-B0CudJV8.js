import{O as n}from"./index-DbBa3Ffs.js";const g="com.openai.container-notes",y=`${g}/is-container`,r=`${g}/loot-text`,v=document.getElementById("app");let l="PLAYER",a=null,f=null;function E(t){var e;return((e=t==null?void 0:t.metadata)==null?void 0:e[y])===!0}function C(t){var e;return typeof((e=t==null?void 0:t.metadata)==null?void 0:e[r])=="string"?t.metadata[r]:""}function s(t){v.innerHTML=`
    <div class="panel">
      <div>
        <h1>Container Notes</h1>
        <p class="muted">${t}</p>
      </div>
    </div>
  `}function I(t){var d;const e=l==="GM",h=C(t),x=((d=t.text)==null?void 0:d.plainText)||t.name||"Selected token";if(v.innerHTML=`
    <div class="panel">
      <div class="header">
        <div>
          <h1>Container Notes</h1>
          <p class="muted">${x}</p>
        </div>
        <span class="badge">Container</span>
      </div>

      <label class="label" for="loot-text">Loot contents</label>
      <textarea
        id="loot-text"
        class="textarea"
        placeholder="Add loot details, item descriptions, coin amounts, clues, or trap notes..."
        ${e?"":"readonly"}
      >${k(h)}</textarea>

      <div class="footer">
        <span id="status" class="muted">${e?"Changes save automatically.":"Read-only for players."}</span>
      </div>
    </div>
  `,!e)return;const c=document.getElementById("loot-text"),o=document.getElementById("status");c.addEventListener("input",()=>{const T=c.value;o.textContent="Saving...",window.clearTimeout(f),f=window.setTimeout(async()=>{if(a)try{const p=(await n.scene.items.getItems([a]))[0];if(!p){o.textContent="Selected token no longer exists";return}await n.scene.items.updateItems([p],w=>{for(const m of w)m.metadata[r]=T,m.metadata[y]=!0}),o.textContent="Saved"}catch(u){console.error(u),o.textContent="Failed to save"}},250)})}function k(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}async function i(){const t=await n.player.getSelection();if(!t||t.length===0){a=null,s("Select a token to view its container notes.");return}if(t.length>1){a=null,s("Select a single token to inspect or edit its container notes.");return}a=t[0];const[e]=await n.scene.items.getItems([a]);if(!e){s("The selected token could not be found.");return}if(!E(e)){s(l==="GM"?"This token is not a container yet. Right-click it and choose “Toggle container”.":"This token is not marked as a container.");return}I(e)}n.onReady(async()=>{l=await n.player.getRole(),await i(),n.player.onChange(async t=>{l=t.role,await i()}),n.scene.items.onChange(async()=>{await i()})});
