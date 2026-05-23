// utils/events.ts
export const triggerDashboardRefresh = () => {
  console.log("🔄 Triggering dashboard refresh event");
  window.dispatchEvent(new CustomEvent("refreshDashboard"));
};

export const onDashboardRefresh = (callback: () => void) => {
  console.log("📡 Registering dashboard refresh listener");
  window.addEventListener("refreshDashboard", callback);
  return () => {
    console.log("🗑️ Removing dashboard refresh listener");
    window.removeEventListener("refreshDashboard", callback);
  };
};
