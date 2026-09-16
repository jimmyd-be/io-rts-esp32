import { useState } from "preact/hooks";

export function AddRemoteModal({modal}) {
  const [type, setType] = useState<string>("");

  return (
    <div id="arm-modal" class="key-modal open">
      <div class="key-modal-inner arm-inner">
        <h3 id="arm-modal-title">popup.add_remote</h3>

        {type === "" && (
          <div id="arm-step-choose" style="">
            <p class="key-modal-warning-text" style="margin-bottom:16px;">
              How do you want to add the remote?
            </p>
            <div style="display:flex;gap:8px;">
              <button
                id="arm-btn-capture"
                class="btn-danger-confirm"
                style="flex:1;"
                onClick={() => setType("capture")}
              >
                Capture
              </button>
              <button
                id="arm-btn-manual"
                class="btn-ghost"
                style="flex:1;"
                onClick={() => setType("manually")}
              >
                Enter manually
              </button>
              <button
                id="arm-btn-cancel"
                class="btn-ghost"
                style="flex:1;"
                onClick={() => setType("cancel")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {type === "capture" && (
          <div id="arm-step-capture">
            <div class="arm-capture-row">
              <p id="arm-capture-status" class="key-modal-warning-text">
                Press any button on the remote…
              </p>
              <span id="arm-countdown" class="arm-countdown">
                30s
              </span>
            </div>
            <div class="key-modal-actions">
              <button id="arm-capture-cancel" class="btn-ghost">
                Cancel
              </button>
              <button id="arm-skip-btn" class="btn-ghost">
                Enter manually
              </button>
              <button
                id="arm-retry-btn"
                class="btn-ghost"
                style="display:none;"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {type === "manually" && (
          <div id="arm-step-manual">
            <label class="key-modal-label">Remote ID (6 hex characters):</label>
            <input
              type="text"
              id="arm-manual-input"
              maxlength="6"
              class="key-modal-input"
              placeholder="A1B2C3"
              autocomplete="off"
              style="font-family:var(--mono);text-transform:uppercase;letter-spacing:0.1em;"
            />
            <p
              id="arm-manual-error"
              class="key-modal-status"
              style="color:var(--red);min-height:18px;"
            ></p>
            <div class="key-modal-actions">
              <button
                id="arm-manual-cancel"
                class="btn-ghost"
                onClick={() => modal.close()}
              >
                Cancel
              </button>
              <button id="arm-manual-back" class="btn-ghost" onClick={() => setType("")}>
                Back
              </button>
              <button id="arm-manual-next" class="btn-danger-confirm" onClick={() => setType("link")}>
                Next
              </button>
            </div>
          </div>
        )}

        {type === "link" &&  <div id="arm-step-devices">
          <p
            id="arm-remote-id-label"
            class="key-modal-warning-text"
            style="display:none;margin-bottom:10px;font-weight:600;"
          ></p>
          <label class="key-modal-label">Link to devices:</label>
          <div id="arm-device-list" class="arm-device-list"></div>
          <p
            id="arm-devices-error"
            class="key-modal-status"
            style="color:var(--red);min-height:18px;"
          ></p>
          <div class="key-modal-actions">
            <button
              id="arm-delete-btn"
              class="btn-ghost arm-delete-btn"
              style="display:none;"
            >
              Delete
            </button>
            <button
              id="arm-devices-back"
              class="btn-ghost"
              onClick={() => setType("")}
            >
              Back
            </button>
            <button id="arm-save-btn" class="btn-danger-confirm">
              Save
            </button>
          </div>
        </div> }
      </div>
    </div>
  );
}
