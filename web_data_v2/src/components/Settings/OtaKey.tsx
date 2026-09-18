import { AccordionHead } from "../AccordionHead";

export function OtaKeySettings() {
  return (
    <div class="acc-row" data-help="ota-key">
      <AccordionHead
        title="OTA Key"
        titleI18n="settings.row.ota-key"
        helpLabel="Help for ota-key"
        helpKey="ota-key"
      >
        <div style="display:flex;gap:6px;align-items:center;">
          <input
            type="text"
            id="ota-key-display"
            class="s-input key-display"
            readOnly
            style="flex:1;font-size:11px;"
          />
          <button class="s-btn" id="ota-key-edit">
            Edit
          </button>
        </div>
      </AccordionHead>
    </div>
  );
}
