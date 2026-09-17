import { useState } from "preact/hooks";
import { AddRemoteModal } from "../components/Modals/AddRemote";
import { Modal } from "../components/Modal";

export function Devices() {


  return (
    <section class="view active" id="view-devices">
      <div class="view-header">
        <h2 class="view-title" data-i18n="nav.devices">
          Devices
        </h2>
        <span
          id="count-pill"
          style="font-size:11px;color:var(--text3);margin-right:auto;padding-left:8px;"
        ></span>
        <button
          class="view-add-btn"
          id="pair-device-btn"
          title="Pair new device"
        >
          +
        </button>
      </div>
      <ul id="device-list"></ul>

      <div id="remotes-section">
        <div id="remotes-section-hdr">
          <span id="remotes-section-title" data-i18n="section.remotes">
            Remotes
          </span>
          <div class="acc-summary" style="gap:8px;">
            <span id="remotes-count"></span>
            <button
              class="s-btn"
              id="remote-popup"
              // onClick={() => modal.open()}
            >
              + Add
            </button>
          </div>
          <div class="acc-chevron" id="remotes-chevron">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div id="remotes-body">
          <div class="remotes-panel">
            <table id="remote-table">
              <thead>
                <tr>
                  <th data-i18n="table.remote_id">ID</th>
                  <th data-i18n="table.linked_devices">Devices</th>
                  <th data-i18n="table.edit">Edit</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      {/*<Modal isOpen={modal.isOpen} onClose={modal.close}>*/}
      {/*  <AddRemoteModal modal={modal} />*/}
      {/*</Modal>*/}
    </section>
  );
}
