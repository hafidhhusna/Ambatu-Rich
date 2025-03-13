import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
  { name: 'Food', value: 400, color: '#FFA500' },
  { name: 'Rent', value: 300, color: '#FF4500' },
  { name: 'Laundry', value: 200, color: '#800080' },
];
export function ExpenseChart() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        This Month Expense
      </h2>
      <div className="flex items-center justify-center gap-8 w-full">
        <ResponsiveContainer width={350} height={350}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={130} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 text-gray-900 dark:text-white text-sm w-40">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}