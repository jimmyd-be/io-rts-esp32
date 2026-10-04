import { Device } from "../models/Types.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import useI18n from "../hooks/useI18n.tsx";
import { usePairingWizard } from "./modals/PairingWizard.tsx";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableDeviceCard } from "./SortableDeviceCard.tsx";
import { DeviceCard } from "./DeviceCard.tsx";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useOtaKey } from "../hooks/api/useOtaKey.tsx";
import { fetchDeviceOrder, saveDeviceOrder } from "../utils/RemoteApi.ts";

const ORDER_KEY = "device-order";

function loadOrder(): string[] {
  try {
    const v = localStorage.getItem(ORDER_KEY);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch {
    return [];
  }
}

function saveOrder(ids: string[]): void {
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface DevicesSectionProps {
  devices?: Device[];
}

export function DevicesSection({ devices }: DevicesSectionProps) {
  const [devicesState, setDevices] = useState<Device[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { t } = useI18n();
  const pairingWizard = usePairingWizard();
  const otaKey = useOtaKey();
  const orderRef = useRef<string[]>(loadOrder());

  useEffect(() => {
    fetchDeviceOrder().then((serverOrder) => {
      if (serverOrder.length > 0) {
        orderRef.current = serverOrder;
        saveOrder(serverOrder);
      }
    }).catch(() => {});
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );

  useEffect(() => {
    if (!devices) return;

    const order = orderRef.current;
    const orderMap = new Map(order.map((id, i) => [id, i]));
    const sorted = [...devices].sort((a, b) => {
      const ai = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
      const bi = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
      return ai - bi;
    });

    setDevices(sorted);
    setActiveCount(devices.filter((d) => !d.inactive).length);
  }, [devices]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDevices((prev) => {
      const oldIndex = prev.findIndex((d) => d.id === active.id);
      const newIndex = prev.findIndex((d) => d.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      orderRef.current = reordered.map((d) => d.id);
      saveOrder(orderRef.current);
      if (otaKey.data?.key) {
        saveDeviceOrder(otaKey.data.key, orderRef.current).catch(() => {});
      }
      return reordered;
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const countText = `${activeCount} ${t ? t("nav.devices") : "devices"}`;

  return (
    <>
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
          {!devices ? "Loading…" : countText}
        </span>

        <button
          className="view-add-btn"
          title="Pair new device"
          onClick={() => pairingWizard.open()}
        >
          +
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={devicesState.map((d) => d.id)} strategy={rectSortingStrategy}>
          <ul id="device-list">
            {!devicesState ? (
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
            ) : devicesState.length === 0 ? (
              <li
                style={{
                  padding: "20px",
                  color: "var(--text3)",
                  textAlign: "center",
                  gridColumn: "1 / -1",
                }}
              >
                {t ? t("list.no_devices_available") : "No devices available."}
              </li>
            ) : (
              devicesState.map((device) => (
                <SortableDeviceCard key={device.id} device={device} />
              ))
            )}
          </ul>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DeviceCard device={devicesState.find((d) => d.id === activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
