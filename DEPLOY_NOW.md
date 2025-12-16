# 🚀 Deploy Ngay - 5 Phút

## 📦 Các file đã chuẩn bị sẵn cho bạn:

✅ `/render.yaml` - Config Render  
✅ `/backend/requirements.txt` - Dependencies đầy đủ  
✅ `/backend/start.sh` - Script khởi động  
✅ `/backend/main.py` - CORS đã config  
✅ `/RENDER_DEPLOYMENT_GUIDE.md` - Hướng dẫn chi tiết  
✅ `/DEPLOY_CHECKLIST.md` - Checklist đầy đủ  
✅ `/backend/DEPLOYMENT.md` - Hướng dẫn backend  
✅ `/backend/test_api.sh` - Script test API  

---

## ⚡ Deploy trong 3 bước:

### Bước 1: Push lên GitHub (2 phút)

```bash
cd /Users/minhkha/Desktop/DS317/course_quality_monitor

# Nếu chưa có git
git init
git add .
git commit -m "Ready for deployment"

# Tạo repo trên GitHub rồi:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy Backend lên Render (2 phút)

1. Vào: https://dashboard.render.com/
2. Đăng ký/Đăng nhập (dùng GitHub)
3. Click: **New +** → **Web Service**
4. Chọn repository vừa push
5. Settings:
   ```
   Name: mooc-quality-monitor-api
   Region: Singapore
   Root Directory: backend
   Build: pip install -r requirements.txt
   Start: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Add Environment Variable:
   ```
   PYTHON_VERSION = 3.11.0
   ```
7. Click **Create Web Service**
8. Đợi 5-10 phút → Copy URL

### Bước 3: Test API (30 giây)

```bash
# Thay YOUR_URL bằng URL từ Render
curl https://YOUR_URL.onrender.com/

# Test với script
cd backend
./test_api.sh https://YOUR_URL.onrender.com
```

---

## 🎯 URL của bạn sẽ có dạng:

```
https://mooc-quality-monitor-api.onrender.com
```

### API Endpoints:
- `GET /` - Health check
- `GET /api/historical-data` - Dữ liệu lịch sử (~3000 courses)
- `GET /api/ongoing-prediction` - Dự đoán đang chạy (~400 courses)
- `GET /api/stats?type=historical` - Thống kê lịch sử
- `GET /api/stats?type=ongoing` - Thống kê ongoing

---

## 📱 Next: Deploy Frontend (Optional)

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
```

### Option B: Manual trên Vercel Dashboard
1. https://vercel.com/ → Import Project
2. Connect GitHub → Select repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Add env: `VITE_API_URL` = `https://YOUR_BACKEND_URL.onrender.com`
6. Deploy

---

## ⚠️ Lưu ý quan trọng:

### Free Tier của Render
- ✅ Miễn phí mãi mãi
- ⚠️ Server "ngủ" sau 15 phút không dùng
- ⚠️ Request đầu sau khi ngủ mất ~30 giây
- 💡 Giải pháp: Dùng [UptimeRobot](https://uptimerobot.com/) ping mỗi 10 phút

### Update CORS sau khi deploy frontend
```bash
# Trong Render Dashboard → Environment Variables
ALLOWED_ORIGINS = https://your-frontend.vercel.app
```

---

## 🔥 Pro Tips:

1. **Auto-deploy**: Mỗi lần push code, Render tự động deploy lại
2. **Custom Domain**: Free! Add trong Render settings
3. **Logs**: Xem realtime logs trong Render dashboard
4. **Monitoring**: Dùng UptimeRobot để giữ service không ngủ

---

## 📚 Tài liệu đầy đủ:

- Chi tiết: `/RENDER_DEPLOYMENT_GUIDE.md`
- Checklist: `/DEPLOY_CHECKLIST.md`
- Backend guide: `/backend/DEPLOYMENT.md`

---

## 🆘 Gặp vấn đề?

### Build failed?
→ Check logs trong Render dashboard

### Server không start?
→ Verify start command có `$PORT`

### CORS error?
→ Update `ALLOWED_ORIGINS` environment variable

### Data không load?
→ Check file CSV đã commit vào git chưa

---

## ✅ Done!

Sau khi deploy xong, bạn sẽ có:
- ✅ Backend API public trên Render
- ✅ Auto-deploy khi push code mới
- ✅ Free SSL certificate
- ✅ Monitoring dashboard

**Backend URL**: `https://__________________.onrender.com`  
**Frontend URL**: `https://__________________.vercel.app`

---

**Chúc bạn deploy thành công! 🎉**

Bất kỳ câu hỏi nào, hãy check `/RENDER_DEPLOYMENT_GUIDE.md` hoặc Render docs!

