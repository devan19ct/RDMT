import React, { useEffect, useState } from "react";
import { getClients } from "../api/clients";
import useDebounce from "../hooks/useDebounce";
import { Link } from "react-router-dom";

export default function Clients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sortBy, setSortBy] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClients();
      const data = res.data;
      if (Array.isArray(data)) setItems(data);
      else if (data.items) setItems(data.items);
      else if (data.data && Array.isArray(data.data)) setItems(data.data);
      else setItems([]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const valA = a[sortBy]?.toString().toLowerCase() ?? "";
    const valB = b[sortBy]?.toString().toLowerCase() ?? "";
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const filteredItems = sortedItems.filter((c) =>
    [c.firstName, c.lastName, c.email].some((f) =>
      f?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  );

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredItems.length / pageSize);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>

        <div className="flex items-center gap-2">
          <Link
            to="/clients/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
          >
            + New Client
          </Link>
          <Link
            to="/invoices"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg text-sm font-medium"
          >
            Invoices
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("bytesymphony_token");
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              {["firstName", "lastName", "email", "createdAt"].map((field) => (
                <th
                  key={field}
                  onClick={() => toggleSort(field)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
                >
                  {field === "firstName" && "First Name"}
                  {field === "lastName" && "Last Name"}
                  {field === "email" && "Email"}
                  {field === "createdAt" && "Created At"}
                  {sortBy === field && (
                    <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedItems.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
            {paginatedItems.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.firstName}</td>
                <td className="px-4 py-2">{c.lastName}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2">
                  <Link
                    to={`/clients/${c.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded-lg ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Prev
          </button>

          <span>
            Page <strong>{page}</strong> of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded-lg ${
              page >= totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label>Show</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-2">
        Total: {filteredItems.length}
      </div>
    </div>
  );
}
