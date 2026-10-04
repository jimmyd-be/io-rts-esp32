import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeviceCard } from "./DeviceCard";
import type { Device } from "../models/Types";

interface SortableDeviceCardProps {
  device: Device;
}

export function SortableDeviceCard({ device }: SortableDeviceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: device.id });

  return (
    <DeviceCard
      device={device}
      sortableRef={setNodeRef}
      sortableStyle={{
        transform: CSS.Transform.toString(transform) ?? undefined,
        transition: transition ?? undefined,
        opacity: isDragging ? 0.4 : undefined,
        zIndex: isDragging ? 10 : undefined,
      }}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
