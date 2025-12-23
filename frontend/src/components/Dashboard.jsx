import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import HistoricalView from './HistoricalView';
import OngoingView from './OngoingView';
import { getApiUrl } from '../config';

function Dashboard() {
  const [view, setView] = useState('ongoing'); // 'historical' or 'ongoing'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [view]);

  const fetchStats = async () => {
    try {
      const statsType = view === 'historical' ? 'historical' : 'ongoing';
      console.log(`Fetching stats from /api/stats?type=${statsType}...`);
      const response = await fetch(getApiUrl(`/api/stats?type=${statsType}`));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received stats:', data);

      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Critical Card */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">CẦN CẢI THIỆN (CRITICAL)</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold text-white">
                  {loading ? '...' : stats?.critical || 0}
                </h3>
                <span className="text-red-400 text-sm">
                  ({loading ? '...' : stats?.critical_percentage || 0}%)
                </span>
              </div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Acceptable Card */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">CHẤP NHẬN ĐƯỢC</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold text-white">
                  {loading ? '...' : stats?.acceptable || 0}
                </h3>
                <span className="text-yellow-400 text-sm">
                  ({loading ? '...' : stats?.acceptable_percentage || 0}%)
                </span>
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Excellent Card */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">XUẤT SẮC</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold text-white">
                  {loading ? '...' : stats?.excellent || 0}
                </h3>
                <span className="text-green-400 text-sm">
                  ({loading ? '...' : stats?.excellent_percentage || 0}%)
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Xem tất cả</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? '...' : stats?.total || 0}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                {view === 'historical' ? 'Khóa học lịch sử' : 'Khóa học đang hoạt động'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span>
                {view === 'historical'
                  ? 'Phân bố Chất lượng Khóa học'
                  : 'Dự đoán sớm Chất lượng Khoá học Theo Giai đoạn'}
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {view === 'historical'
                ? 'Tổng hợp, thống kê và phân tích chất lượng các khóa học đã kết thúc, phục vụ đánh giá và cải tiến nội dung'
                : 'Theo dõi dự đoán và cảnh báo sớm của khóa học đang hoạt động qua các giai đoạn'}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView('historical')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'historical'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Historical Data
            </button>
            <button
              onClick={() => setView('ongoing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'ongoing'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Ongoing Prediction
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="mt-4">
          {view === 'historical' ? <HistoricalView /> : <OngoingView />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

