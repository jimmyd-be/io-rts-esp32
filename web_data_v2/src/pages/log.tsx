export function Log() {
  return (
    <section class="view active" id="view-log">
      <div class="view-header">
        <h2 class="view-title" data-i18n="nav.help">
          Log
        </h2>
      </div>
      <div class="log-toolbar">
        <button
          class="log-filter-btn active"
          data-filter="all"
          data-i18n="filter.all"
        >
          All
        </button>
        <button
          class="log-filter-btn"
          data-filter="info"
          data-i18n="filter.info"
        >
          Info
        </button>
        <button class="log-filter-btn" data-filter="off" data-i18n="filter.off">
          Off
        </button>
      </div>
      <div id="status-messages"></div>
    </section>
  );
}
