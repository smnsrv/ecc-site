import { useCallback, useMemo, useState } from "react";
import { DEFAULT_DATA } from "../data.js";

const STORAGE_KEY = "ecc_cms_data_react";

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
    return deepMerge(structuredClone(DEFAULT_DATA), parsed);
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
