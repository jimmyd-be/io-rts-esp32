import { AccordionHead } from "../AccordionHead";

export function BackupSettings() {
  return (
    <div class="acc-row" data-help="backup">
      <AccordionHead
        title="Backup / Restore"
        titleI18n="settings.row.backup"
        helpLabel="Help for backup"
        helpKey="backup"
        summary={<span class="acc-sum-hint">Export · Import · Reset</span>}
      >
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button
            class="s-btn"
            id="backup-export"
            data-i18n="button.export-backup"
          >
            Export Backup
          </button>
          <button
            class="s-btn"
            id="backup-import-btn"
            data-i18n="button.import-backup"
          >
            Import Backup
          </button>
          <input
            type="file"
            id="backup-file"
            accept=".json"
            style="display:none"
          />
          <button
            class="s-btn danger"
            id="factory-reset-btn"
            data-i18n="button.factory-reset"
          >
            Factory Reset
          </button>
        </div>
        <span id="backup-status" class="field-status"></span>
      </AccordionHead>
    </div>
  );
}
