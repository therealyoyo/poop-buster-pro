import { Navigate } from "react-router-dom";

// Cette page est un doublon de /admin/clients (CRM.tsx) avec des données fictives.
// On redirige vers la vraie page CRM.
export default function AdminClients() {
  return <Navigate to="/admin/clients" replace />;
}
