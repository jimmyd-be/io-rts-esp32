import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { otaKeyResponse, Types } from "../../models/Types";
import useI18n from "../../hooks/useI18n";
import { JSX } from "preact";
import { Form, Formik } from "formik";

export function WifiSettings(): JSX.Element {
  const wifiData = useApi<Types>({ endpoint: "/api/wifi/config", method: "GET" });
  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });
  const t = useI18n();

  return (
    <Formik
      initialValues={{
        ssid: wifiData.data?.ssid ?? "",
        password: "",
      }}
      enableReinitialize
      onSubmit={async (values) => {
        await fetch("/api/wifi/config", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-OTA-Key": otaData.data?.key ?? "",
          },
          body: JSON.stringify({
            ssid: values.ssid,
            password: values.password,
          }),
        });
      }}
    >
      {({ values, handleChange }) => (
        <Form class="acc-row" data-help="wifi">
          <AccordionHead
            title="WiFi"
            titleI18n="settings.row.wifi"
            helpLabel="Help for wifi"
            summary={
              <>
                <span class="acc-sum-val" id="acc-wifi-val">
                  {values.ssid}
                </span>
                <span
                  class={
                    wifiData.loaded && wifiData.data != null
                      ? "success-text row-status"
                      : "error-text row-status"
                  }
                  id="fallback-status"
                >
                  {wifiData.loaded && wifiData.data
                    ? t.t("status.wifi.connected")
                    : t.t("status.wifi.not-connected")}
                </span>
              </>
            }
          >
            <div style="display:flex;gap:6px;">
              <div style="flex:1;">
                <label
                  class={"label-title"}
                  data-i18n="label.network-name-ssid"
                >
                  Network name (SSID)
                </label>
                <div style="display:flex;gap:6px;margin-top:4px;">
                  <input
                    type="text"
                    id="wifi-ssid"
                    name="ssid"
                    value={values.ssid}
                    onInput={handleChange}
                    class="s-input"
                    placeholder="Network name"
                    maxLength={32}
                    style="flex:1;"
                  />
                  <button
                    class="s-btn"
                    type="button"
                    id="wifi-scan-btn"
                    data-i18n="button.scan"
                  >
                    Scan
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label class={"label-title"} data-i18n="label.password">
                Password
              </label>
              <input
                type="password"
                id="wifi-password"
                name="password"
                value={values.password}
                onInput={handleChange}
                class="s-input"
                placeholder="Leave blank to keep current"
                data-i18n-placeholder="label.wifi-password-hint"
                style="margin-top:4px;"
              />
            </div>
            <button
              class="s-btn primary"
              type="submit"
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
        </Form>
      )}
    </Formik>
  );
}
