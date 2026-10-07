// One app-wide toast, so a confirmation can outlive the screen that raised
// it (for example "Visit saved" while the app moves on to Profile).
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Toast } from "../../components/ui/Toast";
import { space } from "../../theme/tokens";

const ToastContext = createContext({ showToast: () => {} });

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const showToast = useCallback((m) => setMessage(m), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.host} pointerEvents="none">
        <Toast message={message} onHide={() => setMessage(null)} duration={3000} />
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  // Clear of the tab bar and its raised centre button.
  host: { position: "absolute", left: space.lg, right: space.lg, bottom: 96 },
});
