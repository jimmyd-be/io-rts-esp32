import { AccordionHead } from "../AccordionHead";

export function SyslogSettings() {
  return (
    <div class="acc-row" data-help="syslog">
      <AccordionHead
        title="Syslog"
        titleI18n="settings.row.syslog"
        helpLabel="Help for syslog"
        summary={
          <>
            <span class="acc-sum-val" id="acc-syslog-val">
              off
            </span>
            <span class="row-status" id="syslog-conn-status"></span>
          </>
        }
      >
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span
            style="font-size:12px;color:var(--text2);"
            data-i18n="label.enable-syslog"
          >
            Enable syslog
          </span>
          <div class="s-toggle" id="syslog-toggle"></div>
          <input type="checkbox" id="syslog-enabled" style="display:none" />
        </div>
        <div style="display:flex;gap:6px;">
          <div style="flex:2;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.server-address"
            >
              Server address
            </label>
            <input
              type="text"
              id="syslog-server"
              class="s-input"
              placeholder="192.168.1.x"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.port"
            >
              Port
            </label>
            <input
              type="text"
              id="syslog-port"
              class="s-input"
              placeholder="514"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.facility"
            >
              Facility
            </label>
            <input
              type="number"
              id="syslog-facility"
              class="s-input"
              min={0}
              max={23}
              placeholder="1"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.min-level"
            >
              Min level
            </label>
            <select
              id="syslog-min-level"
              class="s-select"
              style="margin-top:4px;"
            >
              <option value="3">Error</option>
              <option value="4">Warning</option>
              <option value="6">Info</option>
              <option value="7">Debug</option>
            </select>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label
            style="font-size:11px;color:var(--text3);"
            data-i18n="label.device-identifier"
          >
            Device identifier (shown in log)
          </label>
          <input
            type="text"
            id="syslog-id"
            class="s-input"
            placeholder="auto-generated"
            maxLength={15}
          />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:11px;color:var(--text3);">Format</label>
          <select id="syslog-format" class="s-select">
            <option value="5424">RFC 5424</option>
            <option value="3164">RFC 3164 (Graylog)</option>
          </select>
        </div>
        <button
          class="s-btn primary"
          id="syslog-update"
          data-i18n="button.save-syslog"
        >
          Save Syslog
        </button>
      </AccordionHead>
    </div>
  );
}
