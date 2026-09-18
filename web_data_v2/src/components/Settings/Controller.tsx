import { AccordionHead } from "../AccordionHead";

export function ControllerSettings() {
  return (
    <div class="acc-row" data-help="controller">
      <AccordionHead
        title="Controller Identity"
        titleI18n="settings.row.controller"
        helpLabel="Help for controller"
        helpKey={"controller"}
      >
        <div style="display:flex;gap:6px;align-items:center;">
          <div style="flex:1;">
            <label
              class={"label-title"}
              data-i18n="label.node-address"
            >
              Node Address (3 bytes hex)
            </label>
            <input
              type="text"
              id="io-node-id"
              class="s-input"
              placeholder="A1B1C3"
              maxLength={6}
              style="font-family:var(--mono);text-transform:uppercase;margin-top:4px;"
            />
          </div>
          <div style="flex:1;">
            <label
              class={"label-title"}
              data-i18n="label.tx-power"
            >
              TX Power (0–20 dBm)
            </label>
            <input
              type="number"
              id="io-tx-power"
              class="s-input"
              min={0}
              max={20}
              placeholder="17"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span
            style="font-size:12px;color:var(--text2);"
            data-i18n="label.passive-mode"
          >
            Passive mode (listen only)
          </span>
          <div class="s-toggle" id="io-passive-toggle"></div>
          <input type="checkbox" id="io-passive-mode" style="display:none" />
        </div>
        <button
          class="s-btn primary"
          id="io-config-save"
          data-i18n="button.save-controller"
        >
          Save Controller Settings
        </button>
      </AccordionHead>
    </div>
  );
}
