import { useCallback, useEffect, useMemo, useState } from "react";
import useApi from "../hooks/useApi";
import useI18n from "../hooks/useI18n";
import { Device, Remote } from "../models/Types";
import { Remotes } from "../components/Remotes";
import { DeviceCard } from "../components/DeviceCard";

export function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  const {t} = useI18n();

  const deviceApi = useApi<Device[]>({ endpoint: "/api/devices", method: "GET" });

  useEffect(() => {

      const list: Device[] = deviceApi.loaded && deviceApi.data ? deviceApi.data : [];

      const active = list.filter((d: Device) => !d.inactive);
      const inactive = list.filter((d: Device) => d.inactive);

      const ordered = [...active, ...inactive];
      setDevices(ordered);
      setActiveCount(active.length);
  }, [deviceApi.data]);

  const countText = useMemo(
    () => `${activeCount} ${t ? t("nav.devices") : "devices"}`,
    [activeCount],
  );

  return (
    <section className="view active" id="view-devices">
      <div className="view-header">
        <h2 className="view-title" data-i18n="nav.devices">
          Devices
        </h2>

        <span
          id="count-pill"
          style={{
            fontSize: "11px",
            color: "var(--text3)",
            marginRight: "auto",
            paddingLeft: "8px",
          }}
        >
          {!deviceApi.loaded ? "Loading…" : countText}
        </span>

        <button
          className="view-add-btn"
          id="pair-device-btn"
          title="Pair new device"
        >
          +
        </button>
      </div>

      <ul id="device-list">
        {!deviceApi.loaded ? (
          <li
            id="device-loading"
            style={{
              padding: "20px",
              color: "var(--text3)",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            {t ? t("popup.loading", "Loading…") : "Loading…"}
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
              ? t("list.no_devices_available", "No devices available.")
              : "No devices available."}
          </li>
        ) : (
          devices.map((device) => <DeviceCard device={device} />)
        )}
      </ul>

      <Remotes />
    </section>
  );
}
