# AWS Hosting Strategy for LoanSathi

## Architecture Overview
```
Internet → CloudFront (CDN) → S3 (Static Hosting) → Route 53 (DNS)
```

## Deployment Options

### Option A: Static Hosting (Recommended - Cost Effective)
**Services**: S3 + CloudFront + Route 53
**Cost**: ~$1-5/month for low-medium traffic

#### Steps:
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://loansathi-app --region us-east-1
   ```

3. **Configure S3 for Static Hosting**
   ```bash
   aws s3 website s3://loansathi-app --index-document index.html --error-document index.html
   ```

4. **Upload Build Files**
   ```bash
   aws s3 sync dist/ s3://loansathi-app --delete
   ```

5. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::loansathi-app/*"
       }
     ]
   }
   ```

6. **Setup CloudFront Distribution**
   - Origin: S3 bucket endpoint
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)
   - Compress objects: Yes
   - Price class: Use only US, Canada and Europe

7. **Configure Custom Domain (Optional)**
   - Register domain in Route 53
   - Create SSL certificate in ACM
   - Point CloudFront to custom domain

### Option B: Container Hosting
**Services**: ECS Fargate + ALB + Route 53
**Cost**: ~$15-30/month

#### Steps:
1. **Push to ECR**
   ```bash
   aws ecr create-repository --repository-name loansathi
   docker tag loansathi:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/loansathi:latest
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/loansathi:latest
   ```

2. **Create ECS Cluster**
3. **Define Task Definition**
4. **Create Service with Load Balancer**
5. **Configure Auto Scaling**

## Cost Estimation
- **Static Hosting**: $1-5/month (recommended)
- **Container Hosting**: $15-30/month
- **Domain**: $12/year
- **SSL Certificate**: Free (ACM)

## Benefits
- Global CDN with CloudFront
- 99.99% uptime SLA
- Auto-scaling
- SSL/TLS encryption
- DDoS protection
