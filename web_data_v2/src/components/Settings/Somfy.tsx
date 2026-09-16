import { AccordionHead } from "../AccordionHead";

export function SomfySettings() {
  return (
    <div class="acc-row" data-help="somfy">
      <AccordionHead
        title="Somfy / Overkiz"
        titleI18n="settings.row.somfy"
        helpLabel="Help for somfy"
      >
        <div>
          <label
            style="font-size:11px;color:var(--text3);"
            data-i18n="label.somfy-email"
          >
            Somfy account email
          </label>
          <input
            type="text"
            id="somfy-email"
            class="s-input"
            placeholder="your@somfy.com"
            style="margin-top:4px;"
            autocomplete="username"
          />
        </div>
        <div>
          <label
            style="font-size:11px;color:var(--text3);"
            data-i18n="label.somfy-password"
          >
            Somfy account password
          </label>
          <input
            type="password"
            id="somfy-password"
            class="s-input"
            placeholder="••••••••"
            style="margin-top:4px;"
            autocomplete="current-password"
          />
        </div>
        <div style="display:flex;gap:8px;">
          <button
            class="s-btn primary"
            id="somfy-save"
            data-i18n="button.save-credentials"
          >
            Save credentials
          </button>
          <button
            class="s-btn"
            id="somfy-import-btn"
            data-i18n="button.import-devices-btn"
          >
            Import devices
          </button>
        </div>
        <span
          id="somfy-status"
          style="font-size:11px;color:var(--text3);min-height:16px;"
        ></span>
      </AccordionHead>
    </div>
  );
}
