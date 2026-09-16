import { AccordionHead } from "../AccordionHead";
import { JSX } from "preact";

export function WifiSettings(): JSX.Element {
  return (
    <div class="acc-row" data-help="wifi">
      <AccordionHead
        title="WiFi"
        titleI18n="settings.row.wifi"
        helpLabel="Help for wifi"
        summary={
          <>
            <span class="acc-sum-val" id="acc-wifi-val"></span>
            <span class="row-status" id="fallback-status"></span>
          </>
        }
      >
        <div style="display:flex;gap:6px;">
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.network-name-ssid"
            >
              Network name (SSID)
            </label>
            <div style="display:flex;gap:6px;margin-top:4px;">
              <input
                type="text"
                id="wifi-ssid"
                class="s-input"
                placeholder="Network name"
                maxLength={32}
                style="flex:1;"
              />
              <button class="s-btn" id="wifi-scan-btn" data-i18n="button.scan">
                Scan
              </button>
            </div>
          </div>
        </div>
        <div id="wifi-scan-results" style="display:none;"></div>
        <div>
          <label
            style="font-size:11px;color:var(--text3);"
            data-i18n="label.password"
          >
            Password
          </label>
          <input
            type="password"
            id="wifi-password"
            class="s-input"
            placeholder="Leave blank to keep current"
            data-i18n-placeholder="label.wifi-password-hint"
            style="margin-top:4px;"
          />
        </div>
        <button
          class="s-btn primary"
          id="wifi-config-save"
          data-i18n="button.save-wifi"
        >
          Save WiFi
        </button>
        <div class="field-status" id="wifi-config-status"></div>
        <p class="restart-notice" data-i18n="label.restart-notice">
          ⚠ Device will restart after saving.
        </p>
      </AccordionHead>
    </div>
  );
}
