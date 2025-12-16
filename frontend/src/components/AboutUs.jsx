import React from 'react';
import { Users, Mail, Award, BookOpen } from 'lucide-react';

function AboutUs() {
  const teamMembers = [
    { name: 'Lê Minh Kha', id: '23520664', role: 'Leader', icon: Award },
    { name: 'Nguyễn Hải Đăng', id: '23520228', role: 'Developer' },
    { name: 'Trần Quang Minh', id: '23520958', role: 'Developer' },
    { name: 'Trịnh Viết Xuân Quang', id: '23521294', role: 'Developer' },
    { name: 'Trần Đại Hải', id: '23521830', role: 'Developer' },
    { name: 'Nguyễn Hoàng Vy', id: '23520420', role: 'Developer' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-8 text-center">
        <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">MOOC Quality Monitor</h1>
        <p className="text-blue-200 text-lg">
          Hệ thống phát hiện sớm khóa học cần cải thiện
        </p>
      </div>

      {/* Project Description */}
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <span>Về Dự Án</span>
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            MOOC Quality Monitor là một hệ thống dashboard thông minh được phát triển nhằm 
            theo dõi và dự đoán chất lượng các khóa học trực tuyến (MOOC - Massive Open Online Courses).
          </p>
          <p>
            Hệ thống sử dụng machine learning để phân tích các chỉ số như tỷ lệ tương tác (engagement), 
            cảm xúc người học (sentiment), và các metrics khác để cảnh báo sớm những khóa học cần được cải thiện.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Tính Năng Chính</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <span className="text-white font-medium">Historical Analysis:</span>
                  <span className="text-slate-300"> Phân tích dữ liệu lịch sử của 50 khóa học đã hoàn thành với scatter plot trực quan.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <span className="text-white font-medium">Ongoing Prediction:</span>
                  <span className="text-slate-300"> Dự đoán xác suất rủi ro của khóa học đang diễn ra qua các giai đoạn thời gian.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <span className="text-white font-medium">Early Warning System:</span>
                  <span className="text-slate-300"> Cảnh báo kịp thời khi khóa học vượt ngưỡng rủi ro 80%.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <span className="text-white font-medium">Feature Engineering:</span>
                  <span className="text-slate-300"> Tính toán Interaction Index và Sentiment Index từ dữ liệu thô.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Công Nghệ Sử Dụng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Frontend</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• React 18 (Vite)</li>
                  <li>• Tailwind CSS</li>
                  <li>• Recharts</li>
                  <li>• Lucide React Icons</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Backend</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Python FastAPI</li>
                  <li>• Pydantic</li>
                  <li>• Scikit-learn</li>
                  <li>• Uvicorn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
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

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="flex items-center justify-center space-x-3 text-center">
          <Mail className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-white font-semibold text-lg">Liên Hệ</h3>
            <p className="text-slate-400 text-sm mt-1">
              Dự án môn học DS317 - Data Science Project
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm py-4">
        <p>© 2025 MOOC Quality Monitor. Built with ❤️ by DS317 Team.</p>
      </div>
    </div>
  );
}

export default AboutUs;


