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
  const duration = notification.duration ?? 4000;
  const autoClose = notification.autoClose !== false;

  const TYPES = {
    success: {
      icon: "ti-circle-check",
      accent: "#3B6D11",
      bg: "#EAF3DE",
      border: "#C0DD97",
      title: "#173404",
      text: "#3B6D11",
      progress: "#639922",
    },
    error: {
      icon: "ti-circle-x",
      accent: "#A32D2D",
      bg: "#FCEBEB",
      border: "#F7C1C1",
      title: "#501313",
      text: "#A32D2D",
      progress: "#E24B4A",
    },
    warning: {
      icon: "ti-alert-triangle",
      accent: "#854F0B",
      bg: "#FAEEDA",
      border: "#FAC775",
      title: "#412402",
      text: "#854F0B",
      progress: "#BA7517",
    },
    info: {
      icon: "ti-info-circle",
      accent: "#185FA5",
      bg: "#E6F1FB",
      border: "#B5D4F4",
      title: "#042C53",
      text: "#185FA5",
      progress: "#378ADD",
    },
  };

  const s = TYPES[notification.type] || TYPES.info;

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
        border: `1.5px solid ${s.border}`,
        borderRadius: "1.5rem",
        padding: "16px 18px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        minWidth: "300px",
        maxWidth: "400px",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.96)",
        transition: "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <i
        className={`ti ${s.icon}`}
        style={{ color: s.accent, fontSize: "20px", marginTop: "1px", flexShrink: 0 }}
        aria-hidden="true"
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {notification.title && (
          <p style={{
            margin: "0 0 2px",
            fontSize: "13px",
            fontWeight: 900,
            color: s.title,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: 1.4,
          }}>
            {notification.title}
          </p>
        )}
        {notification.message && (
          <p style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 600,
            color: s.text,
            lineHeight: 1.5,
          }}>
            {notification.message}
          </p>
        )}
        {notification.action && (
          <button
            onClick={() => { notification.action.onClick(); handleClose(); }}
            style={{
              marginTop: "10px",
              background: s.accent,
              border: "none",
              borderRadius: "0.75rem",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.85"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
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
          color: s.accent,
          opacity: 0.5,
          padding: "2px",
          flexShrink: 0,
          fontSize: "18px",
          lineHeight: 1,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => e.target.style.opacity = "1"}
        onMouseLeave={(e) => e.target.style.opacity = "0.5"}
      >
        ×
      </button>

      {autoClose && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: s.progress,
          borderRadius: "0 0 0 1.5rem",
          transition: "width 16ms linear",
          opacity: 0.6,
        }} />
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