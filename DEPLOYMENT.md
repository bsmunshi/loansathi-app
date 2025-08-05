# 🚀 LoanSathi Deployment Guide

Choose your preferred hosting strategy based on your needs:

## 🎯 Quick Recommendations

| Use Case | Platform | Cost | Setup Time | Command |
|----------|----------|------|------------|---------|
| **Quick Demo** | Vercel | Free | 2 minutes | `./deployment/deploy-vercel.sh` |
| **Production** | AWS S3+CloudFront | $1-5/month | 10 minutes | `./deployment/deploy-aws.sh` |
| **Container** | Railway | $5/month | 5 minutes | See container guide |
| **Enterprise** | AWS ECS | $15-30/month | 30 minutes | See AWS strategy |

## 🆓 Free Hosting Options

### 1. Vercel (Recommended)
```bash
./deployment/deploy-vercel.sh
```
- ✅ Global CDN
- ✅ Auto SSL
- ✅ Custom domains
- ✅ Instant deployments

### 2. Netlify
```bash
./deployment/deploy-netlify.sh
```
- ✅ Form handling
- ✅ Edge functions
- ✅ Split testing

### 3. GitHub Pages
```bash
npm run build
npm run deploy  # Add gh-pages script first
```

## 💰 Paid Hosting Options

### AWS (Production Ready)
```bash
# Static hosting (Recommended)
./deployment/deploy-aws.sh

# With CloudFront CDN
./deployment/setup-cloudfront.sh bucket-name domain.com
```

**Features:**
- Global CDN with CloudFront
- 99.99% uptime SLA
- DDoS protection
- Custom domains with SSL

### Container Hosting
- **Railway**: $5/month - Easiest container deployment
- **Render**: $7/month - Great developer experience
- **Google Cloud Run**: Pay-per-use - Most cost-effective
- **DigitalOcean**: $5/month - Simple and reliable

## 🔄 CI/CD Pipeline

### GitHub Actions (Included)
Automatically deploys on every push to main branch:

1. **Setup Secrets** in GitHub repository:
   - `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID` (for Vercel)
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` (for AWS)

2. **Push to main branch** - automatic deployment!

### Manual Deployment Commands

```bash
# Build locally
npm run build

# Deploy to different platforms
./deployment/deploy-vercel.sh    # Vercel
./deployment/deploy-netlify.sh   # Netlify
./deployment/deploy-aws.sh       # AWS S3
```

## 🌐 Custom Domain Setup

### Free Platforms (Vercel/Netlify)
1. Deploy your app
2. Go to platform dashboard
3. Add custom domain
4. Update DNS records as instructed

### AWS
1. Register domain in Route 53
2. Request SSL certificate in ACM
3. Create CloudFront distribution
4. Point domain to CloudFront

## 📊 Performance Optimization

### Already Included:
- ✅ Gzip compression
- ✅ Asset caching
- ✅ Code splitting
- ✅ Minification

### Additional Optimizations:
- Use CloudFront for global CDN
- Enable HTTP/2
- Implement service worker (PWA)
- Add performance monitoring

## 🔒 Security Features

### Included:
- ✅ HTTPS/SSL encryption
- ✅ Security headers
- ✅ XSS protection
- ✅ Content Security Policy

## 📈 Monitoring & Analytics

### Recommended Tools:
- **Google Analytics** - User behavior
- **Vercel Analytics** - Performance metrics
- **AWS CloudWatch** - Infrastructure monitoring
- **Sentry** - Error tracking

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version (requires 18+)
2. **404 on refresh**: Ensure SPA routing is configured
3. **Slow loading**: Enable CDN and compression
4. **SSL issues**: Use platform-provided SSL certificates

### Support Commands:
```bash
# Check build locally
npm run build && npm run preview

# Test production build
docker build -t loansathi . && docker run -p 3000:80 loansathi

# Debug deployment
./deployment/deploy-vercel.sh --debug
```

## 🎉 Go Live Checklist

- [ ] Choose hosting platform
- [ ] Run deployment script
- [ ] Test all calculator functions
- [ ] Verify mobile responsiveness
- [ ] Setup custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Setup monitoring (optional)

---

**Need help?** Check the detailed guides in the `/deployment` folder or create an issue in the repository.
