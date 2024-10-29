'use client';

import { useState } from 'react';
import { Invoice, InvoiceItem, Client } from '@/types/invoice';

interface InvoiceFormProps {
  clients: Client[];
  onSubmit: (invoice: Invoice) => Promise<void>;
}

export default function InvoiceForm({ clients, onSubmit }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>({
    user_id: '', // Will be set from auth
    client_id: '',
    invoice_number: '',
    status: 'draft',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 0,
    items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ],
  });

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoice.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount:
        field === 'quantity' || field === 'unit_price'
          ? Number(newItems[index].quantity) * Number(newItems[index].unit_price)
          : newItems[index].amount,
    };

    const { subtotal, taxAmount, total } = calculateTotals(newItems, invoice.tax_rate);

    setInvoice({
      ...invoice,
      items: newItems,
      subtotal,
      tax_amount: taxAmount,
      total,
    });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          amount: 0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    const { subtotal, taxAmount, total } = calculateTotals(newItems, invoice.tax_rate);

    setInvoice({
      ...invoice,
      items: newItems,
      subtotal,
      tax_amount: taxAmount,
      total,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            value={invoice.client_id}
            onChange={(e) => setInvoice({ ...invoice, client_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            value={invoice.invoice_number}
            onChange={(e) => setInvoice({ ...invoice, invoice_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Date</label>
          <input
            type="date"
            value={invoice.issue_date}
            onChange={(e) => setInvoice({ ...invoice, issue_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            value={invoice.due_date}
            onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Items</h3>
        {invoice.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                placeholder="Description"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                placeholder="Qty"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                placeholder="Price"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-span-1 text-right">${item.amount.toFixed(2)}</div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 hover:text-blue-800"
        >
          + Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
          <input
            type="number"
            value={invoice.tax_rate}
            onChange={(e) => {
              const newTaxRate = Number(e.target.value);
              const { subtotal, taxAmount, total } = calculateTotals(invoice.items, newTaxRate);
              setInvoice({
                ...invoice,
                tax_rate: newTaxRate,
                tax_amount: taxAmount,
                total,
              });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="space-y-2 text-right">
        <p>Subtotal: ${invoice.subtotal.toFixed(2)}</p>
        <p>Tax: ${invoice.tax_amount.toFixed(2)}</p>
        <p className="text-lg font-bold">Total: ${invoice.total.toFixed(2)}</p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Invoice
        </button>
      </div>
    </form>
  );
}
