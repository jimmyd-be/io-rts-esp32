import { Device } from "../models/Types";
import useI18n from "../hooks/useI18n";

const getDeviceGroup = (device: Device) => {
  const type = (device.type_name || "").toLowerCase();

  if (["shutter", "venetian", "window", "gate"].includes(type)) return type;
  if (["awning", "blind"].includes(type)) return type;
  return "other";
};

export function DeviceCard({ device }: { device: Device }) {
  const { t } = useI18n();

  const group = getDeviceGroup(device);
  const hasPos =
    group === "shutter" ||
    group === "venetian" ||
    group === "window" ||
    group === "gate";

  return (
    <li
      key={device.id}
      className={`device ${device.inactive ? "inactive" : ""}`}
      data-id={device.id}
    >
      <div className="warn-dot" />
      <div className="moving-dot" />

      <div className="card-top">
        <div className="nameBlock">
          <div className="card-name">{device.name}</div>
          <span className="card-badge">
            {(device.type_name || "").toLowerCase()}
          </span>

          {device.protocol === "1w" && (
            <span className="card-badge badge-1w">1W</span>
          )}
        </div>

        <button
          type="button"
          className="btn menu"
          aria-label="Edit"
          onClick={() => {
            // replace with your modal open logic
            console.log("Open device edit modal:", device.id);
          }}
        >
          ⋯
        </button>
      </div>

      {device.inactive ? (
        <span className="device-status-only">
          {t ? t("badge.inactive", "inactive") : "inactive"}
        </span>
      ) : (
        <>
          {hasPos && (
            <div className="pos-indicator">
              <div
                className="pos-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, Number(device.position ?? 0)))}%`,
                  opacity: device.position_estimated ? 0.7 : 1,
                }}
              />
            </div>
          )}

          <div className="card-spacer" />

          <div className="card-controls">
            {/* keep your device buttons here, or replace with a small action block */}
            <button type="button" className="card-btn">
              Open
            </button>
            <button type="button" className="card-btn">
              Close
            </button>
          </div>
        </>
      )}
    </li>
  );
}