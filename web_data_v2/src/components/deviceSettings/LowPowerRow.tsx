import { useCallback } from "preact/hooks";
import { useOtaKey } from "../../hooks/api/useOtaKey.tsx";
import useI18n from "../../hooks/useI18n";
import { useToast } from "../../hooks/useToast";
import { ToastType } from "../ToastProvider";
import { DeviceRow } from "./DeviceRow";
import { DeviceRowProps, postAction } from "./shared";

export function LowPowerRow({ device, setDeviceState }: DeviceRowProps) {
  const showToast = useToast();
  const { t } = useI18n();
  const otaData = useOtaKey();

  const handleToggle = useCallback(async () => {
    const newVal = !device.is_low_power;
    try {
      const r = await postAction(
        device.id,
        "setLowPower",
        otaData.data?.key as string,
        newVal,
      );
      if (!r.success) {
        showToast(r.message || "Low power mode update failed.", ToastType.ERROR);
        return;
      }
      setDeviceState((prev) => ({ ...prev, is_low_power: newVal }));
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  }, [device.id, device.is_low_power, otaData.data?.key, setDeviceState, showToast]);

  if (device.inactive || device.protocol === "1w") {
    return null;
  }

  return (
    <DeviceRow
      label={t("label.low_power_mode") || "Low power mode"}
      subLabel={t("popup.low_power_desc") || "Enable for solar or battery-powered devices. Uses long preamble to wake the device."}
    >
      <div class={`s-toggle${device.is_low_power ? " on" : ""}`} onClick={handleToggle} />
    </DeviceRow>
  );
}
