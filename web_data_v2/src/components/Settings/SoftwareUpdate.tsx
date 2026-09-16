export function SoftwareUpdateSettings() {
  return (
    <div class="settings-row">
      <span class="row-label" data-i18n="settings.row.software-updates">
        Software updates
      </span>
      <div style="display:flex;align-items:center;gap:8px;">
        <span
          style="font-size:12px;color:var(--text2);"
          id="update-channel-label"
        >
          button.stable-only
        </span>
        <div class="s-toggle" id="update-channel-toggle"></div>
        <input type="checkbox" id="update-channel-beta" style="display:none" />
        <button class="s-btn" id="check-updates-btn" data-i18n="button.check">
          Check
        </button>
      </div>
    </div>
  );
}
