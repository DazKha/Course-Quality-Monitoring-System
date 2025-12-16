# ✅ Deploy Checklist - MOOC Quality Monitor

## 📝 Checklist trước khi Deploy

### 1. Files đã chuẩn bị
- [x] `render.yaml` - Render configuration
- [x] `backend/requirements.txt` - Python dependencies với versions cụ thể
- [x] `backend/start.sh` - Start script
- [x] `backend/main.py` - CORS configuration updated
- [x] `.gitignore` - Đảm bảo không commit file không cần thiết

### 2. Git Repository
- [ ] Code đã commit hết
- [ ] Push lên GitHub
- [ ] Branch `main` tồn tại

### 3. Data Files
- [ ] Folder `/data` có đầy đủ file CSV:
  - `historical_courses.csv`
  - `predicted/course_engagement_by_course_G1_with_predictions.csv`
  - `predicted/course_engagement_by_course_G2_with_predictions.csv`
  - `predicted/course_engagement_by_course_G3_with_predictions.csv`

## 🚀 Các bước Deploy

### Backend (Render)

1. [ ] Tạo tài khoản Render: https://dashboard.render.com/
2. [ ] New Web Service → Connect GitHub
3. [ ] Chọn repository
4. [ ] Cấu hình:
   - Name: `mooc-quality-monitor-api`
   - Region: `Singapore`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. [ ] Environment Variables:
   - `PYTHON_VERSION`: `3.11.0`
   - `ALLOWED_ORIGINS`: `*` (sẽ update sau)
6. [ ] Chọn Free plan
7. [ ] Create Web Service
8. [ ] Đợi deploy (5-10 phút)
9. [ ] Copy URL (ví dụ: `https://mooc-quality-monitor-api.onrender.com`)

### Frontend (Vercel/Netlify)

#### Option A: Vercel (Recommended)

1. [ ] Tạo tài khoản Vercel: https://vercel.com/
2. [ ] Import GitHub repository
3. [ ] Framework: Vite
4. [ ] Root Directory: `frontend`
5. [ ] Environment Variables:
   - `VITE_API_URL`: URL backend từ Render
6. [ ] Deploy

#### Option B: Netlify

1. [ ] Tạo tài khoản Netlify: https://netlify.com/
2. [ ] Import GitHub repository
3. [ ] Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. [ ] Environment Variables:
   - `VITE_API_URL`: URL backend từ Render
5. [ ] Deploy

### Cập nhật CORS

1. [ ] Copy URL frontend sau khi deploy
2. [ ] Vào Render Dashboard → Service → Environment
3. [ ] Update `ALLOWED_ORIGINS` với frontend URL
4. [ ] Redeploy backend

## 🧪 Testing sau Deploy

### Backend Tests
```bash
# Health check
curl https://YOUR_BACKEND_URL.onrender.com/

# Historical data
curl https://YOUR_BACKEND_URL.onrender.com/api/historical-data | jq

# Ongoing predictions
curl https://YOUR_BACKEND_URL.onrender.com/api/ongoing-prediction | jq

# Stats
curl https://YOUR_BACKEND_URL.onrender.com/api/stats?type=historical | jq
```

### Frontend Tests
- [ ] Mở browser với URL frontend
- [ ] Check Dashboard load được
- [ ] Check Historical Data hiển thị chart
- [ ] Check Ongoing Prediction hiển thị data
- [ ] Check modal chi tiết course hoạt động
- [ ] Check filter buttons hoạt động
- [ ] Check responsive trên mobile

## ⚙️ Cấu hình Optional

### Keep Backend Awake (Tránh Free Tier Sleep)

1. [ ] Đăng ký UptimeRobot: https://uptimerobot.com/
2. [ ] Add Monitor:
   - Type: HTTP(s)
   - URL: `https://YOUR_BACKEND_URL.onrender.com/`
   - Interval: 5 minutes
3. [ ] Enable monitor

### Custom Domain

#### Backend (Render)
1. [ ] Render Dashboard → Settings → Custom Domain
2. [ ] Add domain và cấu hình DNS

#### Frontend (Vercel/Netlify)
1. [ ] Settings → Domains
2. [ ] Add custom domain
3. [ ] Configure DNS

## 📊 Monitoring & Maintenance

### Render Dashboard
- [ ] Check logs thường xuyên
- [ ] Monitor usage (trong Free tier)
- [ ] Setup email alerts

### Performance
- [ ] Test load time của API
- [ ] Monitor cold start (sau khi sleep)
- [ ] Check data consistency

## 🔧 Troubleshooting Common Issues

### Backend không start
✅ **Check:**
- Build logs trong Render
- Python version
- Requirements.txt có đầy đủ
- Start command đúng format
- Port configuration (`$PORT`)

### Frontend không kết nối Backend
✅ **Check:**
- CORS configuration
- API URL trong environment variables
- Network tab trong browser DevTools
- Backend có đang running không

### Data không load
✅ **Check:**
- CSV files đã commit vào git
- Đường dẫn file trong code
- Backend logs có error không
- Data format có đúng không

### 502 Bad Gateway
✅ **Check:**
- Backend có crash không (xem logs)
- Memory usage (Free tier có giới hạn)
- Dependencies có conflict không

## 📚 Useful Commands

```bash
# Check backend is running
curl -I https://YOUR_BACKEND_URL.onrender.com/

# Test API endpoint
curl https://YOUR_BACKEND_URL.onrender.com/api/stats?type=historical

# Build frontend locally to test
cd frontend
npm run build
npm run preview

# Test production build
cd frontend
npm run build && npm run preview
```

## 🎯 Final Steps

1. [ ] Document URLs:
   - Backend: `___________________________`
   - Frontend: `___________________________`
   
2. [ ] Share với team/instructor
3. [ ] Add README badge (optional)
4. [ ] Setup monitoring alerts
5. [ ] Backup important data

## 🎉 Deploy Complete!

Congratulations! Hệ thống của bạn đã online! 🚀

**Next Steps:**
- Monitor performance
- Collect user feedback
- Plan for upgrades/improvements
- Document any issues found

---

**URLs quan trọng:**
- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/YOUR_USERNAME/YOUR_REPO
- Documentation: `/RENDER_DEPLOYMENT_GUIDE.md`

