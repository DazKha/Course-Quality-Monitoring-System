import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Loader2, X, BarChart3, Users, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { getApiUrl } from '../config';

function HistoricalView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterLabel, setFilterLabel] = useState('all'); // 'all' | 'Needs Improvement' | 'Acceptable' | 'Excellent'
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 20;

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      console.log('Fetching historical data from /api/historical-data...');
      const response = await fetch(getApiUrl('/api/historical-data'));
      
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
  const { needsImprovement, acceptable, excellent, pieDataCQS, engagementBarData } = useMemo(() => {
    const needs = data.filter(c => c.CQS === 'Needs Improvement');
    const accept = data.filter(c => c.CQS === 'Acceptable');
    const excel = data.filter(c => c.CQS === 'Excellent');
    
    // Pie chart 1: Distribution by CQS category
    const pieDataCQS = [
      { name: 'Cần cải thiện', value: needs.length, color: '#ef4444', fullName: 'Needs Improvement' },
      { name: 'Chấp nhận được', value: accept.length, color: '#f97316', fullName: 'Acceptable' },
      { name: 'Xuất sắc', value: excel.length, color: '#22c55e', fullName: 'Excellent' }
    ];

    const total = data.length;
    const cqsWithPercentage = pieDataCQS.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
    }));
    
    // Bar chart: Distribution by Enrollment Size
    const categorizeByEnrollment = (courses) => {
      return {
        small: courses.filter(c => c.enrollment_count < 50).length,
        medium: courses.filter(c => c.enrollment_count >= 50 && c.enrollment_count < 200).length,
        large: courses.filter(c => c.enrollment_count >= 200).length
      };
    };
    
    const needsEnrollment = categorizeByEnrollment(needs);
    const acceptEnrollment = categorizeByEnrollment(accept);
    const excelEnrollment = categorizeByEnrollment(excel);
    
    const engagementBarData = [
      {
        size: 'Nhỏ (<50)',
        'Cần cải thiện': needsEnrollment.small,
        'Chấp nhận được': acceptEnrollment.small,
        'Xuất sắc': excelEnrollment.small
      },
      {
        size: 'Trung bình (50-200)',
        'Cần cải thiện': needsEnrollment.medium,
        'Chấp nhận được': acceptEnrollment.medium,
        'Xuất sắc': excelEnrollment.medium
      },
      {
        size: 'Lớn (≥200)',
        'Cần cải thiện': needsEnrollment.large,
        'Chấp nhận được': acceptEnrollment.large,
        'Xuất sắc': excelEnrollment.large
      }
    ];

    return {
      needsImprovement: needs,
      acceptable: accept,
      excellent: excel,
      pieDataCQS: cqsWithPercentage,
      engagementBarData
    };
  }, [data]);

  // Filtered data for course table (memoized)
  const filteredData = useMemo(() => {
    return filterLabel === 'all'
      ? data
      : data.filter(course => course.CQS === filterLabel);
  }, [data, filterLabel]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterLabel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

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
        {/* Charts Section - Two Pie Charts Side by Side */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Phân bố Chất lượng Khoá học</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart 1: CQS Distribution */}
            <div className="w-full flex flex-col">
              <h4 className="text-md font-medium text-slate-300 mb-4 text-center">
                Phân loại theo CQS
              </h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDataCQS}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomPieLabel}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieDataCQS.map((entry, index) => (
                        <Cell key={`cell-cqs-${index}`} fill={entry.color} />
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
              {/* Legend for CQS */}
              <div className="flex justify-center gap-4 mt-4">
                {pieDataCQS.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-slate-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Distribution by Enrollment Size */}
            <div className="w-full flex flex-col">
              <h4 className="text-md font-medium text-slate-300 mb-4 text-center">
                Phân bố theo Quy mô Học viên
              </h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={engagementBarData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="size" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      label={{ 
                        value: 'Số lượng khóa học', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: '#94a3b8', fontSize: 11 }
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      iconType="circle"
                    />
                    <Bar dataKey="Cần cải thiện" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Chấp nhận được" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Xuất sắc" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Info text */}
              <div className="text-center mt-4">
                <p className="text-xs text-slate-400">
                  Xem chất lượng khóa học có tương quan với quy mô không
                </p>
              </div>
            </div>
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
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredData.length)} / {filteredData.length} khóa học
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
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
              {currentCourses.map((course) => {
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
              {currentCourses.length === 0 && (
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

        {/* Pagination */}
        {filteredData.length > coursesPerPage && (
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                ← Trước
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                Sau →
              </button>
            </div>
          </div>
        )}
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
