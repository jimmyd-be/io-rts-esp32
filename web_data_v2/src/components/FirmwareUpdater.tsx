import { useGithubReleases } from "../hooks/api/useGithubReleases";
import { useInfo } from "../hooks/api/useInfo";
import { useState, useEffect } from 'preact/hooks';


//TODO finish implementation of firmware updater, currently just a placeholder for the banner
export function FirmwareUpdater() {
  const api = useGithubReleases();
  const infoData = useInfo();

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (api.loaded && infoData.loaded && api.data && infoData.data) {
      const currentVersion = infoData.data.version;
      const latestVersion = api.data[0]?.tag_name;

      if (currentVersion !== latestVersion) {
        setShowBanner(true);
      }
    }

  }, [api.data, infoData.data]);

  return (
    <>
      {showBanner && (
        <div id="update-banner" style="">
          <div class="update-banner-inner">
            <div class="update-banner-info">
              <span class="update-banner-version" id="update-banner-version">
                Update available: Stable {api.data?.[0]?.tag_name}
              </span>
              <a
                class="update-banner-link"
                id="update-banner-link"
                target="_blank"
                rel="noopener"
                href={`https://github.com/rspaargaren/io-rts-esp32/releases/tag/${api.data?.[0]?.tag_name}`}
              >
                What's new
              </a>
            </div>
            <div class="update-banner-actions">
              <button class="update-banner-dismiss" id="update-dismiss">
                ✕
              </button>
              <button class="update-banner-btn" id="update-start-btn">
                Update
              </button>
            </div>
          </div>
          <div
            class="update-progress"
            id="update-progress"
            style="display:none;"
          >
            <div class="update-progress-label" id="update-progress-label">
              Downloading firmware…
            </div>
            <progress
              class="update-progress-bar"
              id="update-progress-bar"
              max="100"
              value="0"
            ></progress>
          </div>
        </div>
      )}
    </>
  );
}
