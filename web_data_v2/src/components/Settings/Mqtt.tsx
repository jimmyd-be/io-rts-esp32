import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { MqttConfig } from "../../models/Types";
import useI18n from "../../hooks/useI18n";

export function MqttSettings() {

  const t = useI18n();

  const api = useApi<MqttConfig>({
    endpoint: "/api/mqtt",
    method: "GET"
  });
  return (
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
          <input type="checkbox" id="mqtt-enabled" style="display:none" />
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
              id="mqtt-server"
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
              id="mqtt-port"
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
              id="mqtt-user"
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
              id="mqtt-password"
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
              id="mqtt-client-id"
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
              id="mqtt-topic"
              class="s-input"
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
            id="mqtt-discovery"
            class="s-input"
            placeholder="e.g. homeassistant/device/io-rts"
            style="margin-top:4px;"
          />
        </div>
        <button
          class="s-btn primary"
          id="mqtt-update"
          data-i18n="button.save-mqtt"
        >
          Save MQTT
        </button>
      </AccordionHead>
    </div>
  );
}
