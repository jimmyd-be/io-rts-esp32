//TODO: Implement this
import { Checkbox } from "../Checkbox";
import { InfoResponse } from "../../models/Types.ts";

export function SoftwareUpdateSettings({ infoData }: { infoData: InfoResponse | undefined }) {
  return (
    <div class="settings-row">
      <span class="row-label" data-i18n="settings.row.software-updates">
        Software updates
      </span>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:var(--text2);">
          button.stable-only
        </span>
        <Checkbox />
        <button class="s-btn" data-i18n="button.check">
          Check
        </button>
      </div>
    </div>
  );
}
