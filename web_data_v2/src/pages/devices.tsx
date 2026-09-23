import { Remotes } from "../components/Remotes";
import { RemoteWizardProvider } from "../components/Modals/remoteWizard";
import { DeviceModalProvider } from "../hooks/useDeviceModal";
import { PairingWizardProvider } from "../components/Modals/PairingWizard.tsx";
import { useDevices } from "../hooks/api/useDevices.tsx";
import { useRemotes } from "../hooks/api/useRemotes.tsx";
import { DevicesSection } from "../components/DevicesSection.tsx";

export function Devices() {
  const deviceApi = useDevices();
  const remotesApi = useRemotes();

  return (
    <DeviceModalProvider>
      <PairingWizardProvider
        onDeviceAdded={(deviceId, deviceName) => {
          console.log(`Device ${deviceName} added`);
          // Refresh device list, etc.
        }}
        onDevicePairingStatusUpdated={() => {
          // Refresh pairing status
        }}
      >
        <section className="view active">
          <DevicesSection devices={deviceApi.data ?? []} />

          <RemoteWizardProvider
            remotes={remotesApi.data ?? []}
            devices={deviceApi.data ?? []}
          >
            <Remotes remotesApi={remotesApi} />
          </RemoteWizardProvider>
        </section>
      </PairingWizardProvider>
    </DeviceModalProvider>
  );
}
