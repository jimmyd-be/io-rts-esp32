import { useEffect, useRef, useState } from "preact/hooks";
import { AccordionHead } from "../AccordionHead";
import { Checkbox } from "../Checkbox";
import { useOtaKey } from "../../hooks/api/useOtaKey";
import { useMqttConfig } from "../../hooks/api/useMqttConfig";
import { ToastType } from "../ToastProvider";
import { useToast } from "../../hooks/useToast";
import useI18n from "../../hooks/useI18n.tsx";

const PASSWORD_PLACEHOLDER = "********";

type FormValues = {
  server: string;
  port: string;
  user: string;
  password: string;
  client_id: string;
  topic: string;
  discovery: string;
  enabled: boolean;
};

export function MqttSettings() {
  const otaData = useOtaKey();
  const showToast = useToast();
  const { t } = useI18n();
  const api = useMqttConfig();
  const initialised = useRef(false);

  const [formValues, setFormValues] = useState<FormValues>({
    server: "", port: "", user: "", password: "",
    client_id: "", topic: "", discovery: "", enabled: false,
  });

  useEffect(() => {
    if (api.loaded && api.data && !initialised.current) {
      initialised.current = true;
      setFormValues({
        server:     api.data.server      ?? "",
        port:       String(api.data.port ?? ""),
        user:       api.data.user        ?? "",
        password:   api.data.password    ?? "",
        client_id:  api.data.client_id   ?? "",
        topic:      api.data.topic       ?? "",
        discovery:  api.data.discovery   ?? "",
        enabled:    api.data.enabled     ?? false,
      });
    }
  }, [api.loaded, api.data]);

  const set = (key: keyof FormValues) =>
    (e: Event) => setFormValues(v => ({ ...v, [key]: (e.target as HTMLInputElement).value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!otaData.data?.key) {
          showToast("OTA key not available, please wait and try again.", ToastType.ERROR);
          return;
        }

        const payload = {
          ...formValues,
          port: Number(formValues.port) || 1883,
          // Send empty string so firmware skips overwriting when placeholder is unchanged
          password: formValues.password === PASSWORD_PLACEHOLDER ? "" : formValues.password,
        };

        fetch("/api/mqtt", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "X-OTA-Key": otaData.data.key,
          },
        })
          .then(() => {
            showToast("toast.mqtt-saved", ToastType.SUCCESS);
          })
          .catch(() => {
            showToast("toast.error-saving-mqtt", ToastType.ERROR);
          });
      }}
    >
      <div class="acc-row" data-help="mqtt">
        <AccordionHead
          title="MQTT"
          titleI18n="settings.row.mqtt"
          helpLabel="Help for mqtt"
          helpKey={"mqtt"}
          summary={
            <>
              <span class="acc-sum-val">{api.data?.server}</span>
              <span
                class={
                  api.loaded && api.data?.status === "connected"
                    ? "success-text row-status"
                    : "error-text row-status"
                }
              >
                {api.loaded && api.data?.status === "connected"
                  ? t("status.wifi.connected")
                  : t("status.wifi.not-connected")}
              </span>
            </>
          }
        >
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span style="font-size:12px;color:var(--text2);" data-i18n="label.enable-mqtt">
              Enable MQTT
            </span>
            <Checkbox
              name="enabled"
              checked={formValues.enabled}
              ariaLabel="Enable MQTT"
              onChange={(checked) => setFormValues(v => ({ ...v, enabled: checked }))}
            />
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:2;">
              <label class={"label-title"} data-i18n="label.broker-address">Broker address</label>
              <input type="text" name="server" value={formValues.server} onInput={set("server")}
                class="s-input" placeholder="192.168.1.x or hostname" style="margin-top:4px;" />
            </div>
            <div style="flex:1;">
              <label class={"label-title"} data-i18n="label.port">Port</label>
              <input type="text" name="port" value={formValues.port} onInput={set("port")}
                class="s-input" placeholder="1883 / 8883 (TLS)" style="margin-top:4px;" />
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:1;">
              <label class={"label-title"} data-i18n="label.username">Username</label>
              <input type="text" name="user" value={formValues.user} onInput={set("user")}
                class="s-input" placeholder="leave blank if none" style="margin-top:4px;" />
            </div>
            <div style="flex:1;">
              <label class={"label-title"} data-i18n="label.password">Password</label>
              <input type="password" name="password" value={formValues.password} onInput={set("password")}
                class="s-input" placeholder="leave blank if none" style="margin-top:4px;" />
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:1;">
              <label class={"label-title"} data-i18n="label.client-id">Client ID</label>
              <input type="text" name="client_id" value={formValues.client_id} onInput={set("client_id")}
                class="s-input" placeholder="blank = auto-generated" style="margin-top:4px;" />
            </div>
            <div style="flex:1;">
              <label class={"label-title"} data-i18n="label.topic-prefix">Topic prefix</label>
              <input type="text" name="topic" value={formValues.topic} onInput={set("topic")}
                class="s-input" placeholder="e.g. home/io-rts" style="margin-top:4px;" />
            </div>
          </div>
          <div>
            <label class={"label-title"} data-i18n="label.ha-discovery">Home Assistant discovery prefix</label>
            <input type="text" name="discovery" value={formValues.discovery} onInput={set("discovery")}
              class="s-input" placeholder="e.g. homeassistant/device/io-rts" style="margin-top:4px;" />
          </div>
          <button type={"submit"} class="s-btn primary" data-i18n="button.save-mqtt">
            Save MQTT
          </button>
        </AccordionHead>
      </div>
    </form>
  );
}
