import { AccordionHead } from "../AccordionHead";

export function FallbackApSettings() {
  return (
    <div class="acc-row" data-help="fallback-ap">
      <AccordionHead
        title="Fallback AP"
        titleI18n="settings.row.fallback-ap"
        helpLabel="Help for fallback-ap"
        summary={
          <span class="acc-sum-val" id="acc-fap-val">
            off
          </span>
        }
      >
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span
            style="font-size:12px;color:var(--text2);"
            data-i18n="label.enable-fallback-ap"
          >
            Enable fallback hotspot
          </span>
          <div class="s-toggle on" id="fallback-toggle"></div>
          <input type="checkbox" id="fallback-enabled" style="display:none" />
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:2">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.hotspot-name"
            >
              Hotspot name (SSID)
            </label>
            <input
              type="text"
              id="fallback-ap-ssid"
              class="s-input"
              maxLength={32}
              placeholder="io-rts-setup"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.timeout-s"
            >
              Timeout (s)
            </label>
            <input
              type="number"
              id="fallback-timeout"
              class="s-input"
              min={0}
              max={3600}
              placeholder="600"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.retries-boot"
            >
              Retries (boot)
            </label>
            <input
              type="number"
              id="fallback-retries-boot"
              class="s-input"
              min={1}
              max={20}
              placeholder="3"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.retries-running"
            >
              Retries (running)
            </label>
            <input
              type="number"
              id="fallback-retries-running"
              class="s-input"
              min={1}
              max={20}
              placeholder="3"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.hotspot-password"
            >
              Hotspot password (min 8 chars, blank = open)
            </label>
            <input
              type="password"
              id="fallback-ap-password-new"
              class="s-input"
              placeholder="Blank = clear password"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.confirm-password"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="fallback-ap-password-confirm"
              class="s-input"
              placeholder="Confirm"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div class="field-status" id="fallback-save-status"></div>
        <button
          class="s-btn primary"
          id="fallback-save"
          data-i18n="button.save-fallback-ap"
        >
          Save Fallback AP
        </button>
      </AccordionHead>
    </div>
  );
}
