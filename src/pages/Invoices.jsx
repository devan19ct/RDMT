import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
// import { getInvoices } from "../api/invoice";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await API.get("/api/clients");
      setClients(
        Array.isArray(res.data)
          ? res.data
          : res.data.items ?? res.data.data ?? []
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (clientId) params.clientId = clientId;
      if (status) params.status = status;
      const res = await API.get("/api/invoices", { params });
      setInvoices(
        Array.isArray(res.data)
          ? res.data
          : res.data.items ?? res.data.data ?? []
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);


  //Dummy data for testing

//   export default function Invoices() {
//   const [invoices, setInvoices] = useState([]);
//   const [clients, setClients] = useState([
//     { id: 1, firstName: "John", lastName: "Doe" },
//     { id: 2, firstName: "Jane", lastName: "Smith" },
//   ]); // 👈 mock clients too
//   const [clientId, setClientId] = useState("");
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const data = await getInvoices({ clientId, status });
//       setInvoices(data);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Invoices</h2>
        <Link
          to="/clients"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Clients
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Client</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <button
          onClick={fetchInvoices}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="px-6 py-3">Invoice No</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3 text-right">Subtotal</th>
                <th className="px-6 py-3 text-right">Tax</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {new Date(inv.invoiceDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-3 font-medium ${
                        inv.status === "Paid"
                          ? "text-green-600"
                          : inv.status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {inv.status}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {inv.clientName || inv.clientId}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      ₹{inv.subtotal?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      ₹{inv.taxAmount?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">
                      ₹{inv.total?.toFixed(2) ?? "0.00"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
