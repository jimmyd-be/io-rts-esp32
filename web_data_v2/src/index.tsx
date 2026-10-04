import { render } from "preact";
import { useEffect } from "preact/hooks";
import { LocationProvider, Route, Router } from "preact-iso";

import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { Devices } from "./pages/devices.tsx";
import { NotFound } from "./pages/_404.tsx";
import "./style.css";
import { Log } from "./pages/log";
import { Settings } from "./pages/settings";
import { FirmwareUpdater } from "./components/FirmwareUpdater";
import { ToastProvider } from "./components/ToastProvider";
import { InstallBanner } from "./components/InstallBanner";

export function App() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const main = document.querySelector("main");
      if (!main) return;
      if (!main.contains(e.target as Node)) {
        main.scrollTop += e.deltaY;
      }
    }
    document.addEventListener("wheel", onWheel, { passive: true });
    return () => document.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <ToastProvider>
      <LocationProvider>
        <Header />
        <FirmwareUpdater />
        <main>
          <Router>
            <Route path="/" component={Devices} />
            <Route path="/log" component={Log} />
            <Route path="/settings" component={Settings} />
            <Route default component={NotFound} />
          </Router>
        </main>
        <Footer />
        <InstallBanner />
      </LocationProvider>
    </ToastProvider>
  );
}

render(<App />, document.getElementById("app")!);
