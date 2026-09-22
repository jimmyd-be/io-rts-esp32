import { Device } from "../../models/Types.ts";

interface DeviceModalProps {
  device: Device;
  onClose?: () => void;
}

export function DeviceModal({ device, onClose }: DeviceModalProps) {
  const deviceMeta = [device.type_name, device.manufacturer, device.id]
    .filter(Boolean)
    .join(" · ");

  return (
    <div id="device-edit-modal" class="open">
      <div class="dev-sheet">
        <div class="dev-sheet-handle"></div>
        <div class="dev-sheet-header">
          <div class="dev-sheet-title">
            <div class="dev-sheet-name" id="dev-sheet-name">
              {device.name}
            </div>
            <div class="dev-sheet-meta" id="dev-sheet-meta">
              {deviceMeta}
            </div>
          </div>
          <button id="device-edit-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div id="dev-sheet-body">
          <div class="dev-name-row">
            <input type="text" class="s-input" style="flex: 1 1 0%;"
            value={device.name}/>
            <button class="s-btn primary" style="flex-shrink: 0;">
              Save
            </button>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Position</div>
            </div>
            <div class="dev-row-right">
              <span style="font-size: 13px; color: var(--text2); font-family: var(--mono);">
                0% — Open
              </span>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Transition time</div>
              <div class="dev-row-sub">10 s</div>
            </div>
            <div class="dev-row-right">
              <span style="font-size: 13px; color: var(--text2); margin-right: 8px; display: none;"></span>
              <input
                type="number"
                min="1"
                value={device.transition_time}
                max="300"
                class="s-input"
                style="width: 64px;"
                placeholder="s"
              />
              <button class="s-btn primary">Save</button>
              <button class="s-btn ">Calibrate</button>
              <button class="s-btn " style="display: none;">
                Cancel
              </button>
            </div>
          </div>
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
                value={device.type}
              >
                <option value="2">Roller shutter</option>
                <option value="1">Venetian blind</option>
                <option value="10">Blind</option>
                <option value="13">Dual shutter</option>
                <option value="3">Awning</option>
                <option value="16">Horizontal awning</option>
                <option value="24">Swinging shutter</option>
                <option value="4">Window opener</option>
                <option value="5">Garage opener</option>
                <option value="7">Gate opener</option>
                <option value="8">Rolling door opener</option>
                <option value="6">Light</option>
                <option value="15">On/off switch</option>
                <option value="9">Lock</option>
                <option value="0">Unknown</option>
              </select>
              <button class="s-btn primary">Save</button>
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
              <button class="s-btn ">0% — Open</button>
              <button class="s-btn ">100% — Closed</button>
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
                value={device.manufacturer_id}
              >
                <option value="2">Somfy</option>
                <option value="1">Velux</option>
                <option value="3">Honeywell</option>
                <option value="4">Hörmann</option>
                <option value="5">Assa Abloy</option>
                <option value="6">Niko</option>
                <option value="7">Window Master</option>
                <option value="8">Renson</option>
                <option value="11">Overkiz</option>
                <option value="12">Atlantic Group</option>
                <option value="0">Unknown</option>
              </select>
              <button class="s-btn primary">Save</button>
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
              <button class="s-btn ">Put in pairing mode</button>
            </div>
          </div>
          <div class="dev-row">
            <div>
              <div class="dev-row-label">Favorite position</div>
              <div class="dev-row-sub">No favorite set.</div>
            </div>
            <div class="dev-row-right">
              <button class="s-btn ">Set to 0%</button>
            </div>
          </div>
          <div class="dev-danger-zone">
            <div class="dev-danger-label">Danger zone</div>
            <div class="dev-row">
              <div>
                <div class="dev-row-label">Deactivate</div>
                <div class="dev-row-sub">
                  Keeps device in list but removes controls. Reversible.
                </div>
              </div>
              <div class="dev-row-right">
                <button class="s-btn danger">Deactivate</button>
              </div>
            </div>
            <div class="dev-row">
              <div>
                <div class="dev-row-label">Unpair</div>
                <div class="dev-row-sub">
                  Send REMOVE frame to the device, then confirm it responded
                  before deleting from storage.
                </div>
              </div>
              <div class="dev-row-right">
                <button class="s-btn danger">Unpair device</button>
              </div>
            </div>
            <div class="dev-row">
              <div>
                <div class="dev-row-label">Delete permanently</div>
                <div class="dev-row-sub">
                  Removes from this controller. Unpair first to clear the slot
                  from the device.
                </div>
              </div>
              <div class="dev-row-right">
                <button class="s-btn danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
