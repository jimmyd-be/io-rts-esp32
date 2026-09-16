import { WifiSettings } from "../components/Settings/Wifi";
import { NetworkSettings } from "../components/Settings/Network";
import { FallbackApSettings } from "../components/Settings/FallbackAp";
import { MqttSettings } from "../components/Settings/Mqtt";
import { SyslogSettings } from "../components/Settings/Syslog";
import { SomfySettings } from "../components/Settings/Somfy";
import { ControllerSettings } from "../components/Settings/Controller";
import { IoSystemKeySettings } from "../components/Settings/IoSystemKey";
import { OtaKeySettings } from "../components/Settings/OtaKey";
import { FirmwareSettings } from "../components/Settings/Firmware";
import { WebUISettings } from "../components/Settings/WebUi";
import { WebUIUpdateSettings } from "../components/Settings/WebUiUpdate";
import { BackupSettings } from "../components/Settings/Backup";
import { ImportSettings } from "../components/Settings/Import";
import { RebootSettings } from "../components/Settings/Reboot";
import { SoftwareUpdateSettings } from "../components/Settings/SoftwareUpdate";

export function Settings() {
  return (
    <section class="view active" id="view-settings">
      <div class="view-header">
        <h2 class="view-title" data-i18n="nav.settings">
          Settings
        </h2>
      </div>

      <div class="settings-group">
        <div class="settings-group-label" data-i18n="settings.group.network">
          Network
        </div>
        <div class="settings-card">
          <WifiSettings />
          <NetworkSettings />
          <FallbackApSettings />
        </div>
      </div>

      <div class="settings-group">
        <div
          class="settings-group-label"
          data-i18n="settings.group.integration"
        >
          Integration
        </div>
        <div class="settings-card">
          <MqttSettings />
          <SyslogSettings />
          <SomfySettings />
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-label" data-i18n="settings.group.security">
          Security
        </div>
        <div class="settings-card">
          <ControllerSettings />
          <IoSystemKeySettings />
          <OtaKeySettings />
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-label" data-i18n="settings.group.system">
          System
        </div>
        <div class="settings-card">
          <FirmwareSettings />
          <WebUISettings />
          <WebUIUpdateSettings />
          <BackupSettings />
          <ImportSettings />
          <RebootSettings />
          <SoftwareUpdateSettings />
        </div>
      </div>
    </section>
  );
}
