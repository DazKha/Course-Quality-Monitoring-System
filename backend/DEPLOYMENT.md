# 🚀 Backend Deployment Guide

## Quick Deploy to Render

### Prerequisites
- GitHub account with your code pushed
- Render account (free): https://dashboard.render.com/

### One-Click Deploy Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: `mooc-quality-monitor-api`
     - **Region**: `Singapore`
     - **Root Directory**: `backend`
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - `PYTHON_VERSION`: `3.11.0`
   - `ALLOWED_ORIGINS`: `*` (update later with your frontend URL)

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deploy
   - Copy your app URL

### Test Your Deployed API

```bash
# Replace YOUR_APP_URL with your Render URL
export API_URL="https://your-app.onrender.com"

# Health check
curl $API_URL/

# Test endpoints
curl $API_URL/api/historical-data | jq '.[0]'
curl $API_URL/api/ongoing-prediction | jq '.[0]'
curl $API_URL/api/stats?type=historical | jq
```

Or use the test script:
```bash
./test_api.sh https://your-app.onrender.com
```

## Files for Deployment

- ✅ `requirements.txt` - Python dependencies
- ✅ `start.sh` - Startup script
- ✅ `main.py` - FastAPI application with CORS config
- ✅ `../render.yaml` - Render configuration (optional, for Infrastructure as Code)

## Important Notes

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30-50 seconds
- 750 hours/month (enough for always-on with one service)

### Keep Service Awake
Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 5-10 minutes.

### Update CORS After Frontend Deploy
Once you deploy frontend, update `ALLOWED_ORIGINS`:
```bash
# In Render Dashboard → Environment
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | Yes (Auto) | 10000 | Port to run server (provided by Render) |
| `PYTHON_VERSION` | No | 3.11 | Python version |
| `ALLOWED_ORIGINS` | Yes | * | CORS allowed origins (comma-separated) |

## Troubleshooting

### Build Failed
- Check `requirements.txt` syntax
- Verify Python version compatibility
- Check build logs in Render dashboard

### Server Won't Start
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Check that port uses `$PORT` variable
- Review runtime logs

### 502 Bad Gateway
- Check memory usage (512MB limit on free tier)
- Look for crashes in logs
- Verify data files are included in repository

### CORS Errors
- Update `ALLOWED_ORIGINS` environment variable
- Include full URL with protocol (https://)
- Separate multiple origins with commas

## Monitoring

### View Logs
```bash
# In Render Dashboard
Services → Your Service → Logs
```

### Check Service Status
```bash
curl -I https://your-app.onrender.com/
```

### Monitor Response Time
```bash
time curl -o /dev/null -s -w "Time: %{time_total}s\n" https://your-app.onrender.com/api/stats?type=historical
```

## Auto-Deploy

Render automatically deploys when you push to the connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will auto-deploy in ~2-5 minutes
```

## Manual Redeploy

In Render Dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy" if needed

## Upgrade to Paid Plan

To avoid cold starts and get better performance:
- Starter Plan: $7/month
- Standard Plan: $25/month

Benefits:
- No cold starts
- More memory & CPU
- Higher request limits
- Better support

## Next Steps

1. ✅ Deploy backend to Render
2. ⬜ Get backend URL
3. ⬜ Deploy frontend (Vercel/Netlify)
4. ⬜ Update frontend with backend URL
5. ⬜ Update backend CORS with frontend URL
6. ⬜ Setup monitoring (UptimeRobot)
7. ⬜ Test full application

## Support

- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- GitHub Issues: Create issue in your repository

---

**Happy Deploying! 🎉**

