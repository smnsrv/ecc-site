import { useCallback, useEffect, useState } from "react";
import { useData } from "./hooks/useData.js";
import { useFadeUp } from "./hooks/useFadeUp.js";
import Topbar from "./components/Layout/Topbar.jsx";
import Nav from "./components/Layout/Nav.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./components/Pages/Home.jsx";
import Services from "./components/Pages/Services.jsx";
import About from "./components/Pages/About.jsx";
import Contacts from "./components/Pages/Contacts.jsx";
import ServiceTemplate from "./components/Pages/ServiceTemplate.jsx";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

function applyDesignTokens(design) {
  const r = document.documentElement;
  r.style.setProperty("--navy", design.navy);
  r.style.setProperty("--blue", design.blue);
  r.style.setProperty("--accent", design.accent);
  r.style.setProperty("--light", design.light);
}

export default function App() {
  const { data, setData, persist, reset } = useData();
  const [page, setPage] = useState("home");
  const [serviceId, setServiceId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() => window.location.hash === "#/admin");

  useEffect(() => {
    applyDesignTokens(data.design);
  }, [data.design]);

  useEffect(() => {
    const syncHash = () => setAdminOpen(window.location.hash === "#/admin");
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  /** Горячая клавиша Ctrl+Shift+A — открыть админку */
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        window.location.hash = "#/admin";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFadeUp([page, adminOpen]);

  const goPage = useCallback((target) => {
    setPage(target);
    if (target !== "service") setServiceId(null);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openService = useCallback((service) => {
    if (!service?.id) return;
    setServiceId(service.id);
    setPage("service");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectedService = data.services.find((item) => item.id === serviceId) || null;

  const closeAdmin = useCallback(() => {
    if (window.location.hash === "#/admin") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setAdminOpen(false);
  }, []);

  return (
    <div className="app-root">
      <Topbar data={data} />
      <Nav
        data={data}
        page={page === "service" ? "services" : page}
        onPage={goPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {page === "home" && <Home data={data} onPage={goPage} onOpenService={openService} />}
      {page === "services" && <Services data={data} onPage={goPage} onOpenService={openService} />}
      {page === "service" && (
        <ServiceTemplate
          service={selectedService}
          onBack={() => goPage("services")}
          onPage={goPage}
        />
      )}
      {page === "about" && <About data={data} />}
      {page === "contacts" && <Contacts data={data} />}
      <Footer data={data} onPage={goPage} />

      {!adminOpen && <ChatWidget data={data} onPage={goPage} />}

      {adminOpen && (
        <AdminPanel
          data={data}
          setData={setData}
          onSave={persist}
          onReset={reset}
          onClose={closeAdmin}
          ui={data.ui}
        />
      )}
    </div>
  );
}
