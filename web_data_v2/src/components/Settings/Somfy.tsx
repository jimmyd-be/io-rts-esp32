import { AccordionHead } from "../AccordionHead";
import useApi from "../../hooks/useApi";
import { otaKeyResponse, SomfyConfig } from "../../models/Types";

export function SomfySettings() {
  const otaData = useApi<otaKeyResponse>({
    endpoint: "/api/ota/key",
    method: "GET",
  });

  const api = useApi<SomfyConfig>({
    endpoint: "/api/somfy/credentials",
    method: "GET",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission
        const formValues = e.currentTarget.elements;

        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());
        console.log();

        fetch("/api/somfy/credentials", {
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
      <div class="acc-row" data-help="somfy">
        <AccordionHead
          title="Somfy / Overkiz"
          titleI18n="settings.row.somfy"
          helpKey="somfy"
          helpLabel="Help for somfy"
        >
          <div>
            <label class={"label-title"} data-i18n="label.somfy-email">
              Somfy account email
            </label>
            <input
              type="text"
              name="email"
              value={api.data?.email}
              class="s-input"
              placeholder="your@somfy.com"
              style="margin-top:4px;"
              autocomplete="username"
            />
          </div>
          <div>
            <label class={"label-title"} data-i18n="label.somfy-password">
              Somfy account password
            </label>
            <input
              type="password"
              name="password"
              class="s-input"
              placeholder="••••••••"
              style="margin-top:4px;"
              autocomplete="current-password"
            />
          </div>
          <div style="display:flex;gap:8px;">
            <button
              class="s-btn primary"
              id="somfy-save"
              data-i18n="button.save-credentials"
            >
              Save credentials
            </button>
            <button
              type={"submit"}
              class="s-btn"
              id="somfy-import-btn"
              data-i18n="button.import-devices-btn"
            >
              Import devices
            </button>
          </div>
          <span
            id="somfy-status"
            style="font-size:11px;color:var(--text3);min-height:16px;"
          ></span>
        </AccordionHead>
      </div>
    </form>
  );
}
