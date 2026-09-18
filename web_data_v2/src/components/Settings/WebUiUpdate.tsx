import { AccordionHead } from "../AccordionHead";

export function WebUIUpdateSettings() {
  return (
    <div class="acc-row">
      <AccordionHead
        title="Web UI Update"
        titleI18n="settings.row.web-update"
        summary={<span class="acc-sum-hint">Upload .bin file</span>}
      >
        <div>
          <label class={"label-title"} data-i18n="label.web-ui-file">
            Web UI file (.bin)
          </label>
          <input
            type="file"
            id="ota-web-file"
            accept=".bin"
            class="s-input"
            style="padding:5px 10px;margin-top:4px;"
          />
        </div>
        <button
          class="s-btn primary"
          id="ota-web-upload"
          data-i18n="button.upload-web-ui"
        >
          Upload Web UI
        </button>
        <progress
          id="ota-web-progress"
          max={100}
          value={0}
          style="display:none;"
        ></progress>
        <span id="ota-web-status" class="field-status"></span>
      </AccordionHead>
    </div>
  );
}
