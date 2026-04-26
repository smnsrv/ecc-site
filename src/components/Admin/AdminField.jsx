export default function AdminField({ label, hint, children }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {hint && <span className="admin-field-hint">{hint}</span>}
      {children}
    </label>
  );
}
