import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { MqttConfig, otaKeyResponse, SyslogConfig } from "../../models/Types";

export function SyslogSettings() {

  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });
  const api = useApi<SyslogConfig>({
    endpoint: "/api/syslog",
    method: "GET",
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault(); // Prevent the default form submission
      const formValues = e.currentTarget.elements;

      const fd = new FormData(e.currentTarget);
      const data = Object.fromEntries(fd.entries());
      console.log();

      fetch("/api/syslog", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "X-OTA-Key": otaData.data?.key || "",
        },
      }).then(r => {
        //TODO handle Response
      });

    }}>
    <div class="acc-row" data-help="syslog">
      <AccordionHead
        title="Syslog"
        titleI18n="settings.row.syslog"
        helpLabel="Help for syslog"
        summary={
          <>
            <span class="acc-sum-val" id="acc-syslog-val">
              {api.data?.server || "Off"}
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
          <input type="checkbox" id="syslog-enabled" style="display:none" checked={api.data?.enabled} />
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
              value={api.data?.server}
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
              value={api.data?.port}
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
              value={api.data?.facility}
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
              value={api.data?.min_level}
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
            value={api.data?.id}
          />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:11px;color:var(--text3);">Format</label>
          <select id="syslog-format" class="s-select" value={api.data?.format}>
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
    </div></form>
  );
}
