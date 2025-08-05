# LoanSathi - Smart Loan Calculator for India 🇮🇳

A comprehensive loan calculator web application designed specifically for the Indian market. Calculate EMIs, borrowing capacity, and prepayment benefits with a beautiful, mobile-friendly interface.

## Features

### 🧮 EMI Calculator
- Calculate Equated Monthly Installments for various loan types
- Support for Home, Personal, Car, and Education loans
- Interactive charts showing payment breakdown
- Yearly payment analysis

### 💰 Borrowing Capacity Calculator
- Determine maximum loan amount based on income
- FOIR (Fixed Obligation to Income Ratio) compliance
- Separate calculations for salaried and self-employed
- Income allocation visualization

### 🎯 Prepayment Benefits Calculator
- Compare scenarios with and without prepayments
- Support for lump-sum and monthly extra payments
- Calculate interest savings and tenure reduction
- Visual comparison charts

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   ```
   http://localhost:3000
   ```

### Manual Docker Build

1. **Build the image**
   ```bash
   docker build -t loansathi .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:80 loansathi
   ```

## Sharing with Others

To share this application with others for review:

1. **Export Docker image**
   ```bash
   docker save loansathi:latest | gzip > loansathi.tar.gz
   ```

2. **Share the compressed file** along with these instructions:

   **For reviewers:**
   ```bash
   # Load the image
   docker load < loansathi.tar.gz
   
   # Run the application
   docker run -p 3000:80 loansathi:latest
   
   # Access at http://localhost:3000
   ```

## Indian Market Features

- **Currency**: All calculations in Indian Rupees (₹)
- **FOIR Compliance**: 55% for salaried, 45% for self-employed
- **Loan Types**: Common Indian loan products
- **Interest Rates**: Market-realistic rates
- **Tenure Limits**: As per Indian banking norms

## Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Health Check

The application includes a health check endpoint at `/health` for monitoring.

## Production Considerations

- Nginx serves static files with proper caching headers
- Gzip compression enabled
- Security headers configured
- Client-side routing support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for Indian borrowers**
