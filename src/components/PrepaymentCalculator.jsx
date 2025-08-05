import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { IndianRupee, TrendingDown, Clock, PiggyBank } from 'lucide-react';

const PrepaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000);
  const [prepaymentYear, setPrepaymentYear] = useState(5);
  const [prepaymentType, setPrepaymentType] = useState('lump-sum');
  const [monthlyExtraPay, setMonthlyExtraPay] = useState(5000);
  const [results, setResults] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const calculatePrepaymentBenefits = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const tenure = parseFloat(loanTenure) * 12;
    const prepayment = parseFloat(prepaymentAmount);
    const prepaymentMonth = parseFloat(prepaymentYear) * 12;
    const extraMonthly = parseFloat(monthlyExtraPay);

    // Original loan calculations
    const originalEMI = calculateEMI(principal, interestRate, loanTenure);
    const originalTotalPayment = originalEMI * tenure;
    const originalTotalInterest = originalTotalPayment - principal;

    let results = {
      original: {
        emi: Math.round(originalEMI),
        totalPayment: Math.round(originalTotalPayment),
        totalInterest: Math.round(originalTotalInterest),
        tenure: loanTenure,
      }
    };

    if (prepaymentType === 'lump-sum') {
      // Lump sum prepayment calculation
      let balance = principal;
      let totalPaid = 0;
      let totalInterestPaid = 0;
      let month = 0;

      while (balance > 0 && month < tenure) {
        month++;
        const interestPayment = balance * rate;
        const principalPayment = originalEMI - interestPayment;
        
        balance -= principalPayment;
        totalPaid += originalEMI;
        totalInterestPaid += interestPayment;

        // Apply prepayment
        if (month === prepaymentMonth && balance > prepayment) {
          balance -= prepayment;
          totalPaid += prepayment;
        }

        if (balance <= 0) break;
      }

      results.withPrepayment = {
        totalPayment: Math.round(totalPaid),
        totalInterest: Math.round(totalInterestPaid),
        tenure: Math.round(month / 12 * 10) / 10,
        savings: Math.round(originalTotalPayment - totalPaid),
        tenureReduction: Math.round((loanTenure - month / 12) * 12),
      };

    } else {
      // Monthly extra payment calculation
      const newEMI = originalEMI + extraMonthly;
      let balance = principal;
      let totalPaid = 0;
      let totalInterestPaid = 0;
      let month = 0;

      while (balance > 0 && month < tenure) {
        month++;
        const interestPayment = balance * rate;
        const principalPayment = Math.min(newEMI - interestPayment, balance);
        
        balance -= principalPayment;
        totalPaid += interestPayment + principalPayment;
        totalInterestPaid += interestPayment;

        if (balance <= 0) break;
      }

      results.withPrepayment = {
        emi: Math.round(newEMI),
        totalPayment: Math.round(totalPaid),
        totalInterest: Math.round(totalInterestPaid),
        tenure: Math.round(month / 12 * 10) / 10,
        savings: Math.round(originalTotalPayment - totalPaid),
        tenureReduction: Math.round((loanTenure - month / 12) * 12),
      };
    }

    setResults(results);
  };

  useEffect(() => {
    calculatePrepaymentBenefits();
  }, [loanAmount, interestRate, loanTenure, prepaymentAmount, prepaymentYear, prepaymentType, monthlyExtraPay]);

  const generateComparisonData = () => {
    if (!results.original || !results.withPrepayment) return [];

    return [
      {
        scenario: 'Original Loan',
        totalPayment: results.original.totalPayment,
        totalInterest: results.original.totalInterest,
        tenure: results.original.tenure,
      },
      {
        scenario: 'With Prepayment',
        totalPayment: results.withPrepayment.totalPayment,
        totalInterest: results.withPrepayment.totalInterest,
        tenure: results.withPrepayment.tenure,
      },
    ];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prepayment Benefits Calculator</h2>
        <p className="text-gray-600">See how prepayments can save you money and reduce loan tenure</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Loan & Prepayment Details</h3>
          
          <div className="space-y-6">
            {/* Original Loan Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Original Loan Details</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IndianRupee className="inline w-4 h-4 mr-1" />
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="input-field"
                    placeholder="Enter loan amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="input-field"
                    placeholder="Enter interest rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Loan Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="input-field"
                    placeholder="Enter loan tenure"
                  />
                </div>
              </div>
            </div>

            {/* Prepayment Strategy */}
            <div className="bg-success-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Prepayment Strategy</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PiggyBank className="inline w-4 h-4 mr-1" />
                    Prepayment Type
                  </label>
                  <select
                    value={prepaymentType}
                    onChange={(e) => setPrepaymentType(e.target.value)}
                    className="input-field"
                  >
                    <option value="lump-sum">One-time Lump Sum</option>
                    <option value="monthly-extra">Monthly Extra Payment</option>
                  </select>
                </div>

                {prepaymentType === 'lump-sum' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prepayment Amount
                      </label>
                      <input
                        type="number"
                        value={prepaymentAmount}
                        onChange={(e) => setPrepaymentAmount(e.target.value)}
                        className="input-field"
                        placeholder="Enter prepayment amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prepayment Year
                      </label>
                      <input
                        type="number"
                        value={prepaymentYear}
                        onChange={(e) => setPrepaymentYear(Math.min(e.target.value, loanTenure - 1))}
                        max={loanTenure - 1}
                        className="input-field"
                        placeholder="Enter year of prepayment"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Monthly Payment
                    </label>
                    <input
                      type="number"
                      value={monthlyExtraPay}
                      onChange={(e) => setMonthlyExtraPay(e.target.value)}
                      className="input-field"
                      placeholder="Enter extra monthly amount"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Prepayment Benefits</h3>
          
          {results.original && results.withPrepayment && (
            <div className="space-y-6">
              {/* Savings Summary */}
              <div className="bg-success-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-success-600 font-medium">Total Interest Savings</p>
                  <p className="text-3xl font-bold text-success-700">
                    {formatCurrency(results.withPrepayment.savings)}
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-primary-600">Tenure Reduction</p>
                  <p className="text-lg font-semibold text-primary-700">
                    {results.withPrepayment.tenureReduction} months
                  </p>
                </div>
                <div className="bg-warning-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-warning-600">New Tenure</p>
                  <p className="text-lg font-semibold text-warning-700">
                    {results.withPrepayment.tenure} years
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Metric</th>
                      <th className="text-right py-2">Original</th>
                      <th className="text-right py-2">With Prepayment</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {prepaymentType === 'monthly-extra' && (
                      <tr className="border-b">
                        <td className="py-2">Monthly EMI</td>
                        <td className="text-right py-2">{formatCurrency(results.original.emi)}</td>
                        <td className="text-right py-2">{formatCurrency(results.withPrepayment.emi)}</td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2">Total Payment</td>
                      <td className="text-right py-2">{formatCurrency(results.original.totalPayment)}</td>
                      <td className="text-right py-2">{formatCurrency(results.withPrepayment.totalPayment)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Total Interest</td>
                      <td className="text-right py-2">{formatCurrency(results.original.totalInterest)}</td>
                      <td className="text-right py-2">{formatCurrency(results.withPrepayment.totalInterest)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Loan Tenure</td>
                      <td className="text-right py-2">{results.original.tenure} years</td>
                      <td className="text-right py-2">{results.withPrepayment.tenure} years</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Prepayment Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use bonuses, tax refunds for lump sum prepayments</li>
                  <li>• Check for prepayment penalties with your lender</li>
                  <li>• Consider tax implications of prepayment vs investments</li>
                  <li>• Prepay high-interest loans first</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Chart */}
      {results.original && results.withPrepayment && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Loan Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="totalPayment" fill="#0ea5e9" name="Total Payment" />
                <Bar dataKey="totalInterest" fill="#f59e0b" name="Total Interest" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepaymentCalculator;
