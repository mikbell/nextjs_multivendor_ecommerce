"use client";

import { useEffect, useMemo, useState } from "react";

type AllowedRole = "USER" | "ADMIN" | "SELLER";

type UserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AllowedRole;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const roles: AllowedRole[] = useMemo(() => ["USER", "ADMIN", "SELLER"], []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data.users);
    } catch (e) {
      console.error(e);
      alert("Errore caricando gli utenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChangeRole = async (id: string, role: AllowedRole) => {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: id, role }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e) {
      console.error(e);
      alert("Errore aggiornando il ruolo");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="p-6">Caricamento...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Gestione Ruoli Utenti</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-md">
          <thead>
            <tr>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">Nome</th>
              <th className="text-left p-3 border-b">Cognome</th>
              <th className="text-left p-3 border-b">Ruolo</th>
              <th className="text-left p-3 border-b">Azione</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.firstName}</td>
                <td className="p-3">{u.lastName}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.role}
                    onChange={(e) => {
                      const role = e.target.value as AllowedRole;
                      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
                    }}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={saving === u.id}
                    onClick={() => onChangeRole(u.id, u.role)}
                  >
                    {saving === u.id ? "Salvataggio..." : "Salva"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
