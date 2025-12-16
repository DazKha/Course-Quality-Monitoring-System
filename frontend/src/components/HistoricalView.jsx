import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, X, BarChart3, Users, MessageSquare, Eye, TrendingUp } from 'lucide-react';

function HistoricalView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterLabel, setFilterLabel] = useState('all'); // 'all' | 'Needs Improvement' | 'Acceptable' | 'Excellent'
 
  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      console.log('Fetching historical data from /api/historical-data...');
      const response = await fetch('/api/historical-data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const courses = await response.json();
      console.log(`Received ${courses.length} courses from API`);
      
      if (courses.length === 0) {
        console.warn('Warning: API returned empty array');
      } else {
        console.log('Sample course:', courses[0]);
      }
      
      setData(courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      console.error('Error details:', error.message);
      setLoading(false);
    }
  };

  // Use useMemo to optimize data processing
  const { needsImprovement, acceptable, excellent, pieDataWithPercentage } = useMemo(() => {
    const needs = data.filter(c => c.CQS === 'Needs Improvement');
    const accept = data.filter(c => c.CQS === 'Acceptable');
    const excel = data.filter(c => c.CQS === 'Excellent');
    
    const pieData = [
      { name: 'Needs Imp.', value: needs.length, color: '#ef4444' },
      { name: 'Acceptable', value: accept.length, color: '#f97316' },
      { name: 'Excellent', value: excel.length, color: '#22c55e' }
    ];

    const total = data.length;
    const pieWithPercentage = pieData.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
    }));

    return {
      needsImprovement: needs,
      acceptable: accept,
      excellent: excel,
      pieDataWithPercentage: pieWithPercentage
    };
  }, [data]);

  // Filtered data for course table (memoized)
  const filteredData = useMemo(() => {
    return filterLabel === 'all'
      ? data
      : data.filter(course => course.CQS === filterLabel);
  }, [data, filterLabel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const course = payload[0].payload;
      const color = getPredictionColor(course.CQS);
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-2xl max-w-xs">
          <p className="text-white font-semibold mb-2 text-sm truncate">{course.course_name}</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Học viên:</span>
              <span className="text-white font-medium">{course.enrollment_count?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">CQ Score:</span>
              <span className="text-blue-400 font-medium">{course.course_quality_score?.toFixed(3) || '0.000'}</span>
            </div>
            <div className="border-t border-slate-700 pt-1.5 mt-1.5">
              <span 
                className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}`
                }}
              >
                {course.CQS}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Helper functions
  const getPredictionColor = (cqs) => {
    if (cqs === 'Needs Improvement') return '#ef4444';
    if (cqs === 'Acceptable') return '#f97316';
    if (cqs === 'Excellent') return '#22c55e';
    return '#64748b';
  };

  const openCourseDetail = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Charts Section */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scatter Chart */}
          <div className="w-full h-[420px] flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Phân bố Chất lượng Khoá học</span>
            </h3>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    type="number"
                    dataKey="course_quality_score"
                    name="CQ Score"
                    domain={[0, 'auto']}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    label={{ 
                      value: 'Course Quality Score', 
                      position: 'insideBottom', 
                      offset: -5,
                      style: { fill: '#94a3b8', fontSize: 12 }
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="learning_interaction_score"
                    name="LI Score"
                    domain={[0, 'auto']}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    label={{ 
                      value: 'LI Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#94a3b8', fontSize: 12 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Needs Imp." 
                    data={needsImprovement} 
                    fill="#ef4444" 
                    opacity={0.7}
                  />
                  <Scatter 
                    name="Acceptable" 
                    data={acceptable} 
                    fill="#f97316" 
                    opacity={0.7}
                  />
                  <Scatter 
                    name="Excellent" 
                    data={excellent} 
                    fill="#22c55e" 
                    opacity={0.7}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="w-full h-[420px] flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Tỷ lệ Phân lớp</span>
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataWithPercentage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={110}
                    innerRadius={65}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieDataWithPercentage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
                            <p className="text-white font-semibold text-sm">{item.name}</p>
                            <p className="text-slate-300 text-xs">
                              Số lượng: {item.value}
                            </p>
                            <p className="text-slate-300 text-xs">
                              Tỷ lệ: {item.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Legend chung cho cả 2 biểu đồ */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-slate-800">
          {pieDataWithPercentage.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-slate-300 text-sm">{item.name}</span>
              <span className="text-slate-500 text-xs">({item.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        {/* Header with Filters */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Chi tiết Khóa học Lịch sử</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Hiển thị {filteredData.length} / {data.length} khóa học
              </p>
            </div>
            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-xs mr-1">Lọc:</span>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterLabel === 'all'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                onClick={() => setFilterLabel('all')}
              >
                Tất cả
              </button>
              {[
                { key: 'Needs Improvement', label: 'Needs Imp.', color: '#ef4444' },
                { key: 'Acceptable', label: 'Acceptable', color: '#f97316' },
                { key: 'Excellent', label: 'Excellent', color: '#22c55e' }
              ].map(opt => (
                <button
                  key={opt.key}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                  style={{
                    backgroundColor: filterLabel === opt.key ? `${opt.color}20` : '#1e293b',
                    color: filterLabel === opt.key ? opt.color : '#cbd5e1',
                    borderColor: filterLabel === opt.key ? opt.color : '#334155',
                    boxShadow: filterLabel === opt.key ? `0 0 15px ${opt.color}30` : 'none'
                  }}
                  onClick={() => setFilterLabel(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>
          <table className="w-full">
            <thead className="bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Học viên</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>CQ Score</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Phân loại
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map((course) => {
                const predictionColor = getPredictionColor(course.CQS);
                
                return (
                  <tr 
                    key={course.course_id} 
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => openCourseDetail(course)}
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                          {course.course_name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">{course.course_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-300 text-sm font-medium">
                        {course.enrollment_count?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-blue-400 text-sm font-mono">
                        {course.course_quality_score?.toFixed(3) || '0.000'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${predictionColor}15`,
                          color: predictionColor,
                          border: `1px solid ${predictionColor}50`
                        }}
                      >
                        {course.CQS}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="text-slate-400">
                      <p className="text-sm">Không tìm thấy khóa học nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Course Detail Modal */}
    {selectedCourse && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={closeCourseDetail}
      >
        <div 
          className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl transform scale-95 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedCourse.course_name}</h2>
              <p className="text-slate-400 text-sm mt-1">ID: {selectedCourse.course_id}</p>
            </div>
            <button
              onClick={closeCourseDetail}
              className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quality Classification Badge */}
            <div className="flex items-center justify-center">
              {(() => {
                const color = getPredictionColor(selectedCourse.CQS);
                return (
                  <div 
                    className="px-6 py-3 rounded-xl text-xl font-bold flex items-center space-x-3"
                    style={{ 
                      backgroundColor: `${color}20`,
                      color: color,
                      border: `2px solid ${color}`
                    }}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>{selectedCourse.CQS}</span>
                  </div>
                );
              })()}
            </div>

            {/* Main Metrics */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Điểm số Chất lượng</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                  <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">Course Quality Score</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {selectedCourse.course_quality_score?.toFixed(3) || '0.000'}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                  <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">Số học viên</div>
                  <div className="text-3xl font-bold text-white flex items-center space-x-2">
                    <Users className="w-6 h-6 text-slate-400" />
                    <span>{selectedCourse.enrollment_count?.toLocaleString() || 0}</span>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                  <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">Người tương tác</div>
                  <div className="text-3xl font-bold text-white">
                    {selectedCourse.n_users_content_interaction?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </section>

            {/* Engagement Metrics */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span>Hoạt động Tương tác</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <div className="text-slate-400 text-xs">Comments</div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCourse.comments_total?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <div className="text-slate-400 text-xs">Views</div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCourse.views_total?.toLocaleString() || 0}
                  </div>
                </div>
                {selectedCourse.pos_count !== null && (
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <div className="text-slate-400 text-xs">Positive</div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {selectedCourse.pos_count || 0}
                    </div>
                  </div>
                )}
                {selectedCourse.neg_count !== null && (
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <X className="w-4 h-4 text-red-400" />
                      <div className="text-slate-400 text-xs">Negative</div>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                      {selectedCourse.neg_count || 0}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Insights */}
            <section className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span>Phân tích & Nhận xét</span>
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="flex items-start space-x-2">
                  <span className="text-slate-500 mt-0.5">•</span>
                  <span>Dữ liệu từ khóa học đã hoàn thành trong hệ thống</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="text-slate-500 mt-0.5">•</span>
                  <span>Phân loại chất lượng dựa trên Course Quality Score</span>
                </p>
                {selectedCourse.CQS === 'Excellent' && (
                  <p className="flex items-start space-x-2 text-green-400 font-medium mt-3">
                    <span>✓</span>
                    <span>Khóa học có chất lượng xuất sắc, có thể dùng làm mẫu chuẩn (benchmark)</span>
                  </p>
                )}
                {selectedCourse.CQS === 'Acceptable' && (
                  <p className="flex items-start space-x-2 text-orange-400 font-medium mt-3">
                    <span>→</span>
                    <span>Khóa học đạt tiêu chuẩn chất lượng, vẫn có thể cải thiện thêm</span>
                  </p>
                )}
                {selectedCourse.CQS === 'Needs Improvement' && (
                  <p className="flex items-start space-x-2 text-red-400 font-medium mt-3">
                    <span>⚠</span>
                    <span>Khóa học cần cải thiện để nâng cao chất lượng và trải nghiệm học viên</span>
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900 px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
            <button
              onClick={closeCourseDetail}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default HistoricalView;

