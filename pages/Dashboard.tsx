import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Staff, Department } from '../types';
import Loading from '../components/Loading';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Users, Building2, UserCheck, UserX } from 'lucide-react';

const COLORS = ['#6366f1', '#64748b'];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    inactiveStaff: 0,
    totalDepartments: 0,
    recentStaff: [] as Staff[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [staffRes, deptRes] = await Promise.all([
          api.get('/staff'),
          api.get('/department')
        ]);

        const staffList: Staff[] = staffRes.data.data || staffRes.data || [];
        const deptList: Department[] = deptRes.data.data || deptRes.data || [];

        const active = staffList.filter(s => s.status === 'active').length;
        const inactive = staffList.filter(s => s.status === 'inactive').length;

        setStats({
          totalStaff: staffList.length,
          activeStaff: active,
          inactiveStaff: inactive,
          totalDepartments: deptList.length,
          recentStaff: staffList.slice(-5).reverse() // Last 5 added
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const pieData = [
    { name: 'Active', value: stats.activeStaff },
    { name: 'Inactive', value: stats.inactiveStaff },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center">
          <div className="p-3 bg-indigo-900/50 rounded-lg text-indigo-400 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Staff</p>
            <p className="text-2xl font-bold text-white">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center">
          <div className="p-3 bg-green-900/50 rounded-lg text-green-400 mr-4">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Active Staff</p>
            <p className="text-2xl font-bold text-white">{stats.activeStaff}</p>
          </div>
        </div>

         <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center">
          <div className="p-3 bg-red-900/50 rounded-lg text-red-400 mr-4">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Inactive Staff</p>
            <p className="text-2xl font-bold text-white">{stats.inactiveStaff}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center">
          <div className="p-3 bg-purple-900/50 rounded-lg text-purple-400 mr-4">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Departments</p>
            <p className="text-2xl font-bold text-white">{stats.totalDepartments}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Staff Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Staff */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Recently Added Staff</h2>
          <div className="space-y-4">
            {stats.recentStaff.length > 0 ? (
              stats.recentStaff.map((staff) => (
                <div key={staff._id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-indigo-400 font-bold border border-gray-600">
                      {staff.firstName[0]}{staff.lastName[0]}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{staff.firstName} {staff.lastName}</p>
                      <p className="text-xs text-gray-400">{staff.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    staff.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {staff.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent staff found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;