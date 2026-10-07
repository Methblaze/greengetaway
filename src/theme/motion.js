// Motion respects the system's reduce-motion setting. On the web,
// react-native-web backs AccessibilityInfo with prefers-reduced-motion.
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export const duration = { enter: 240, exit: 180 };

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(!!v));
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => setReduced(!!v));
    return () => {
      alive = false;
      sub && sub.remove && sub.remove();
    };
  }, []);
  return reduced;
};
