import { AccordionHead } from "../AccordionHead";

export function NetworkSettings() {
  return (
    <div class="acc-row" data-help="network">
      <AccordionHead
        title="Network"
        titleI18n="settings.row.network"
        helpLabel="Help for network"
      >
        <div style="display:flex;gap:6px;align-items:flex-end;">
          <div style="flex:2">
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.hostname"
            >
              Hostname
            </label>
            <input
              type="text"
              id="net-hostname"
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
            <input type="checkbox" id="net-dhcp" style="display:none" />
          </div>
        </div>
        <div
          id="net-static-fields"
          style="flex-direction:column;gap:6px;display:flex;"
        >
          <div style="display:flex;gap:6px;">
            <div style="flex:2">
              <label
                style="font-size:11px;color:var(--text3);"
                data-i18n="label.ip-address"
              >
                IP Address
              </label>
              <input
                type="text"
                id="net-ip"
                class="s-input"
                placeholder="192.168.1.100"
                style="margin-top:4px;"
              />
            </div>
            <div style="flex:1">
              <label
                style="font-size:11px;color:var(--text3);"
                data-i18n="label.subnet-mask"
              >
                Subnet mask
              </label>
              <input
                type="text"
                id="net-mask"
                class="s-input"
                placeholder="255.255.255.0"
                style="margin-top:4px;"
              />
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:1">
              <label
                style="font-size:11px;color:var(--text3);"
                data-i18n="label.gateway"
              >
                Gateway
              </label>
              <input
                type="text"
                id="net-gateway"
                class="s-input"
                placeholder="192.168.1.1"
                style="margin-top:4px;"
              />
            </div>
            <div style="flex:1">
              <label
                style="font-size:11px;color:var(--text3);"
                data-i18n="label.dns"
              >
                DNS
              </label>
              <input
                type="text"
                id="net-dns1"
                class="s-input"
                placeholder="8.8.8.8"
                style="margin-top:4px;"
              />
            </div>
          </div>
          <div>
            <label
              style="font-size:11px;color:var(--text3);"
              data-i18n="label.sntp-server"
            >
              SNTP server
            </label>
            <input
              type="text"
              id="net-sntp"
              class="s-input"
              placeholder="pool.ntp.org"
              style="margin-top:4px;"
            />
          </div>
        </div>
        <button
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
  );
}
