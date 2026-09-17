import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { MqttConfig, otaKeyResponse } from "../../models/Types";
import useI18n from "../../hooks/useI18n";

export function MqttSettings() {

  const t = useI18n();

  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });

  const api = useApi<MqttConfig>({
    endpoint: "/api/mqtt",
    method: "GET"

  });
  return (
    <form onSubmit={(e) => {
      e.preventDefault(); // Prevent the default form submission
      const formValues = e.currentTarget.elements;

      const fd = new FormData(e.currentTarget);
      const data = Object.fromEntries(fd.entries());
      console.log();

      fetch("/api/mqtt", {
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
    <div class="acc-row" data-help="mqtt">
      <AccordionHead
        title="MQTT"
        titleI18n="settings.row.mqtt"
        helpLabel="Help for mqtt"
        summary={
          <>
            <span class="acc-sum-val" id="acc-mqtt-val">
              {api.data?.server}
            </span>
            <span class="row-status" id="mqtt-conn-status">
              {api.data?.status}
            </span>
          </>
        }
      >
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span
            style="font-size:12px;color:var(--text2);"
            data-i18n="label.enable-mqtt"
          >
            Enable MQTT
          </span>
          <div class="s-toggle" id="mqtt-enabled-toggle"></div>
          <input type="checkbox" name="enabled" style="display:none" checked={api.data?.enabled}/>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="flex:2;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.broker-address"
            >
              Broker address
            </label>
            <input
              type="text"
              name="server"
              value={api.data?.server}
              id="server"
              class="s-input"
              placeholder="192.168.1.x or hostname"
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
              name="port"
              value={api.data?.port}
              id={"port"}
              class="s-input"
              placeholder="1883 / 8883 (TLS)"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.username"
            >
              Username
            </label>
            <input
              type="text"
              value={api.data?.user}
              name="user"
              class="s-input"
              placeholder="leave blank if none"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={api.data?.password}
              class="s-input"
              placeholder="leave blank if none"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.client-id"
            >
              Client ID
            </label>
            <input
              type="text"
              name="client_id"
              value={api.data?.client_id}
              class="s-input"
              placeholder="blank = auto-generated"
              style="margin-top:4px;"
            />
          </div>
          <div style="flex:1;">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.topic-prefix"
            >
              Topic prefix
            </label>
            <input
              type="text"
              name="topic"
              class="s-input"
              value={api.data?.topic}
              placeholder="e.g. home/io-rts"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <div>
          <label
            style="font-size:11px;color:var(--text3);"
            data-i18n="label.ha-discovery"
          >
            Home Assistant discovery prefix
          </label>
          <input
            type="text"
            name="discovery"
            class="s-input"
            value={api.data?.discovery}
            placeholder="e.g. homeassistant/device/io-rts"
            style="margin-top:4px;"
          />
        </div>
        <button
          type={"submit"}
          class="s-btn primary"
          id="mqtt-update"
          data-i18n="button.save-mqtt"
        >
          Save MQTT
        </button>
      </AccordionHead>
    </div></form>
  );
}
