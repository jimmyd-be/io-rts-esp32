import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { NetworkConfig, otaKeyResponse } from "../../models/Types";
import { useState } from "preact/hooks";

export function NetworkSettings() {
  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });

  const api = useApi<NetworkConfig>({
    endpoint: "/api/network/config",
    method: "GET",
  });

  const [dhcpEnabled, setDhcpEnabled] = useState(
    api.data ? api.data.dhcp : true,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission

        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());
        console.log();

        fetch("//api/network/config", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "X-OTA-Key": otaData.data?.key || "",
          },
        }).then((r) => {
          //TODO handle Response
        });
      }}
    >
      <div class="acc-row" data-help="network">
        <AccordionHead
          title="Network"
          titleI18n="settings.row.network"
          helpLabel="Help for network"
          helpKey={"network"}
          summary={
            <div class="acc-summary">
              <span class="acc-sum-val" id="acc-net-val">
                {api.data ? api.data.hostname : undefined}
              </span>
            </div>
          }
        >
          <div style="display:flex;gap:6px;align-items:flex-end;">
            <div style="flex:2">
              <label class={"label-title"} data-i18n="label.hostname">
                Hostname
              </label>
              <input
                type="text"
                id="net-hostname"
                value={api.data ? api.data.hostname : undefined}
                class="s-input"
                placeholder="io-rts-esp32"
                maxLength={32}
                style="margin-top:4px;"
              />
            </div>
            <div style="flex:1;display:flex;align-items:center;gap:8px;padding-bottom:2px;">
              <span
                style="font-size:12px;color:var(--text2);"
                data-i18n="label.dhcp"
              >
                DHCP
              </span>
              <div class="s-toggle" id="net-dhcp-toggle"></div>
              <input
                type="checkbox"
                id="net-dhcp"
                checked={api.data ? api.data.dhcp : undefined}
              />
            </div>
          </div>
          <div
            id="net-static-fields"
            style="flex-direction:column;gap:6px;display:flex;"
          >
            <div style="display:flex;gap:6px;">
              <div style="flex:2">
                <label class={"label-title"} data-i18n="label.ip-address">
                  IP Address
                </label>
                <input
                  type="text"
                  value={api.data ? api.data.ip : undefined}
                  disabled={dhcpEnabled}
                  id="net-ip"
                  class="s-input"
                  placeholder="192.168.1.100"
                  style="margin-top:4px;"
                />
              </div>
              <div style="flex:1">
                <label class={"label-title"} data-i18n="label.subnet-mask">
                  Subnet mask
                </label>
                <input
                  type="text"
                  value={api.data ? api.data.mask : undefined}
                  id="net-mask"
                  disabled={dhcpEnabled}
                  class="s-input"
                  placeholder="255.255.255.0"
                  style="margin-top:4px;"
                />
              </div>
            </div>
            <div style="display:flex;gap:6px;">
              <div style="flex:1">
                <label class={"label-title"} data-i18n="label.gateway">
                  Gateway
                </label>
                <input
                  type="text"
                  id="net-gateway"
                  disabled={dhcpEnabled}
                  class="s-input"
                  placeholder="192.168.1.1"
                  style="margin-top:4px;"
                  value={api.data ? api.data.gateway : undefined}
                />
              </div>
              <div style="flex:1">
                <label class={"label-title"} data-i18n="label.dns">
                  DNS
                </label>
                <input
                  type="text"
                  id="net-dns1"
                  class="s-input"
                  disabled={dhcpEnabled}
                  placeholder="8.8.8.8"
                  style="margin-top:4px;"
                  value={api.data ? api.data.dns1 : undefined}
                />
              </div>
            </div>
            <div>
              <label class={"label-title"} data-i18n="label.sntp-server">
                SNTP server
              </label>
              <input
                type="text"
                id="net-sntp"
                disabled={dhcpEnabled}
                class="s-input"
                placeholder="pool.ntp.org"
                style="margin-top:4px;"
                value={api.data ? api.data.sntp : undefined}
              />
            </div>
          </div>
          <button
            type={"submit"}
            class="s-btn primary"
            id="net-config-save"
            data-i18n="button.save-network"
          >
            Save Network
          </button>
          <p class="restart-notice" data-i18n="label.restart-notice">
            ⚠ Device will restart after saving.
          </p>
        </AccordionHead>
      </div>
    </form>
  );
}
