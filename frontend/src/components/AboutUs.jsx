import React from 'react';
import { Users, Mail, Award, BookOpen, Clock, DollarSign, Database, Zap, Target, BarChart3, Code, Cpu } from 'lucide-react';

function AboutUs() {
  const teamMembers = [
    { name: 'Lê Minh Kha', id: '23520664', role: 'Leader', icon: Award },
    { name: 'Trần Quang Minh', id: '23520958', role: 'Developer' },
    { name: 'Trịnh Viết Xuân Quang', id: '23521294', role: 'Developer' },
    { name: 'Trần Đại Hải', id: '23520420', role: 'Developer' },
    { name: 'Nguyễn Hoàng Vy', id: '23521830', role: 'Developer' },
    { name: 'Nguyễn Hải Đăng', id: '23520228', role: 'Do nothing in our project' },
  ];

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-8 text-center">
        <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Hệ thống Dự đoán Sớm Chất lượng Khóa học</h1>
        <p className="text-blue-200 text-lg mb-2">
          Early Course Quality Prediction System
        </p>
        <p className="text-blue-300 text-base max-w-3xl mx-auto">
          Chuyển đổi từ "Hậu kiểm" sang "Giám sát thời gian thực" bằng kỹ thuật Ensemble Learning
        </p>
      </div>

      {/* PROJECT OVERVIEW */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-500" />
          <span>Tổng quan Dự án</span>
        </h2>
        <div className="space-y-4 text-slate-300">
          <p className="text-lg leading-relaxed">
            Giải pháp giám sát chất lượng đào tạo trực tuyến dựa trên dữ liệu, hỗ trợ bộ phận Thanh tra Pháp chế.
            Hệ thống tập trung giải quyết bài toán <span className="text-blue-400 font-semibold">mất cân bằng dữ liệu</span> trong
            giáo dục để đưa ra cảnh báo sớm chính xác ngay khi khóa học mới diễn ra.
          </p>
        </div>
      </div>

      {/* THE PROBLEM */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <span>Giải quyết thách thức của Giáo dục trực tuyến</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Time Problem */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Vấn đề Thời gian</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Các phương pháp đánh giá hiện tại thường là <span className="text-red-400">"hậu kiểm"</span> (khi khóa học đã kết thúc).
              Hệ thống chuyển sang cơ chế <span className="text-green-400">"trong kiểm"</span> (real-time prediction),
              cho phép can thiệp kịp thời.
            </p>
          </div>

          {/* Cost Problem */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Vấn đề Chi phí</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Việc thuê tổ chức kiểm định bên ngoài rất tốn kém. Hệ thống đóng vai trò như công cụ
              <span className="text-blue-400"> "giám sát nội bộ"</span> tự động, giúp nhà trường tiết kiệm ngân sách.
            </p>
          </div>

          {/* Impact on Learners */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Tác động đến người học</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hệ thống giúp <span className="text-blue-400">phát hiện sớm</span> các khóa học có nguy cơ chất lượng thấp,
              từ đó <span className="text-green-400">cải thiện trải nghiệm học tập</span>, giảm tỷ lệ bỏ học và
              nâng cao chất lượng tổng thể của nền tảng.
            </p>
          </div>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-cyan-500" />
          <span>Kiến trúc Hệ thống</span>
        </h2>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Quy trình xử lý dữ liệu khép kín</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
              <div>
                <h4 className="text-blue-400 font-medium">Ingestion</h4>
                <p className="text-slate-300 text-sm">Tổng hợp Log hành vi, Tương tác video và Thảo luận.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
              <div>
                <h4 className="text-blue-400 font-medium">Processing</h4>
                <p className="text-slate-300 text-sm">Làm sạch và trích xuất đặc trưng đa chiều (COELO - AFELO - ACELO).</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
              <div>
                <h4 className="text-blue-400 font-medium">Advanced Resampling</h4>
                <p className="text-slate-300 text-sm mb-2">Áp dụng chiến lược lấy mẫu lại để cân bằng dữ liệu:</p>
                <ul className="text-slate-400 text-sm space-y-1 ml-4">
                  <li>• <span className="text-green-400">Oversampling:</span> Tăng cường mẫu thiếu</li>
                  <li>• <span className="text-orange-400">Undersampling:</span> Làm sạch biên dữ liệu</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
              <div>
                <h4 className="text-blue-400 font-medium">Ensemble Modeling</h4>
                <p className="text-slate-300 text-sm">Dự đoán bằng cơ chế bỏ phiếu (Voting Ensemble) từ 3 biến thể mô hình học máy chuyên biệt.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">5</div>
              <div>
                <h4 className="text-blue-400 font-medium">Decision</h4>
                <p className="text-slate-300 text-sm">Tính toán chỉ số CQV và gán nhãn chất lượng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT & OUTPUT DATA */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-green-500" />
          <span>Dữ liệu Đầu vào & Kết quả</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">📂 Input (Dữ liệu đầu vào)</h3>
            <div className="space-y-3">
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-1">User Logs</h4>
                <p className="text-slate-400 text-xs">Lịch sử xem video, tua, dừng</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-1">Academic Data</h4>
                <p className="text-slate-400 text-xs">Kết quả làm bài tập, số lần thử</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-1">Social Data</h4>
                <p className="text-slate-400 text-xs">Nội dung bình luận, thái độ cảm xúc</p>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-green-400 mb-4">🎯 Output (Kết quả đầu ra)</h3>
            <div className="space-y-3">
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-2">3 Nhãn Chất lượng</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-400">Excellent (Xuất sắc)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-orange-400">Acceptable (Tạm chấp nhận)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-red-400">Needs Improvement (Cần cải thiện)</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-1">Chỉ số CQV</h4>
                <p className="text-slate-400 text-xs">Điểm số định lượng (0-100) phản ánh sức khỏe khóa học</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <h4 className="text-white font-medium text-sm mb-1">Early Warning</h4>
                <p className="text-slate-400 text-xs">Cảnh báo ngay khi khóa học mới diễn ra 25%-50%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNOLOGY STACK */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Code className="w-6 h-6 text-purple-500" />
          <span>Công nghệ Cốt lõi</span>
        </h2>
        <p className="text-slate-400 mb-6">Xây dựng trên nền tảng Data-Centric AI</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Science */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Data Science & Processing</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><span className="font-medium">Pandas & NumPy:</span> Xử lý dữ liệu bảng hiệu năng cao</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><span className="font-medium">Imbalanced-learn:</span> Xử lý mất cân bằng dữ liệu</span>
              </li>
            </ul>
          </div>

          {/* Machine Learning */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-green-400 font-semibold mb-4 flex items-center space-x-2">
              <Cpu className="w-5 h-5" />
              <span>Machine Learning Core</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><span className="font-medium">Scikit-learn:</span> Nền tảng xây dựng mô hình</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><span className="font-medium">Voting Classifier:</span> Ensemble từ 3 mô hình</span>
              </li>
              {/* <li className="ml-4 text-xs space-y-1 mt-2">
                <div>🌲 <span className="text-green-400">RF_SMOTE</span></div>
                <div>🌲 <span className="text-orange-400">RF_Tomek</span></div>
                <div>🌲 <span className="text-purple-400">RF_SMOTETomek</span></div>
              </li> */}
            </ul>
          </div>

          {/* Backend & Frontend */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-blue-400 font-semibold mb-4 flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Backend & Frontend</span>
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-yellow-400 text-xs font-medium mb-1">Backend API</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li>• FastAPI (Python)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-400 text-xs font-medium mb-1">Frontend</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li>• ReactJS + Vite</li>
                  <li>• Recharts (Visualization)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM SECTION */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-500" />
          <span>Thành Viên Nhóm</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => {
            const Icon = member.icon || Users;
            return (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-600 transition-all hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                    <p className="text-slate-400 text-sm">{member.id}</p>
                    {member.role === 'Leader' && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded font-medium">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTACT SECTION */}
      {/* <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="flex items-center justify-center space-x-3 text-center">
          <Mail className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-white font-semibold text-lg">Liên Hệ</h3>
            <p className="text-slate-400 text-sm mt-1">
              Dự án môn học DS317 - Data Science Project
            </p>
          </div>
        </div>
      </div> */}

      {/* FOOTER */}
      <div className="text-center text-slate-500 text-sm py-4">
        <p>© 2025 Early Course Quality Prediction System. Built with ❤️ by DS317 Team.</p>
      </div>
    </div>
  );
}

export default AboutUs;
