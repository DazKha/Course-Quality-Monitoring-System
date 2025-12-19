import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { getApiUrl } from '../config';

function OngoingView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [criticalFilter, setCriticalFilter] = useState('all'); // 'all', 'G1', 'G2', 'G3'
  const [selectedCourse, setSelectedCourse] = useState(null); // For modal

  useEffect(() => {
    fetchOngoingData();
  }, []);

  const fetchOngoingData = async () => {
    try {
      const response = await fetch(getApiUrl('/api/ongoing-prediction'));
      const data = await response.json();
      
      // Helper to get latest prediction
      const getLatest = (courseData) => {
        for (let i = courseData.length - 1; i >= 0; i--) {
          if (courseData[i].prediction) return courseData[i].prediction;
        }
        return null;
      };
      
      // Helper to get status level for sorting
      const getLevel = (prediction) => {
        if (prediction === 'Needs Improvement') return 3;
        if (prediction === 'Acceptable') return 2;
        if (prediction === 'Excellent') return 1;
        return 0;
      };
      
      // Sort courses by latest prediction severity
      const sortedCourses = [...data].sort((a, b) => {
        const aLevel = getLevel(getLatest(a.data));
        const bLevel = getLevel(getLatest(b.data));
        return bLevel - aLevel; // Critical first
      });
      
      setCourses(sortedCourses);
      
      // Select all courses by default
      setSelectedCourses(sortedCourses.map(c => c.id));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ongoing data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Helper function to get color based on prediction
  const getPredictionColor = (prediction) => {
    if (!prediction) return '#64748b'; // Gray for N/A
    if (prediction === 'Needs Improvement') return '#ef4444'; // Red
    if (prediction === 'Acceptable') return '#f97316'; // Orange
    if (prediction === 'Excellent') return '#22c55e'; // Green
    return '#64748b';
  };

  // Helper function to get status level (for sorting)
  const getStatusLevel = (prediction) => {
    if (prediction === 'Needs Improvement') return 3;
    if (prediction === 'Acceptable') return 2;
    if (prediction === 'Excellent') return 1;
    return 0;
  };

  // Calculate statistics for each stage
  const getStageStats = () => {
    const stages = ['G1', 'G2', 'G3'];
    return stages.map(stageName => {
      const stageData = courses
        .map(c => c.data.find(d => d.stage === stageName))
        .filter(d => d && d.prediction);
      
      const needsImprovement = stageData.filter(d => d.prediction === 'Needs Improvement').length;
      const acceptable = stageData.filter(d => d.prediction === 'Acceptable').length;
      const excellent = stageData.filter(d => d.prediction === 'Excellent').length;
      const total = stageData.length;
      const notReached = courses.length - total;
      
      return {
        stage: stageName,
        'Needs Improvement': needsImprovement,
        'Acceptable': acceptable,
        'Excellent': excellent,
        total,
        notReached,
        needsImprovementPct: total > 0 ? ((needsImprovement / total) * 100).toFixed(1) : 0,
        acceptablePct: total > 0 ? ((acceptable / total) * 100).toFixed(1) : 0,
        excellentPct: total > 0 ? ((excellent / total) * 100).toFixed(1) : 0
      };
    });
  };

  const stageStats = getStageStats();

  const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

  // Get latest available prediction for each course
  const getLatestPrediction = (courseData) => {
    // Check from G3 -> G2 -> G1
    for (let i = courseData.length - 1; i >= 0; i--) {
      if (courseData[i].prediction) {
        return courseData[i].prediction;
      }
    }
    return null;
  };
  
  // Get current stage (latest stage with prediction)
  const getCurrentStage = (courseData) => {
    for (let i = courseData.length - 1; i >= 0; i--) {
      if (courseData[i].prediction) {
        return courseData[i].stage;
      }
    }
    return courseData[0].stage; // Default to first stage
  };

  // No longer need line chart tooltip since we're showing table view

  const toggleCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Check if any course has "Needs Improvement" prediction
  const hasCriticalCourses = courses.some(course => 
    getLatestPrediction(course.data) === 'Needs Improvement'
  );

  // Get critical courses with filter
  const getCriticalCourses = () => {
    const critical = courses.filter(c => getLatestPrediction(c.data) === 'Needs Improvement');
    
    if (criticalFilter === 'all') {
      return critical;
    }
    
    return critical.filter(c => getCurrentStage(c.data) === criticalFilter);
  };

  const filteredCriticalCourses = getCriticalCourses();
  const totalCriticalCourses = courses.filter(c => getLatestPrediction(c.data) === 'Needs Improvement').length;

  // Modal functions
  const openCourseDetail = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
  };

  return (
    <>
    <div className="space-y-4">
      {/* Warning Alert */}
      {hasCriticalCourses && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-200 font-semibold text-sm">Cảnh báo sớm - Courses cần can thiệp</h4>
              <p className="text-red-300 text-xs mt-1">
                Phát hiện {courses.filter(c => getLatestPrediction(c.data) === 'Needs Improvement').length} khóa học được dự đoán "Needs Improvement". 
                Cần đánh giá và can thiệp ngay để cải thiện chất lượng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stage Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stageStats.map((stat, idx) => (
          <div key={stat.stage} className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-lg">{stat.stage}</h3>
                <p className="text-slate-400 text-xs">
                  {stat.total} / {courses.length} khóa học đã đạt
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="space-y-2">
              {/* Needs Improvement */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400">Cần cải thiện</span>
                  <span className="text-red-400 font-medium">
                    {stat['Needs Improvement']} ({stat.needsImprovementPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${stat.needsImprovementPct}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Acceptable */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-orange-400">Chấp nhận được</span>
                  <span className="text-orange-400 font-medium">
                    {stat['Acceptable']} ({stat.acceptablePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all" 
                    style={{ width: `${stat.acceptablePct}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Excellent */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-400">Xuất sắc</span>
                  <span className="text-green-400 font-medium">
                    {stat['Excellent']} ({stat.excellentPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ width: `${stat.excellentPct}%` }}
                  ></div>
                </div>
        </div>
      </div>

            {stat.notReached > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-500 text-xs">
                  {stat.notReached} khóa học chưa đạt giai đoạn này
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-semibold text-lg mb-4">So sánh Dự đoán qua các Giai đoạn</h3>
        <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageStats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="stage"
              tick={{ fill: '#94a3b8' }}
              label={{ 
                value: 'Giai đoạn', 
                position: 'insideBottom', 
                offset: -10,
                  style: { fill: '#94a3b8' }
              }}
            />
            <YAxis
              tick={{ fill: '#94a3b8' }}
              label={{ 
                  value: 'Số lượng khóa học', 
                angle: -90, 
                position: 'insideLeft',
                  style: { fill: '#94a3b8' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  const labels = {
                    'Needs Improvement': 'Cần cải thiện',
                    'Acceptable': 'Chấp nhận được',
                    'Excellent': 'Xuất sắc'
                  };
                  return [value, labels[name] || name];
              }}
            />
              <Legend 
                formatter={(value) => {
                  const labels = {
                    'Needs Improvement': 'Cần cải thiện',
                    'Acceptable': 'Chấp nhận được',
                    'Excellent': 'Xuất sắc'
                  };
                  return labels[value] || value;
                }}
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar dataKey="Needs Improvement" stackId="a" fill="#ef4444" />
              <Bar dataKey="Acceptable" stackId="a" fill="#f97316" />
              <Bar dataKey="Excellent" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-slate-400 text-sm space-y-2">
          <p>📊 Biểu đồ thể hiện phân bố dự đoán tại mỗi giai đoạn. Số lượng khóa học giảm dần vì chưa tất cả đều đạt G2, G3.</p>
          <p className="text-xs text-slate-500">

          </p>
        </div>
      </div>
            
      {/* Critical Courses - Needs Improvement */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Khóa học cần Can thiệp Ngay ({totalCriticalCourses})</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Danh sách khóa học được dự đoán "Needs Improvement" - cần hành động khẩn cấp
              </p>
              {criticalFilter !== 'all' && (
                <p className="text-blue-400 text-xs mt-1">
                  📍 Đang lọc: Giai đoạn {criticalFilter} - Hiển thị {filteredCriticalCourses.length} / {totalCriticalCourses} khóa học
                </p>
              )}
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs mr-2">Lọc theo giai đoạn:</span>
              <button
                onClick={() => setCriticalFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  criticalFilter === 'all'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Tất cả ({totalCriticalCourses})
              </button>
              {['G1', 'G2', 'G3'].map(stage => {
                const count = courses.filter(c => 
                  getLatestPrediction(c.data) === 'Needs Improvement' && 
                  getCurrentStage(c.data) === stage
                ).length;
                
                return (
                  <button
                    key={stage}
                    onClick={() => setCriticalFilter(stage)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      criticalFilter === stage
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {stage} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-slate-900 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Khóa học</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Học viên</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Giai đoạn</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G1</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G2</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G3</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCriticalCourses.map((course, idx) => {
                  const currentStage = getCurrentStage(course.data);
                  
                  return (
                    <tr 
                  key={course.id}
                      className="hover:bg-slate-750 transition-colors cursor-pointer"
                      onClick={() => openCourseDetail(course)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
                            {course.name}
                          </p>
                          <p className="text-slate-400 text-xs">{course.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300 text-sm">
                        {course.current_students.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-blue-400 text-sm font-medium">{currentStage}</span>
                      </td>
                      {course.data.map((stage, stageIdx) => (
                        <td key={stageIdx} className="px-4 py-3 text-center">
                          {stage.prediction ? (
                            <div className="flex items-center justify-center">
                              <span 
                                className="inline-block px-2 py-1 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${getPredictionColor(stage.prediction)}20`,
                                  color: getPredictionColor(stage.prediction)
                                }}
                              >
                                {stage.prediction === 'Needs Improvement' ? '⚠️' : 
                                 stage.prediction === 'Acceptable' ? '⚡' : 
                                 '✓'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {filteredCriticalCourses.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                    {totalCriticalCourses === 0 
                      ? '🎉 Không có khóa học nào cần can thiệp khẩn cấp'
                      : `Không có khóa học nào ở giai đoạn ${criticalFilter}`
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Courses Summary Table */}
      <details className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <summary className="px-4 py-3 bg-slate-900 cursor-pointer hover:bg-slate-850 transition-colors">
          <h3 className="text-white font-medium inline">Chi tiết Tất cả Khóa học ({courses.length})</h3>
          <span className="text-slate-400 text-xs ml-2">Click để xem</span>
        </summary>
        <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full">
            <thead className="bg-slate-900 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Khóa học</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Học viên</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Giai đoạn</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G1</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G2</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">G3</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {courses.map((course, idx) => {
                const latestPrediction = getLatestPrediction(course.data);
                const currentStage = getCurrentStage(course.data);
                const predictionColor = getPredictionColor(latestPrediction);
              
              return (
                  <tr 
                    key={course.id} 
                    className="hover:bg-slate-750 transition-colors cursor-pointer"
                    onClick={() => openCourseDetail(course)}
                  >
                  <td className="px-4 py-3">
                      <div>
                        <p className="text-white text-sm font-medium truncate max-w-[300px] hover:text-blue-400 transition-colors">
                          {course.name}
                        </p>
                        <p className="text-slate-400 text-xs">{course.id}</p>
                    </div>
                  </td>
                    <td className="px-4 py-3 text-center text-slate-300 text-sm">
                    {course.current_students.toLocaleString()}
                  </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-blue-400 text-sm font-medium">{currentStage}</span>
                    </td>
                  {course.data.map((stage, stageIdx) => (
                    <td key={stageIdx} className="px-4 py-3 text-center">
                        {stage.prediction ? (
                          <span 
                            className="inline-block px-2 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${getPredictionColor(stage.prediction)}20`,
                              color: getPredictionColor(stage.prediction)
                            }}
                          >
                            {stage.prediction === 'Needs Improvement' ? 'Needs Imp.' : 
                             stage.prediction === 'Acceptable' ? 'Acceptable' : 
                             'Excellent'}
                      </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                      {latestPrediction ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${predictionColor}20`,
                              color: predictionColor,
                              border: `1px solid ${predictionColor}`
                            }}
                          >
                            {latestPrediction}
                    </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">N/A</span>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </details>
    </div>

    {/* Course Detail Modal */}
    {selectedCourse && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={closeCourseDetail}
      >
        <div 
          className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedCourse.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{selectedCourse.id}</p>
            </div>
            <button
              onClick={closeCourseDetail}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Current Status */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-blue-400">📊</span>
                <span>Trạng thái hiện tại</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Giai đoạn</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {getCurrentStage(selectedCourse.data)}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Số học viên</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCourse.current_students?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Statistics */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-purple-400">📚</span>
                <span>Nội dung Khóa học</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Số chương</div>
                  <div className="text-xl font-bold text-white">
                    {selectedCourse.num_chapters || 0}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Video</div>
                  <div className="text-xl font-bold text-white">
                    {selectedCourse.n_videos || 0}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Bài tập</div>
                  <div className="text-xl font-bold text-white">
                    {selectedCourse.n_exercises || 0}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-1">Bài toán</div>
                  <div className="text-xl font-bold text-white">
                    {selectedCourse.n_problems || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Metrics */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-cyan-400">📈</span>
                <span>Độ phủ & Hoàn thành</span>
              </h3>
              <div className="space-y-3">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Assignment Coverage</span>
                    <span className="text-white font-semibold">
                      {((selectedCourse.assignment_coverage || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(selectedCourse.assignment_coverage || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Video Coverage</span>
                    <span className="text-white font-semibold">
                      {((selectedCourse.video_coverage || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(selectedCourse.video_coverage || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Discussion Coverage</span>
                    <span className="text-white font-semibold">
                      {((selectedCourse.discussion_coverage || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(selectedCourse.discussion_coverage || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Correct Rate</span>
                    <span className="text-white font-semibold">
                      {((selectedCourse.correct_rate_course || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(selectedCourse.correct_rate_course || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Prediction */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-yellow-400">🎯</span>
                <span>Dự đoán hiện tại</span>
              </h3>
              <div className="bg-slate-900 rounded-lg p-4">
                {(() => {
                  const prediction = getLatestPrediction(selectedCourse.data);
                  const color = getPredictionColor(prediction);
                  return (
                    <div className="flex items-center space-x-4">
                      <div 
                        className="px-4 py-2 rounded-lg text-lg font-semibold"
                        style={{ 
                          backgroundColor: `${color}20`,
                          color: color,
                          border: `2px solid ${color}`
                        }}
                      >
                        {prediction || 'Chưa có dự đoán'}
                      </div>
                      {prediction === 'Needs Improvement' && (
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="text-sm font-medium">Cần can thiệp ngay!</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Prediction Timeline */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-green-400">📈</span>
                <span>Lịch sử Dự đoán</span>
              </h3>
              <div className="space-y-3">
                {selectedCourse.data.map((stage, idx) => (
                  <div 
                    key={idx}
                    className={`bg-slate-900 rounded-lg p-4 border-l-4 ${
                      stage.prediction 
                        ? stage.prediction === 'Needs Improvement' 
                          ? 'border-red-500'
                          : stage.prediction === 'Acceptable'
                          ? 'border-orange-500'
                          : 'border-green-500'
                        : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 font-semibold">{stage.stage}</span>
                          {stage.stage === getCurrentStage(selectedCourse.data) && (
                            <span className="px-2 py-0.5 bg-blue-900 text-blue-300 text-xs rounded-full">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        {stage.prediction ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <span 
                              className="px-3 py-1 rounded text-sm font-medium"
                              style={{ 
                                backgroundColor: `${getPredictionColor(stage.prediction)}20`,
                                color: getPredictionColor(stage.prediction)
                              }}
                            >
                              {stage.prediction}
                            </span>
                            {stage.prediction === 'Needs Improvement' && (
                              <span className="text-xs text-red-400">⚠️ Cảnh báo</span>
                            )}
                            {stage.prediction === 'Acceptable' && (
                              <span className="text-xs text-orange-400">⚡ Cần theo dõi</span>
                            )}
                            {stage.prediction === 'Excellent' && (
                              <span className="text-xs text-green-400">✓ Tốt</span>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 text-slate-500 text-sm">
                            Chưa có dữ liệu
                          </div>
                        )}
                      </div>
                      {stage.prediction && (
                        <div className="text-right">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                            style={{ 
                              backgroundColor: `${getPredictionColor(stage.prediction)}20`,
                              color: getPredictionColor(stage.prediction)
                            }}
                          >
                            {stage.prediction === 'Needs Improvement' ? '⚠️' : 
                             stage.prediction === 'Acceptable' ? '⚡' : 
                             '✓'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {getLatestPrediction(selectedCourse.data) === 'Needs Improvement' && (
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <span className="text-red-400">💡</span>
                  <span>Khuyến nghị Hành động</span>
                </h3>
                <div className="bg-red-950 border border-red-800 rounded-lg p-4">
                  <ul className="space-y-2 text-red-200 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>Kiểm tra chất lượng nội dung và tài liệu học</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>Tăng cường tương tác với học viên</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>Cập nhật bài tập và đánh giá</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>Thu thập feedback từ học viên</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900 px-6 py-4 border-t border-slate-700 flex justify-end space-x-3">
            <button
              onClick={closeCourseDetail}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
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

export default OngoingView;


