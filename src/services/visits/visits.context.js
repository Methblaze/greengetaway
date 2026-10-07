// Visits replace the 2023 SharedStateProvider, which held one attraction text
// and one date, so every new entry overwrote the last, and photos lived in a
// separate list with no link to the visit they belonged to.
//
// A visit is one record: { id, attractionId, date, photoUri }. The draft is
// the visit being logged right now, so the camera can attach its photo to it.
// Like the 2023 app, visits are kept in memory for the session.
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const VisitsContext = createContext(null);

const emptyDraft = () => ({ attractionId: null, date: new Date(), photoUri: null });

export const VisitsContextProvider = ({ children }) => {
  const [visits, setVisits] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);

  const updateDraft = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const resetDraft = useCallback(() => setDraft(emptyDraft()), []);

  const saveDraft = useCallback(() => {
    if (!draft.attractionId) return null;
    const visit = { id: `${Date.now()}`, ...draft };
    setVisits((v) => [visit, ...v]);
    setDraft(emptyDraft());
    return visit;
  }, [draft]);

  const value = useMemo(
    () => ({ visits, draft, updateDraft, resetDraft, saveDraft }),
    [visits, draft, updateDraft, resetDraft, saveDraft]
  );

  return <VisitsContext.Provider value={value}>{children}</VisitsContext.Provider>;
};

export const useVisits = () => {
  const context = useContext(VisitsContext);
  if (!context) throw new Error("useVisits must be used inside VisitsContextProvider");
  return context;
};
