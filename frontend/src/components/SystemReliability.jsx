import React, { useState } from 'react';
import { TrendingUp, Target, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function SystemReliability() {
    const [showSanityChecks, setShowSanityChecks] = useState(false);
    const [showAccDQTooltip, setShowAccDQTooltip] = useState(false);

    // Performance data by phase
    const performanceData = [
        { phase: 'Phase 1', range: '0–25% khóa học', accuracy: 0.69, recall: 0.96, precision: 0.71, macroF1: 0.60 },
        { phase: 'Phase 2', range: '0–50% khóa học', accuracy: 0.80, recall: 0.94, precision: 0.87, macroF1: 0.70 },
        { phase: 'Phase 3', range: '0–75% khóa học', accuracy: 0.82, recall: 0.94, precision: 0.90, macroF1: 0.72 },
    ];

    // Chart data for accuracy trend
    const chartData = performanceData.map(item => ({
        name: item.phase,
        'Accuracy': (item.accuracy * 100).toFixed(0),
        'Recall': (item.recall * 100).toFixed(0),
        'Precision': (item.precision * 100).toFixed(0),
        'Macro F1': (item.macroF1 * 100).toFixed(0),
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg p-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <CheckCircle className="w-16 h-16 text-purple-300" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">System Reliability</h1>
                <p className="text-purple-200 text-lg">
                    Đánh giá độ tin cậy và hiệu năng hệ thống
                </p>
            </div>

            {/* PHẦN 1: MODEL PERFORMANCE */}
            <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span>Hiệu năng Mô hình (Model Performance)</span>
                </h2>

                {/* Hero Message */}
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-6 border border-blue-800/50">
                    <p className="text-white text-lg leading-relaxed">
                        Hệ thống dự đoán sớm chất lượng khóa học có khả năng <span className="text-green-400 font-semibold">phát hiện sớm</span> các
                        khóa học cần cải thiện ngay từ giai đoạn đầu, và độ chính xác <span className="text-blue-400 font-semibold">tăng dần</span> khi
                        quan sát được nhiều dữ liệu hơn.
                    </p>
                </div>

                {/* Key Highlights - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card 1: Early Detection */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-green-700/50 hover:border-green-500 transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">Phát hiện sớm</h3>
                        </div>
                        <div className="text-center mt-4">
                            <div className="text-4xl font-bold text-green-400 mb-2">96%</div>
                            <div className="text-sm text-slate-400">Recall (Needs Improvement)</div>
                            <div className="text-xs text-green-300 mt-2">Ngay từ Phase 1</div>
                        </div>
                    </div>

                    {/* Card 2: Progressive Accuracy */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-blue-700/50 hover:border-blue-500 transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">Độ chính xác tăng tiến</h3>
                        </div>
                        <div className="text-center mt-4">
                            <div className="text-4xl font-bold text-blue-400 mb-2">
                                69% → 82%
                            </div>
                            <div className="text-sm text-slate-400">Accuracy</div>
                            <div className="text-xs text-blue-300 mt-2">Tăng dần qua các Phase</div>
                        </div>
                    </div>

                    {/* Card 3: Action Oriented */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-purple-700/50 hover:border-purple-500 transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">Mục tiêu can thiệp</h3>
                        </div>
                        <div className="text-center mt-4">
                            <div className="text-2xl font-bold text-purple-400 mb-2">
                                Ưu tiên cảnh báo sớm
                            </div>
                            <div className="text-sm text-slate-400 mt-2">Không bỏ sót khóa học chất lượng thấp</div>
                        </div>
                    </div>
                </div>

                {/* Performance Table */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Chi tiết theo giai đoạn</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Giai đoạn</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Phạm vi dữ liệu</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Accuracy</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Recall (Needs Improv.)</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Precision (Needs Improv.)</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Macro F1</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {performanceData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-750 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-blue-400 font-semibold">{item.phase}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 text-sm">{item.range}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-white font-semibold">{(item.accuracy * 100).toFixed(0)}%</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-green-400 font-semibold">{(item.recall * 100).toFixed(0)}%</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-orange-400 font-semibold">{(item.precision * 100).toFixed(0)}%</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-purple-400 font-semibold">{(item.macroF1 * 100).toFixed(0)}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Metrics Explanation */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-300 mb-4">📖 Giải thích các chỉ số:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Recall */}
                            <div className="bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <h5 className="text-green-400 font-semibold text-sm">Recall (Needs Improvement)</h5>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Trong tất cả các khóa học <span className="text-white font-medium">thực sự cần cải thiện</span>,
                                    mô hình <span className="text-green-400">phát hiện được bao nhiêu phần trăm</span>.
                                </p>
                                <p className="text-slate-500 text-xs mt-2 italic">
                                    → Ưu tiên cao: Không bỏ sót khóa học chất lượng thấp
                                </p>
                            </div>

                            {/* Precision */}
                            <div className="bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                    <h5 className="text-orange-400 font-semibold text-sm">Precision (Needs Improvement)</h5>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Trong tất cả các khóa học <span className="text-white font-medium">được dự đoán là cần cải thiện</span>,
                                    có <span className="text-orange-400">bao nhiêu phần trăm thực sự cần cải thiện</span>.
                                </p>
                                <p className="text-slate-500 text-xs mt-2 italic">
                                    → Độ chính xác: Giảm cảnh báo nhầm (false alarm)
                                </p>
                            </div>

                            {/* Accuracy */}
                            <div className="bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <h5 className="text-blue-400 font-semibold text-sm">Accuracy (Tổng thể)</h5>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Tỷ lệ dự đoán đúng <span className="text-white font-medium">trên tất cả các khóa học</span>
                                    (bao gồm cả 3 nhãn: Needs Improvement, Acceptable, Excellent).
                                </p>
                                <p className="text-slate-500 text-xs mt-2 italic">
                                    → Hiệu năng tổng quát của mô hình
                                </p>
                            </div>

                            {/* Macro F1 */}
                            <div className="bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <h5 className="text-purple-400 font-semibold text-sm">Macro F1</h5>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Trung bình điều hòa của <span className="text-white font-medium">F1-score trên cả 3 nhãn</span>,
                                    đảm bảo mô hình <span className="text-purple-400">cân bằng giữa các lớp</span>.
                                </p>
                                <p className="text-slate-500 text-xs mt-2 italic">
                                    → Đánh giá công bằng cho dữ liệu mất cân bằng
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accuracy Trend Chart */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Xu hướng Hiệu năng</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#94a3b8' }}
                                    stroke="#475569"
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8' }}
                                    stroke="#475569"
                                    domain={[0, 100]}
                                    label={{
                                        value: 'Phần trăm (%)',
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
                                    formatter={(value) => `${value}%`}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    iconType="line"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Accuracy"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Recall"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                    dot={{ fill: '#22c55e', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Precision"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    dot={{ fill: '#f97316', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Macro F1"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    dot={{ fill: '#a855f7', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* PHẦN 2: DATA QUALITY */}
            <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-cyan-500" />
                    <span>Chất lượng Dữ liệu (Data Quality)</span>
                </h2>

                <p className="text-slate-400 mb-6">
                    Chứng minh độ tin cậy của dữ liệu đầu vào (Input Health)
                </p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Completeness */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">Độ đầy đủ</h3>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">95.7%</div>
                        <div className="text-sm text-slate-400">Completeness</div>
                        <div className="mt-3 px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full inline-block">
                            ✅ Rất tốt
                        </div>
                    </div>

                    {/* Consistency */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">Độ nhất quán</h3>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-400 mb-2">98.7%</div>
                        <div className="text-sm text-slate-400">Consistency</div>
                        <div className="mt-3 px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full inline-block">
                            ✅ Xuất sắc
                        </div>
                    </div>

                    {/* Acc-DQ Score */}
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold">Điểm tin cậy</h3>
                                <div className="relative">
                                    <button
                                        onMouseEnter={() => setShowAccDQTooltip(true)}
                                        onMouseLeave={() => setShowAccDQTooltip(false)}
                                        className="text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                    {showAccDQTooltip && (
                                        <div className="absolute left-0 top-6 w-72 bg-slate-950 border border-blue-700 rounded-lg p-3 shadow-xl z-10">
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                <span className="font-semibold text-blue-400">Acc-DQ</span> (Accuracy-Driven Data Quality)
                                                là chỉ số đo lường chất lượng dữ liệu dựa trên hiệu năng thực tế của mô hình AI,
                                                kết hợp giữa độ chính xác dự báo (Performance) và tính ổn định kỹ thuật (Sanity Checks).
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-3xl font-bold text-cyan-400 mb-2">86.5<span className="text-xl text-slate-500">/100</span></div>
                        <div className="text-sm text-slate-400">Acc-DQ Score</div>
                        <div className="mt-3 px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-full inline-block">
                            🚀 Model Ready
                        </div>
                    </div>
                </div>

                {/* Sanity Checks - Collapsible */}
                <div className="bg-slate-800 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setShowSanityChecks(!showSanityChecks)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-750 transition-colors rounded-lg"
                    >
                        <h3 className="text-white font-semibold flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Xem chi tiết sức khỏe dữ liệu (Sanity Checks)</span>
                        </h3>
                        {showSanityChecks ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                    </button>

                    {showSanityChecks && (
                        <div className="px-6 pb-6 space-y-4">
                            <div className="border-t border-slate-700 pt-4"></div>

                            {/* Arithmetic Health */}
                            <div className="flex items-center justify-between bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-medium">Không lỗi số học</h4>
                                        <p className="text-xs text-slate-400">Arithmetic Health</p>
                                    </div>
                                </div>
                                <span className="text-green-400 font-bold text-lg">100%</span>
                            </div>

                            {/* Data Drift */}
                            <div className="flex items-center justify-between bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-medium">Ổn định phân phối</h4>
                                        <p className="text-xs text-slate-400">Data Drift - Test set tương đồng với Train set</p>
                                    </div>
                                </div>
                                <span className="text-green-400 font-bold text-lg">99%</span>
                            </div>

                            {/* Diversity */}
                            <div className="flex items-center justify-between bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-medium">Đa dạng dự báo</h4>
                                        <p className="text-xs text-slate-400">Diversity - No mode collapse</p>
                                    </div>
                                </div>
                                <span className="text-green-400 font-bold text-lg">Tốt</span>
                            </div>

                            {/* Batch Efficiency */}
                            <div className="flex items-center justify-between bg-slate-900 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-medium">Hiệu suất xử lý</h4>
                                        <p className="text-xs text-slate-400">Batch Efficiency</p>
                                    </div>
                                </div>
                                <span className="text-green-400 font-bold text-lg">100%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-slate-500 text-sm py-4">
                <p>Dữ liệu được cập nhật dựa trên kết quả thực nghiệm mới nhất</p>
            </div>
        </div>
    );
}

export default SystemReliability;
