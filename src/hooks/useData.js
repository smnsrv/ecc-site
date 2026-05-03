import { useCallback, useMemo, useState } from "react";
import { DEFAULT_DATA } from "../data.js";

const STORAGE_KEY = "ecc_cms_data_react";

/** Сохраняем порядок и новые услуги из дефолта, подмешиваем правки из localStorage по id */
function mergeServicesById(defaults, stored) {
  if (!Array.isArray(stored) || !Array.isArray(defaults)) return defaults;
  const storedById = new Map(stored.map((s) => [Number(s.id), s]));
  return defaults.map((def) => {
    const s = storedById.get(Number(def.id));
    return s ? { ...def, ...s } : def;
  });
}

/** Новые карточки и поля из дефолта + правки из localStorage по id или title */
function mergeWeCertifyById(defaults, stored) {
  if (!Array.isArray(stored) || !Array.isArray(defaults)) return defaults;
  const byId = new Map(
    stored.filter((x) => x && x.id != null).map((x) => [String(x.id), x]),
  );
  return defaults.map((def) => {
    if (def.id != null && byId.has(String(def.id))) {
      const s = byId.get(String(def.id));
      return { ...def, ...s, articleKey: s.articleKey ?? def.articleKey };
    }
    const byTitle = stored.find((x) => x && x.title === def.title);
    return byTitle
      ? { ...def, ...byTitle, articleKey: byTitle.articleKey ?? def.articleKey }
      : def;
  });
}

function deepMerge(base, patch) {
  if (!patch || typeof patch !== "object") return base;
  if (Array.isArray(patch)) return patch;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = base[key];
    if (pv && typeof pv === "object" && !Array.isArray(pv)) {
      out[key] = deepMerge(bv && typeof bv === "object" && !Array.isArray(bv) ? bv : {}, pv);
    } else {
      out[key] = pv;
    }
  }
  return out;
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    const merged = deepMerge(structuredClone(DEFAULT_DATA), parsed);
    if (Array.isArray(parsed.services)) {
      merged.services = mergeServicesById(DEFAULT_DATA.services, parsed.services);
    }
    if (Array.isArray(parsed.we_certify)) {
      merged.we_certify = mergeWeCertifyById(DEFAULT_DATA.we_certify, parsed.we_certify);
    }
    if (merged.we_certify_household_article && !merged.we_certify_articles?.household) {
      merged.we_certify_articles = {
        ...(merged.we_certify_articles && typeof merged.we_certify_articles === "object"
          ? merged.we_certify_articles
          : {}),
        household: merged.we_certify_household_article,
      };
      delete merged.we_certify_household_article;
    }
    return merged;
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_DATA);
}

export function useData() {
  const [data, setData] = useState(() => loadData());

  const persist = useCallback(() => {
    saveData(data);
  }, [data]);

  const reset = useCallback(() => {
    if (!window.confirm("Сбросить все правки и вернуть данные по умолчанию?")) return;
    const fresh = resetData();
    setData(fresh);
  }, []);

  const api = useMemo(
    () => ({
      data,
      setData,
      persist,
      reset,
    }),
    [data, persist, reset],
  );

  return api;
}

export { STORAGE_KEY };
