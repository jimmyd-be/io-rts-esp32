import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import useI18n from "../hooks/useI18n";
import { Remotes } from "../components/Remotes";
import { DeviceCard } from "../components/DeviceCard";
import { RemoteWizardProvider } from "../components/Modals/remoteWizard";

//TODO : Implement device pairing functionality and display a modal for pairing new devices.
export function Devices() {
  const [devices, setDevices] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  const { t } = useI18n();

  const deviceApi = useApi({
    endpoint: "/api/devices",
    method: "GET",
  });

  const remotesApi = useApi({
    endpoint: "/api/remotes",
    method: "GET",
  });

  useEffect(() => {
    const list = deviceApi.loaded && deviceApi.data != null ? deviceApi.data : [];

    const active = list.filter((d) => !d.inactive);
    const inactive = list.filter((d) => d.inactive);

    const ordered = [...active, ...inactive];
    setDevices(ordered);
    setActiveCount(active.length);
  }, [deviceApi.data, deviceApi.loaded]);

  const countText = `${activeCount} ${t ? t("nav.devices") : "devices"}`;

  return (
    <section className="view active">
      <div className="view-header">
        <h2 className="view-title" data-i18n="nav.devices">
          Devices
        </h2>

        <span
          style={{
            fontSize: "11px",
            color: "var(--text3)",
            marginRight: "auto",
            paddingLeft: "8px",
          }}
        >
          {!deviceApi.loaded ? "Loading…" : countText}
        </span>

        <button className="view-add-btn" title="Pair new device">
          +
        </button>
      </div>

      <ul id="device-list">
        {!deviceApi.loaded ? (
          <li
            style={{
              padding: "20px",
              color: "var(--text3)",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            {t ? t("popup.loading") : "Loading…"}
          </li>
        ) : devices.length === 0 ? (
          <li
            style={{
              padding: "20px",
              color: "var(--text3)",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            {t
              ? t("list.no_devices_available")
              : "No devices available."}
          </li>
          ) : (
          devices.map((device) => <DeviceCard key={device.id} device={device} />)
        )}
      </ul>

        <RemoteWizardProvider
            remotes={remotesApi.data ?? []}
            devices={deviceApi.data ?? []}
        >
          <Remotes data={remotesApi} />
        </RemoteWizardProvider>
    </section>
  );
}
