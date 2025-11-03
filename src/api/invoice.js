//dummy data

const invoices = [
  {
    id: 1,
    invoiceNo: "INV-001",
    invoiceDate: "2025-11-01",
    status: "Paid",
    clientId: 1,
    clientName: "John Doe",
    subtotal: 5000,
    taxAmount: 900,
    total: 5900,
  },
  {
    id: 2,
    invoiceNo: "INV-002",
    invoiceDate: "2025-10-15",
    status: "Pending",
    clientId: 2,
    clientName: "Jane Smith",
    subtotal: 2500,
    taxAmount: 450,
    total: 2950,
  },
];

export async function getInvoices({ clientId, status } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = invoices;
      if (clientId) filtered = filtered.filter(i => i.clientId === Number(clientId));
      if (status) filtered = filtered.filter(i => i.status === status);
      resolve(filtered);
    }, 300);
  });
}

export async function createInvoice(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInvoice = { id: invoices.length + 1, ...data };
      invoices.push(newInvoice);
      resolve(newInvoice);
    }, 300);
  });
}

export async function deleteInvoice(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = invoices.findIndex(i => i.id === id);
      if (index !== -1) invoices.splice(index, 1);
      resolve({ message: "Invoice deleted" });
    }, 300);
  });
}
