import { useState, useEffect, useCallback } from "react";

const ICONS = {
  success: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  warning: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const STYLES = {
  success: {
    bg: "#f0fdf4",
    border: "#86efac",
    icon: "#16a34a",
    title: "#14532d",
    text: "#166534",
    progress: "#22c55e",
  },
  error: {
    bg: "#fff1f2",
    border: "#fda4af",
    icon: "#dc2626",
    title: "#7f1d1d",
    text: "#991b1b",
    progress: "#ef4444",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fcd34d",
    icon: "#d97706",
    title: "#78350f",
    text: "#92400e",
    progress: "#f59e0b",
  },
  info: {
    bg: "#eff6ff",
    border: "#93c5fd",
    icon: "#2563eb",
    title: "#1e3a8a",
    text: "#1d4ed8",
    progress: "#3b82f6",
  },
};

let notifyFn = null;

export function notify(options) {
  if (notifyFn) notifyFn(options);
}

function NotificationItem({ notification, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const s = STYLES[notification.type] || STYLES.info;
  const duration = notification.duration ?? 4000;
  const autoClose = notification.autoClose !== false;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (!autoClose) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        handleClose();
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onRemove(notification.id), 350);
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "12px",
        padding: "14px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        minWidth: "320px",
        maxWidth: "420px",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) scale(1)"
          : "translateX(40px) scale(0.96)",
        transition:
          "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)",
        willChange: "transform, opacity",
      }}
    >
      <span style={{ color: s.icon, flexShrink: 0, marginTop: "1px" }}>
        {ICONS[notification.type] || ICONS.info}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {notification.title && (
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "14px",
              fontWeight: 600,
              color: s.title,
              lineHeight: 1.4,
            }}
          >
            {notification.title}
          </p>
        )}
        {notification.message && (
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: s.text,
              lineHeight: 1.5,
            }}
          >
            {notification.message}
          </p>
        )}
        {notification.action && (
          <button
            onClick={() => {
              notification.action.onClick();
              handleClose();
            }}
            style={{
              marginTop: "8px",
              background: "transparent",
              border: `1px solid ${s.border}`,
              borderRadius: "6px",
              color: s.icon,
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        aria-label="Cerrar notificación"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: s.icon,
          opacity: 0.6,
          padding: "2px",
          flexShrink: 0,
          lineHeight: 1,
          fontSize: "18px",
        }}
      >
        ×
      </button>

      {autoClose && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "3px",
            width: `${progress}%`,
            background: s.progress,
            borderRadius: "0 0 0 12px",
            transition: "width 16ms linear",
            opacity: 0.7,
          }}
        />
      )}
    </div>
  );
}

export function NotificationContainer({ position = "top-right" }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((options) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type: "info", ...options }]);
  }, []);

  useEffect(() => {
    notifyFn = addNotification;
    return () => {
      notifyFn = null;
    };
  }, [addNotification]);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const positions = {
    "top-right": { top: "24px", right: "24px", alignItems: "flex-end" },
    "top-left": { top: "24px", left: "24px", alignItems: "flex-start" },
    "top-center": {
      top: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      alignItems: "center",
    },
    "bottom-right": {
      bottom: "24px",
      right: "24px",
      alignItems: "flex-end",
      flexDirection: "column-reverse",
    },
    "bottom-left": {
      bottom: "24px",
      left: "24px",
      alignItems: "flex-start",
      flexDirection: "column-reverse",
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        ...positions[position],
      }}
    >
      {notifications.map((n) => (
        <div key={n.id} style={{ pointerEvents: "auto" }}>
          <NotificationItem notification={n} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}