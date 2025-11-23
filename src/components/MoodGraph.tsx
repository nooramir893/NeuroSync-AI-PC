import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Nov 14', energy: 65 },
  { day: 'Nov 15', energy: 55 },
  { day: 'Nov 16', energy: 50 },
  { day: 'Nov 17', energy: 85 },
  { day: 'Nov 18', energy: 35 },
  { day: 'Nov 19', energy: 60 },
  { day: 'Nov 20', energy: 75 },
];

export function MoodGraph() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="day" 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="url(#colorEnergy)"
            strokeWidth={3}
            dot={{ fill: '#14b8a6', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
