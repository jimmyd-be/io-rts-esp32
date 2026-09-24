import { useCallback, useRef, useState } from "preact/hooks";
import { Device } from "../../models/Types.ts";
import { useToast } from "../../hooks/useToast";
import useI18n from "../../hooks/useI18n";
import { useOtaKey } from "../../hooks/api/useOtaKey.tsx";
import { ToastType } from "../ToastProvider";

interface DeviceModalProps {
  device: Device;
  onClose?: () => void;
}

const DEVICE_TYPES = [
  [2, "Roller shutter"],
  [1, "Venetian blind"],
  [10, "Blind"],
  [13, "Dual shutter"],
  [3, "Awning"],
  [16, "Horizontal awning"],
  [24, "Swinging shutter"],
  [4, "Window opener"],
  [5, "Garage opener"],
  [7, "Gate opener"],
  [8, "Rolling door opener"],
  [6, "Light"],
  [15, "On/off switch"],
  [9, "Lock"],
  [0, "Unknown"],
] as const;

const MANUFACTURERS = [
  [2, "Somfy"],
  [1, "Velux"],
  [3, "Honeywell"],
  [4, "Hörmann"],
  [5, "Assa Abloy"],
  [6, "Niko"],
  [7, "Window Master"],
  [8, "Renson"],
  [11, "Overkiz"],
  [12, "Atlantic Group"],
  [0, "Unknown"],
] as const;

const FAV_PREFIX = "fav_pos_";

function getFavPos(id: string): number | null {
  const v = localStorage.getItem(FAV_PREFIX + id);
  return v !== null ? parseInt(v, 10) : null;
}

function setFavPos(id: string, pos: number): void {
  localStorage.setItem(FAV_PREFIX + id, String(pos));
}

