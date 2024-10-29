'use client';

import { Invoice } from '@/types/invoice';
import Link from 'next/link';

interface InvoiceListProps {
  invoices: Invoice[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  {invoice.invoice_number}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {invoice.client?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(invoice.due_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${invoice.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  {
                    draft: 'bg-gray-100 text-gray-800',
                    sent: 'bg-blue-100 text-blue-800',
                    paid: 'bg-green-100 text-green-800',
                    overdue: 'bg-red-100 text-red-800',
                    cancelled: 'bg-gray-100 text-gray-800',
                  }[invoice.status]
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/invoices/${invoice.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {/* Handle delete */}}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 