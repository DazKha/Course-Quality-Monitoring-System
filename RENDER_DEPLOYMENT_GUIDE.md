# 🚀 Hướng dẫn Deploy Backend lên Render

## 📋 Yêu cầu

- Tài khoản GitHub (free)
- Tài khoản Render (free)
- Repository GitHub chứa code của bạn

## 🔧 Chuẩn bị

### 1. Push code lên GitHub

```bash
# Nếu chưa có git repository
cd /Users/minhkha/Desktop/DS317/course_quality_monitor
git init
git add .
git commit -m "Initial commit for deployment"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Kiểm tra các file đã tạo

✅ `/render.yaml` - Cấu hình deployment cho Render
✅ `/backend/requirements.txt` - Dependencies đã cập nhật
✅ `/backend/start.sh` - Script khởi động
✅ `/backend/main.py` - API đã cấu hình CORS

## 🌐 Deploy lên Render

### Bước 1: Tạo Web Service

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Chọn **"Web Service"**
3. Chọn **"Build and deploy from a Git repository"**
4. Click **"Connect account"** để kết nối GitHub
5. Chọn repository của bạn

### Bước 2: Cấu hình Service

Điền thông tin như sau:

- **Name**: `mooc-quality-monitor-api` (hoặc tên bạn muốn)
- **Region**: `Singapore` (gần Việt Nam nhất)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

### Bước 3: Cấu hình Environment Variables (nếu cần)

Click **"Advanced"** và thêm:

- **Key**: `PYTHON_VERSION`
  - **Value**: `3.11.0`
  
- **Key**: `ALLOWED_ORIGINS` (cho CORS)
  - **Value**: `*` (hoặc domain frontend của bạn, ví dụ: `https://your-frontend.vercel.app`)

### Bước 4: Deploy

1. Chọn **"Free"** plan
2. Click **"Create Web Service"**
3. Render sẽ tự động:
   - Clone repository
   - Install dependencies
   - Start server
   - Cấp cho bạn một URL (ví dụ: `https://mooc-quality-monitor-api.onrender.com`)

⏱️ **Lưu ý**: Lần deploy đầu tiên có thể mất 5-10 phút.

## 🧪 Kiểm tra sau khi Deploy

Sau khi deploy thành công, test các endpoints:

### 1. Health Check
```bash
curl https://YOUR_APP_NAME.onrender.com/
```

### 2. Test Historical Data
```bash
curl https://YOUR_APP_NAME.onrender.com/api/historical-data
```

### 3. Test Ongoing Predictions
```bash
curl https://YOUR_APP_NAME.onrender.com/api/ongoing-prediction
```

### 4. Test Stats
```bash
curl https://YOUR_APP_NAME.onrender.com/api/stats?type=historical
curl https://YOUR_APP_NAME.onrender.com/api/stats?type=ongoing
```

## 🔄 Cập nhật Frontend

Sau khi deploy backend, cập nhật frontend để kết nối với backend mới:

### Cách 1: Cập nhật trong code

Trong `frontend/src/components/Dashboard.jsx`, `HistoricalView.jsx`, và `OngoingView.jsx`:

```javascript
// Thay vì
const response = await fetch('/api/historical-data');

// Dùng
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR_APP_NAME.onrender.com';
const response = await fetch(`${API_BASE_URL}/api/historical-data`);
```

### Cách 2: Sử dụng Environment Variable

Tạo file `/frontend/.env`:

```env
VITE_API_URL=https://YOUR_APP_NAME.onrender.com
```

Sau đó cập nhật code để dùng:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_BASE_URL}/api/historical-data`);
```

## ⚠️ Lưu ý quan trọng

### 1. Free Tier của Render
- ✅ Free forever
- ⚠️ Service sẽ "sleep" sau 15 phút không hoạt động
- ⚠️ Lần request đầu tiên sau khi sleep sẽ mất 30-50 giây để "wake up"
- 💡 Giải pháp: Dùng cron job để ping server mỗi 10 phút (có service miễn phí như UptimeRobot)

### 2. Data Files
- Các file CSV trong `/data` sẽ được deploy cùng
- Đảm bảo đường dẫn trong code đúng (dùng relative path)

### 3. CORS
- Nếu frontend và backend khác domain, cần cấu hình CORS đúng
- Update `ALLOWED_ORIGINS` environment variable

### 4. Logs
- Xem logs tại Render Dashboard → Your Service → Logs
- Dùng để debug nếu có lỗi

## 🔍 Troubleshooting

### Lỗi "Application failed to respond"
- Kiểm tra `Start Command` có đúng không
- Kiểm tra port: phải dùng `$PORT` environment variable
- Xem logs để tìm lỗi cụ thể

### Lỗi "Module not found"
- Kiểm tra `requirements.txt` có đầy đủ dependencies
- Rebuild service

### Lỗi CORS
- Kiểm tra `ALLOWED_ORIGINS` environment variable
- Đảm bảo frontend URL được thêm vào danh sách

### Data files không tìm thấy
- Kiểm tra đường dẫn file CSV trong code
- Đảm bảo folder `data` được commit vào git
- Xem logs để kiểm tra working directory

## 🎉 Hoàn tất!

Bây giờ backend của bạn đã chạy trên Render với URL công khai!

**URL của bạn sẽ có dạng:**
```
https://YOUR_APP_NAME.onrender.com
```

**API Endpoints:**
- `GET /` - Health check
- `GET /api/historical-data` - Lấy dữ liệu lịch sử
- `GET /api/ongoing-prediction` - Lấy dự đoán đang chạy
- `GET /api/stats?type=historical` - Thống kê lịch sử
- `GET /api/stats?type=ongoing` - Thống kê ongoing

## 📚 Tài liệu tham khảo

- [Render Documentation](https://render.com/docs)
- [Deploying FastAPI on Render](https://render.com/docs/deploy-fastapi)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 💡 Tips

1. **Monitoring**: Sử dụng [UptimeRobot](https://uptimerobot.com/) để giữ service không sleep
2. **Custom Domain**: Có thể add custom domain trong Render settings (miễn phí)
3. **Auto-deploy**: Mỗi khi push code lên GitHub, Render sẽ tự động deploy lại
4. **Environment Variables**: Có thể update mọi lúc trong Render dashboard mà không cần redeploy

---

**Chúc bạn deploy thành công! 🚀**

Nếu gặp vấn đề, hãy check logs trong Render Dashboard hoặc liên hệ hỗ trợ.

