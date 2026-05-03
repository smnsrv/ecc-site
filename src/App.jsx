import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useData } from "./hooks/useData.js";
import { useFadeUp } from "./hooks/useFadeUp.js";
import { articleKeysFromData, buildHash, parseAppHash } from "./hashRoute.js";
import { computeDocumentTitle } from "./documentTitle.js";
import Topbar from "./components/Layout/Topbar.jsx";
import Nav from "./components/Layout/Nav.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./components/Pages/Home.jsx";
import Services from "./components/Pages/Services.jsx";
import WeCertifyPage from "./components/Pages/WeCertifyPage.jsx";
import About from "./components/Pages/About.jsx";
import Contacts from "./components/Pages/Contacts.jsx";
import ServiceTemplate from "./components/Pages/ServiceTemplate.jsx";
import CertificationStagesPage from "./components/Pages/CertificationStagesPage.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

const AdminPanel = lazy(() => import("./components/Admin/AdminPanel.jsx"));

function applyDesignTokens(design) {
  const r = document.documentElement;
  r.style.setProperty("--navy", design.navy);
  r.style.setProperty("--blue", design.blue);
  r.style.setProperty("--accent", design.accent);
  r.style.setProperty("--light", design.light);
}

export default function App() {
  const { data, setData, persist, reset } = useData();
  const keysFirst = articleKeysFromData(data.we_certify_articles);
  const r0 =
    typeof window !== "undefined"
      ? parseAppHash(window.location.hash, keysFirst)
      : { admin: false, page: "home", serviceId: null, articleKey: null, legacyHash: false };

  const [page, setPage] = useState(r0.admin ? "home" : r0.page);
  const [serviceId, setServiceId] = useState(r0.admin ? null : r0.serviceId);
  const [weArticleKey, setWeArticleKey] = useState(r0.admin ? null : r0.articleKey);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#/admin" || window.location.hash === "#admin" : false,
  );

  useEffect(() => {
    applyDesignTokens(data.design);
  }, [data.design]);

  useEffect(() => {
    const keys = articleKeysFromData(data.we_certify_articles);
    const apply = () => {
      const h = window.location.hash;
      if (h === "#/admin" || h === "#admin") {
        setAdminOpen(true);
        return;
      }
      setAdminOpen(false);
      const p = parseAppHash(h, keys);
      setPage(p.page);
      setServiceId(p.serviceId);
      setWeArticleKey(p.articleKey);
      if (p.legacyHash && p.articleKey) {
        const base = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, "", `${base}#/we-certify/${p.articleKey}`);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [data.we_certify_articles]);

  useEffect(() => {
    if (adminOpen) return;
    document.title = computeDocumentTitle(data, { page, serviceId, weArticleKey: weArticleKey });
  }, [data, page, serviceId, weArticleKey, adminOpen]);

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

  useFadeUp([page, adminOpen, weArticleKey]);

  const goPage = useCallback((target, opts = {}) => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (target === "admin") {
      window.location.hash = "#/admin";
      return;
    }
    const next = buildHash(target, opts);
    if (window.location.hash === next) return;
    window.location.hash = next;
  }, []);

  const openService = useCallback((service) => {
    if (!service?.id) return;
    goPage("service", { id: service.id });
  }, [goPage]);

  const selectedService = data.services.find((item) => item.id === serviceId) || null;

  useEffect(() => {
    if (page === "service" && serviceId != null && !selectedService) {
      window.location.hash = "#/services";
    }
  }, [page, serviceId, selectedService]);

  const closeAdmin = useCallback(() => {
    window.location.hash = "#/";
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
      {page === "we-certify" && (
        <WeCertifyPage
          data={data}
          onPage={goPage}
          detailArticleKey={weArticleKey}
          onOpenArticle={(key) => goPage("we-certify", { articleKey: key })}
          onCloseArticle={() => goPage("we-certify")}
        />
      )}
      {page === "service" && (
        <ServiceTemplate
          service={selectedService}
          services={data.services}
          onOpenService={openService}
          onBack={() => goPage("services")}
          onPage={goPage}
          breadcrumbParentLabel={data.ui.nav_services}
          breadcrumbAriaLabel={data.ui.breadcrumb_aria}
          allServicesLinkLabel={data.ui.services_all_link}
        />
      )}
      {page === "certification-stages" && <CertificationStagesPage data={data} />}
      {page === "about" && <About data={data} />}
      {page === "contacts" && <Contacts data={data} />}
      <Footer data={data} onPage={goPage} onOpenService={openService} />

      {!adminOpen && <ChatWidget data={data} onPage={goPage} />}

      {adminOpen && (
        <Suspense fallback={<div className="admin-suspense-fallback" aria-busy="true" />}>
          <AdminPanel
            data={data}
            setData={setData}
            onSave={persist}
            onReset={reset}
            onClose={closeAdmin}
            ui={data.ui}
          />
        </Suspense>
      )}
    </div>
  );
}