async function postAction(
  deviceId: string,
  action: string,
  otaKey: string,
  value?: unknown,
): Promise<{ success?: boolean; message?: string }> {
  const payload: {deviceId: string; action: string; value?: unknown} = { deviceId, action };
  if (value !== undefined) payload.value = value;
  return fetch("/api/action", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-OTA-Key": otaKey },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
}

export function DeviceModal({ device, onClose }: DeviceModalProps) {
  const showToast = useToast();
  const { t } = useI18n();
  const [deviceState, setDeviceState] = useState<Device>(device);

  const otaData = useOtaKey();

  const deviceMeta = [
    deviceState.type_name,
    deviceState.manufacturer,
    deviceState.id,
  ]
    .filter(Boolean)
    .join(" · ");

  const [nameInput, setNameInput] = useState(deviceState.name);
  const [transitInput, setTransitInput] = useState(
    deviceState.transit_time_ms > 0
      ? Math.round(deviceState.transit_time_ms / 1000)
      : 0,
  );
  const [typeSelect, setTypeSelect] = useState(deviceState.type);
  const [mfrSelect, setMfrSelect] = useState(deviceState.manufacturer_id);

  const [isInverted, setIsInverted] = useState(
    deviceState.is_inverted || false,
  );
  const [isQuiet, setIsQuiet] = useState(deviceState.is_quiet || false);
  const [transitCalibrating, setTransitCalibrating] = useState(false);
  const calibrationStateRef = useRef<{
    startMs: number | null;
    extraBtns: HTMLElement[];
  }>({ startMs: null, extraBtns: [] });

  const hasPos =
    ["shutter", "venetian", "window", "gate"].indexOf(
      getDeviceGroup(deviceState),
    ) !== -1;
  const hasFav =
    ["shutter", "venetian", "window"].indexOf(getDeviceGroup(deviceState)) !==
    -1;

  function getDeviceGroup(d: Device): string {
    const SHUTTER = [
      "ROLLER_SHUTTER",
      "BLIND",
      "DUAL_SHUTTER",
      "AWNING",
      "HORIZONTAL_AWNING",
      "EXTERNAL_VENETIAN_BLIND",
      "CURTAIN_TRACK",
      "SWINGING_SHUTTER",
    ];
    const VENETIAN = ["VENETIAN_BLIND", "LOUVRE_BLIND"];
    const WINDOW = ["WINDOW_OPENER"];
    const GATE = ["GARAGE_OPENER", "GATE_OPENER", "ROLLING_DOOR_OPENER"];
    const type = (d.type_name || "UNKNOWN")
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
    if (SHUTTER.includes(type)) return "shutter";
    if (VENETIAN.includes(type)) return "venetian";
    if (WINDOW.includes(type)) return "window";
    if (GATE.includes(type)) return "gate";
    if (type === "ON_OFF_SWITCH") return "switch";
    if (type === "LIGHT") return d.subtype === 58 ? "switch" : "dimmer";
    return "readonly";
  }

  const handleSaveName = useCallback(async () => {
    const val = nameInput.trim();
    if (!val) {
      showToast(
        t("popup.rename_empty") || "Name cannot be empty.",
        ToastType.ERROR,
      );
      return;
    }
    if (val === deviceState.name) {
      onClose?.();
      return;
    }
    try {
      const r = await postAction(
        deviceState.id,
        "rename",
        otaData.data?.key as string,
        val,
      );
      if (!r.success) {
        showToast(
          r.message || t("popup.rename_failed") || "Rename failed.",
          ToastType.ERROR,
        );
        return;
      }
      showToast(
        r.message || t("popup.renamed") || "Renamed.",
        ToastType.SUCCESS,
      );
      setDeviceState((prev) => ({ ...prev, name: val }));
      onClose?.();
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [nameInput, deviceState, showToast, t, onClose]);

  const handleSaveTransitTime = useCallback(async () => {
    const v = parseInt(String(transitInput), 10);
    if (isNaN(v) || v < 1 || v > 300) {
      showToast("Enter 1–300 seconds.", ToastType.ERROR);
      return;
    }
    try {
      const r = await postAction(
        deviceState.id,
        "setTransitTime",
        otaData.data?.key as string,
        v,
      );
      if (!r.success) {
        showToast(r.message || "Save failed.", ToastType.ERROR);
        return;
      }
      setDeviceState((prev) => ({ ...prev, transit_time_ms: v * 1000 }));
      showToast(
        t("popup.transit_saved") || "Transition time saved.",
        ToastType.SUCCESS,
      );
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [transitInput, deviceState.id, showToast, t]);

  const handleCalibrate = useCallback(async () => {
    if (deviceState.protocol === "1w") {
      setTransitCalibrating(true);
      calibrationStateRef.current.startMs = null;
      // For 1W, manual calibration flow would go here
      // For now, simplified version
    } else {
      setTransitCalibrating(true);
      try {
        const r = await postAction(
          deviceState.id,
          "calibrate",
          otaData.data?.key as string,
        );
        if (!r.success) {
          showToast(r.message || "Calibration failed.", ToastType.ERROR);
        } else {
          showToast("Calibration started.", ToastType.INFO);
        }
      } catch (e) {
        showToast((e as Error).message, ToastType.ERROR);
      } finally {
        setTransitCalibrating(false);
      }
    }
  }, [deviceState, showToast]);

  const handleSaveDeviceType = useCallback(async () => {
    const v = parseInt(String(typeSelect), 10);
    try {
      const r = await postAction(
        deviceState.id,
        "setDeviceType",
        otaData.data?.key as string,
        v,
      );
      if (r.success) {
        setDeviceState((prev) => ({ ...prev, type: v }));
        showToast("Device type saved.", ToastType.SUCCESS);
        onClose?.();
      } else {
        showToast(r.message || "Failed.", ToastType.ERROR);
      }
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [typeSelect, deviceState.id, showToast, onClose]);

  const handleResetPosition = useCallback(
    async (value: 0 | 100) => {
      try {
        const r = await postAction(
          deviceState.id,
          "resetPosition1w",
          otaData.data?.key as string,
          value,
        );
        if (r.success) {
          setDeviceState((prev) => ({ ...prev, position: value }));
          showToast(
            `Position reset to ${value === 0 ? "open" : "closed"}.`,
            ToastType.SUCCESS,
          );
        } else {
          showToast(r.message || "Failed.", ToastType.ERROR);
        }
      } catch (e) {
        showToast((e as Error).message, ToastType.ERROR);
      }
    },
    [deviceState.id, showToast],
  );

  const handleSaveManufacturer = useCallback(async () => {
    const v = parseInt(String(mfrSelect), 10);
    try {
      const r = await postAction(
        deviceState.id,
        "setManufacturer",
        otaData.data?.key as string,
        v,
      );
      if (r.success) {
        setDeviceState((prev) => ({ ...prev, manufacturer_id: v }));
        showToast("Brand saved.", ToastType.SUCCESS);
      } else {
        showToast(r.message || "Failed.", ToastType.ERROR);
      }
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [mfrSelect, deviceState.id, showToast]);

  const handlePairingMode = useCallback(async () => {
    try {
      const r = await postAction(
        deviceState.id,
        "wink1w",
        otaData.data?.key as string,
      );
      if (r.success) {
        showToast(
          "Device entering pairing mode. Now pair your other remote.",
          ToastType.SUCCESS,
        );
      } else {
        showToast(r.message || "Failed.", ToastType.ERROR);
      }
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState.id, showToast]);

  const handleSetFavorite = useCallback(() => {
    if (deviceState.position < 0) return;
    setFavPos(deviceState.id, deviceState.position);
    showToast(
      t("popup.fav_saved")
        ? t("popup.fav_saved")!.replace("{pos}", String(deviceState.position))
        : `Favorite set to ${deviceState.position}%.`,
      ToastType.SUCCESS,
    );
  }, [deviceState, showToast, t]);

  const handleIdentify = useCallback(async () => {
    try {
      await postAction(deviceState.id, "identify", otaData.data?.key as string);
      showToast(
        t("popup.identifying") || "Identify sent — watch for a brief movement.",
        ToastType.INFO,
      );
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState.id, showToast, t]);

  const handleDeactivate = useCallback(async () => {
    if (
      !confirm(
        (t("confirm.deactivate_device") || 'Deactivate "{name}"?').replace(
          "{name}",
          deviceState.name,
        ) +
          "\n" +
          (t("popup.deactivate_warning") ||
            "The device will be kept as inactive and can be re-activated later."),
      )
    ) {
      return;
    }
    try {
      const r = await postAction(
        deviceState.id,
        "deactivateDevice",
        otaData.data?.key as string,
      );
      if (!r.success) {
        showToast(r.message || "Deactivate failed.", ToastType.ERROR);
        return;
      }
      showToast(
        t("popup.device_deactivated") || "Device deactivated.",
        ToastType.INFO,
      );
      onClose?.();
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState, showToast, t, onClose]);

  const handleUnpair = useCallback(async () => {
    try {
      const r = await postAction(
        deviceState.id,
        "sendremove1w",
        otaData.data?.key as string,
      );
      if (!r.success) {
        showToast(r.message || "Failed.", ToastType.ERROR);
        return;
      }
      showToast("REMOVE sent — device should confirm.", ToastType.INFO);
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState.id, showToast]);

  const handleDelete = useCallback(async () => {
    const deleteWarning =
      deviceState.protocol === "1w"
        ? t("popup.delete_warning_1w") ||
          "Removes from this controller only. Unpair first to free the remote slot on the device."
        : t("popup.delete_warning") ||
          "Permanent removal. Cannot be undone — requires factory reset to re-pair.";

    if (
      !confirm(
        (t("confirm.delete_device") || 'Permanently delete "{name}"?').replace(
          "{name}",
          deviceState.name,
        ) +
          "\n" +
          deleteWarning,
      )
    ) {
      return;
    }

    try {
      const doDelete = async () => {
        const r = await postAction(
          deviceState.id,
          "deleteDevice",
          otaData.data?.key as string,
        );
        if (!r.success) {
          showToast(r.message || "Delete failed.", ToastType.ERROR);
          return;
        }
        showToast(
          t("popup.device_deleted") || "Device permanently deleted.",
          ToastType.INFO,
        );
        onClose?.();
      };

      if (!deviceState.inactive) {
        await postAction(
          deviceState.id,
          "deactivateDevice",
          otaData.data?.key as string,
        );
      }
      await doDelete();
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState, showToast, t, onClose]);

  const handleInvertToggle = useCallback(async () => {
    try {
      const r = await postAction(
        deviceState.id,
        "invertOpenClose",
        otaData.data?.key as string,
      );
      if (!r.success) {
        showToast(r.message || "Invert failed.", ToastType.ERROR);
        return;
      }
      const newInverted = !isInverted;
      setIsInverted(newInverted);
      setDeviceState((prev) => ({ ...prev, is_inverted: newInverted }));
      showToast(
        t("popup.inverted") || "Direction inverted.",
        ToastType.SUCCESS,
      );
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState.id, isInverted, showToast, t]);

  const handleQuietToggle = useCallback(async () => {
    const newVal = !isQuiet;
    try {
      const r = await postAction(
        deviceState.id,
        "setQuiet",
        otaData.data?.key as string,
        newVal,
      );
      if (!r.success) {
        showToast(r.message || "Quiet mode failed.", ToastType.ERROR);
        return;
      }
      setIsQuiet(newVal);
      setDeviceState((prev) => ({ ...prev, is_quiet: newVal }));
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [deviceState.id, isQuiet, showToast]);

  return (
    <div id="device-edit-modal" class="open">
      <div class="dev-sheet">
        <div class="dev-sheet-handle"></div>
        <div class="dev-sheet-header">
          <div class="dev-sheet-title">
            <div class="dev-sheet-name" id="dev-sheet-name">
              {deviceState.name}
            </div>
            <div class="dev-sheet-meta" id="dev-sheet-meta">
              {deviceMeta}
            </div>
          </div>
          <button id="device-edit-close" aria-label="Close" onClick={onClose}>
            ×
           </button>
         </div>
         <div class="dev-sheet-body">
           <div class="dev-name-row">
            <input
              type="text"
              class="s-input"
              style="flex: 1 1 0%;"
              value={nameInput}
              onInput={(e) => setNameInput(e.currentTarget.value)}
            />
            <button
              class="s-btn primary"
              style="flex-shrink: 0;"
              onClick={handleSaveName}
            >
              {t("button.save") || "Save"}
            </button>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Position</div>
            </div>
            <div class="dev-row-right">
              <span style="font-size: 13px; color: var(--text2); font-family: var(--mono);">
                {deviceState.position >= 0
                  ? `${deviceState.position}% — Open`
                  : "Unknown"}
              </span>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Transition time</div>
              <div class="dev-row-sub">{transitInput || 10} s</div>
            </div>
            <div class="dev-row-right">
              <span style="font-size: 13px; color: var(--text2); margin-right: 8px; display: none;"></span>
              <input
                type="number"
                min="1"
                max="300"
                value={transitInput || ""}
                onInput={(e) =>
                  setTransitInput(parseInt(e.currentTarget.value, 10))
                }
                class="s-input"
                style="width: 64px;"
                placeholder="s"
              />
              <button class="s-btn primary" onClick={handleSaveTransitTime}>
                {t("button.save") || "Save"}
              </button>
              <button
                class="s-btn"
                onClick={handleCalibrate}
                disabled={transitCalibrating}
              >
                {transitCalibrating
                  ? "Calibrating…"
                  : t("popup.transit_calibrate") || "Calibrate"}
              </button>
              <button class="s-btn" style="display: none;" onClick={onClose}>
                {t("popup.transit_cancel") || "Cancel"}
              </button>
            </div>
          </div>
          {!deviceState.inactive && (
            <>
              {hasFav && deviceState.protocol !== "1w" && (
                <div class="dev-row">
                  <div>
                    <div class="dev-row-label">Invert open/close</div>
                    <div class="dev-row-sub">
                      Swap which end counts as fully open.
                    </div>
                  </div>
                  <div class="dev-row-right">
                    <div
                      class={`s-toggle${isInverted ? " on" : ""}`}
                      onClick={handleInvertToggle}
                    />
                  </div>
                </div>
              )}
              {hasPos && deviceState.protocol !== "1w" && (
                <div class="dev-row">
                  <div>
                    <div class="dev-row-label">Quiet mode</div>
                    <div class="dev-row-sub">
                      Slower, quieter motor operation.
                    </div>
                  </div>
                  <div class="dev-row-right">
                    <div
                      class={`s-toggle${isQuiet ? " on" : ""}`}
                      onClick={handleQuietToggle}
                    />
                  </div>
                </div>
              )}
              {deviceState.protocol !== "1w" && (
                <div class="dev-row">
                  <div>
                    <div class="dev-row-label">Identify</div>
                    <div class="dev-row-sub">
                      Triggers a brief movement to locate the device.
                    </div>
                  </div>
                  <div class="dev-row-right">
                    <button class="s-btn" onClick={handleIdentify}>
                      {t("button.identify") || "Identify"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Device type</div>
              <div class="dev-row-sub">
                Controls which buttons appear in the UI.
              </div>
            </div>
            <div class="dev-row-right">
              <select
                class="s-input"
                style="font-size: 12px; padding: 4px 8px;"
                value={typeSelect}
                onChange={(e) =>
                  setTypeSelect(parseInt(e.currentTarget.value, 10))
                }
              >
                {DEVICE_TYPES.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <button class="s-btn primary" onClick={handleSaveDeviceType}>
                {t("button.save") || "Save"}
              </button>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Reset position</div>
              <div class="dev-row-sub">
                Force estimated position to a known state.
              </div>
            </div>
            <div class="dev-row-right">
              <button class="s-btn" onClick={() => handleResetPosition(0)}>
                0% — Open
              </button>
              <button class="s-btn" onClick={() => handleResetPosition(100)}>
                100% — Closed
              </button>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Brand</div>
              <div class="dev-row-sub">Manufacturer of the device.</div>
            </div>
            <div class="dev-row-right">
              <select
                class="s-input"
                style="font-size: 12px; padding: 4px 8px;"
                value={mfrSelect}
                onChange={(e) =>
                  setMfrSelect(parseInt(e.currentTarget.value, 10))
                }
              >
                {MANUFACTURERS.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <button class="s-btn primary" onClick={handleSaveManufacturer}>
                {t("button.save") || "Save"}
              </button>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Put in pairing mode</div>
              <div class="dev-row-sub">
                Put the device in pairing acceptance mode so other remotes can
                pair with it.
              </div>
            </div>
            <div class="dev-row-right">
              <button class="s-btn" onClick={handlePairingMode}>
                {t("button.pair") || "Put in pairing mode"}
              </button>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Favorite position</div>
              <div class="dev-row-sub">
                {getFavPos(deviceState.id)
                  ? `Currently: ${getFavPos(deviceState.id)}%`
                  : "No favorite set."}
              </div>
            </div>
            <div class="dev-row-right">
              <button
                class="s-btn"
                onClick={handleSetFavorite}
                disabled={deviceState.position < 0}
              >
                {t("popup.fav_set_to")
                  ? t("popup.fav_set_to")!.replace(
                      "{pos}",
                      String(deviceState.position),
                    )
                  : `Set to ${deviceState.position}%`}
              </button>
            </div>
          </div>
          <div class="dev-danger-zone">
            <div class="dev-danger-label">
              {t("popup.device_danger_zone") || "Danger zone"}
            </div>
            {!deviceState.inactive && (
              <div class="dev-row">
                <div>
                  <div class="dev-row-label">Deactivate</div>
                  <div class="dev-row-sub">
                    {t("popup.deactivate_desc") ||
                      "Keeps device in list but removes controls. Reversible."}
                  </div>
                </div>
                <div class="dev-row-right">
                  <button class="s-btn danger" onClick={handleDeactivate}>
                    {t("button.deactivate") || "Deactivate"}
                  </button>
                </div>
              </div>
            )}
            {deviceState.protocol === "1w" && !deviceState.inactive && (
              <div class="dev-row">
                <div>
                  <div class="dev-row-label">Unpair</div>
                  <div class="dev-row-sub">
                    Send REMOVE frame to the device, then confirm it responded
                    before deleting from storage.
                  </div>
                </div>
                <div class="dev-row-right">
                  <button class="s-btn danger" onClick={handleUnpair}>
                    {t("button.unpair") || "Unpair device"}
                  </button>
                </div>
              </div>
            )}
            <div class="dev-row">
              <div>
                <div class="dev-row-label">Delete permanently</div>
                <div class="dev-row-sub">
                  {deviceState.protocol === "1w"
                    ? t("popup.delete_desc_1w") ||
                      "Removes from this controller. Unpair first to clear the slot from the device."
                    : t("popup.delete_warning") ||
                      "Cannot be undone. Requires factory reset to re-pair."}
                </div>
              </div>
              <div class="dev-row-right">
                <button class="s-btn danger" onClick={handleDelete}>
                  {t("button.delete") || "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
