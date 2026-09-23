import { Device } from "../models/Types";
import useI18n from "../hooks/useI18n";
import { useDeviceModal } from "../hooks/useDeviceModal";
import { BlindPane } from "./BlindPane";
import { deviceHasPosition } from "../utils/deviceUtils";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { t } = useI18n();
  const { open } = useDeviceModal();
  const hasPos = deviceHasPosition(device);

  return (
    <li
      key={device.id}
      className={`device ${device.inactive ? "inactive" : ""}`}
      data-id={device.id}
    >
      <div className="warn-dot" />
      <div className="moving-dot" />

      <div className="card-top">
        <div>
          <div className="card-name">{device.name}</div>
          <div className="card-meta">
            <span className="card-badge">
              {(device.type_name || "").toLowerCase()}
            </span>
            <span
              className={`card-badge ${device.protocol === "1w" ? "badge-1w" : "badge-2w"}`}
            >
              {device.protocol === "1w" ? "1W" : "2W"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn menu"
          aria-label="Edit"
          onClick={() => open(device)}
        >
          ⋯
        </button>
      </div>

      {device.inactive ? (
        <span className="device-status-only">
          {t ? t("badge.inactive") : "inactive"}
        </span>
      ) : (
        <>
          {hasPos ? (
            <BlindPane device={device} />
          ) : (
            <div className="card-spacer" />
          )}

          <div className="card-btn-row">
            <button className="card-btn">↑</button>
            <button className="card-btn">■</button>
            <button className="card-btn">↓</button>
            <button
              className="card-btn card-fav"
              aria-label="Favorite"
              title="No favorite set — use Edit to set one."
              data-fav-device="1c611a"
            >
              ★
            </button>
          </div>
        </>
      )}
    </li>
  );
}
