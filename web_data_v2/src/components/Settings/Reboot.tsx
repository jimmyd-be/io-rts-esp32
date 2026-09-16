export function RebootSettings() {
  return (
    <div class="settings-row">
      <span
        class="row-label danger"
        id="reboot-btn"
        data-i18n="settings.row.reboot"
        style="cursor:pointer;"
      >
        Reboot Device
      </span>
      <div class="row-right">
        <span class="row-chevron">›</span>
      </div>
    </div>
  );
}
