'use client';

import React from 'react';

const historyData = [
  { id: 1, type: 'Lorem', amount: 'Rp300.000,00', date: 'January 9, 2022', color: 'bg-green-500' },
  { id: 2, type: 'Ipsum', amount: 'Rp250.000,00', date: 'February 6, 2022', color: 'bg-purple-500' },
  { id: 3, type: 'Lorem', amount: 'Rp250.000,00', date: 'April 9, 2022', color: 'bg-green-500' },
  { id: 4, type: 'Lorem', amount: 'Rp250.000,00', date: 'May 13, 2022', color: 'bg-green-500' },
  { id: 5, type: 'Lorem', amount: 'Rp250.000,00', date: 'May 28, 2022', color: 'bg-green-500' },
  { id: 6, type: 'Ipsum', amount: 'Rp250.000,00', date: 'June 11, 2022', color: 'bg-purple-500' },
];

export function DashboardHistory() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">History</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Type of Expense</th>
            <th className="p-2">Amount</th>
            <th className="p-2">📅 Date</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color}`}></span> {item.id}
              </td>
              <td className="p-2">
                <span className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md">{item.type}</span>
              </td>
              <td className="p-2">{item.amount}</td>
              <td className="p-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
