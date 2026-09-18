import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { otaKeyResponse, Types, WifiScanResult } from "../../models/Types";
import { useEffect, useState } from "preact/hooks";
import useI18n from "../../hooks/useI18n";
import { JSX } from "preact";

export function WifiSettings(): JSX.Element {
  const [scan, setScan] = useState(false);

  const wifiData = useApi<Types>({
    endpoint: "/api/wifi/config",
    method: "GET",
  });
  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });
  const t = useI18n();

  const [formValues, setFormValues] = useState({
    ssid: "",
    password: "",
  });

  useEffect(() => {
    if (wifiData.loaded && wifiData.data) {
      setFormValues((current) => ({
        ...current,
        ssid: wifiData.data?.ssid ?? current.ssid,
      }));
    }
  }, [wifiData.loaded, wifiData.data]);

  // useEffect(() => {
  //   if (scan) {
  //     // Perform scan logic here
  //
  //     await fetch("/api/wifi/scan", {
  //       method: "GET"}).then((r) => {
  //       if (r.ok) {
  //         const data = await r.json() as WifiScanResult;
  //
  //     }
  //
  //     setScan(false);
  //   }
  // }, [scan]);

  const handleFieldChange = (field: "ssid" | "password", value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <form
      class="acc-row"
      data-help="wifi"
      onSubmit={(e) => {
        e.preventDefault();

        fetch("/api/wifi/config", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-OTA-Key": otaData.data?.key ?? "",
          },
          body: JSON.stringify({
            ssid: formValues.ssid,
            password: formValues.password,
          }),
        }).then((r) => {
          // TODO handle Response status: restarting
        });
      }}
    >
      <AccordionHead
        title="WiFi"
        titleI18n="settings.row.wifi"
        helpLabel="Help for wifi"
        helpKey={"wifi"}
        summary={
          <>
            <span class="acc-sum-val" id="acc-wifi-val">
              {formValues.ssid}
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
            <label class={"label-title"} data-i18n="label.network-name-ssid">
              Network name (SSID)
            </label>
            <div style="display:flex;gap:6px;margin-top:4px;">
              <input
                type="text"
                id="wifi-ssid"
                name="ssid"
                value={formValues.ssid}
                onInput={(e) =>
                  handleFieldChange(
                    "ssid",
                    (e.currentTarget as HTMLInputElement).value,
                  )
                }
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
                onClick={() => setScan(true)}
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
            value={formValues.password}
            onInput={(e) =>
              handleFieldChange(
                "password",
                (e.currentTarget as HTMLInputElement).value,
              )
            }
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
    </form>
  );
}
