import { AccordionHead } from "../AccordionHead";
import { JSX } from "preact";
import useApi from "../../hooks/useApi";
import { otaKeyResponse, Types } from "../../models/Types";
import { useEffect, useState } from "preact/hooks";
import useI18n from "../../hooks/useI18n";
import { Formik } from "formik";

export function WifiSettings(): JSX.Element {
  const wifiData = useApi<Types>({endpoint: "/api/wifi/config",  method: "GET" });
  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });
   const t = useI18n();

  const [ssid, setSsid] = useState<string>("");

  useEffect(() => {
  if(wifiData.loaded && wifiData.data) {
    setSsid(wifiData.data.ssid);
  }
  }, [wifiData.data])

  return (
    <Formik
      initialValues={{
        ssid: wifiData.data?.ssid,
        password: "",
      }}
      onSubmit={(values) => {
        fetch("/api/wifi/config", {
          method: "POST",
          headers: {
            "X-OTA-Key": otaData.data?.key,
          },
          body: JSON.stringify({
            ssid: values.ssid,
            password: values.password,
          }),
        }).then((r) => {
          //TODo handle Response status: restarting
        });
      }}
    >
      <div class="acc-row" data-help="wifi">
        <AccordionHead
          title="WiFi"
          titleI18n="settings.row.wifi"
          helpLabel="Help for wifi"
          summary={
            <>
              <span class="acc-sum-val" id="acc-wifi-val">
                {ssid}
              </span>
              <span
                class={
                  wifiData.loaded && wifiData.data != null
                    ? 'success-text row-status"'
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
                style="font-size:11px;color:var(--text3);"
                data-i18n="label.network-name-ssid"
              >
                Network name (SSID)
              </label>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input
                  type="text"
                  id="wifi-ssid"
                  name="ssid"
                  value={ssid}
                  class="s-input"
                  placeholder="Network name"
                  maxLength={32}
                  style="flex:1;"
                />
                <button
                  class="s-btn"
                  id="wifi-scan-btn"
                  data-i18n="button.scan"
                  onClick={() => scan()}
                >
                  Scan
                </button>
              </div>
            </div>
          </div>
          {/*{scanResults && (*/}
          {/*  <div id="wifi-scan-results" style="margin-top:8px;">*/}
          {/*    {scanResults.length === 0 ? (*/}
          {/*      <div>No networks found</div>*/}
          {/*    ) : (*/}
          {/*      <ul style={{margin:0,paddingLeft:'1em'}}>*/}
          {/*        {scanResults.map((r) => (*/}
          {/*          <li>{r.ssid} ({r.rssi ?? '?'})</li>*/}
          {/*        ))}*/}
          {/*      </ul>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*)}*/}
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
              name="password"
              class="s-input"
              placeholder="Leave blank to keep current"
              data-i18n-placeholder="label.wifi-password-hint"
              style="margin-top:4px;"
            />
          </div>
          <button
            class="s-btn primary"
            type={"submit"}
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
    </Formik>
  );
}

