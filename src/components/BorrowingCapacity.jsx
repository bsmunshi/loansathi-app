import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, User, Building, Calculator } from 'lucide-react';

const BorrowingCapacity = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEMIs, setExistingEMIs] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(30000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [employmentType, setEmploymentType] = useState('salaried');
  const [results, setResults] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateBorrowingCapacity = () => {
    const income = parseFloat(monthlyIncome);
    const existingEmi = parseFloat(existingEMIs) || 0;
    const expenses = parseFloat(otherExpenses) || 0;
    const rate = parseFloat(interestRate) / 100 / 12;
    const tenure = parseFloat(loanTenure) * 12;

    // FOIR (Fixed Obligation to Income Ratio) limits
    const foirLimit = employmentType === 'salaried' ? 0.55 : 0.45; // 55% for salaried, 45% for self-employed
    
    // Calculate available income for EMI
    const maxAllowableEMI = income * foirLimit;
    const availableForNewEMI = maxAllowableEMI - existingEmi;
    
    // Deduct basic living expenses if not already accounted
    const netAvailableEMI = Math.max(0, availableForNewEMI - (expenses * 0.1)); // 10% buffer for expenses

    if (netAvailableEMI > 0 && rate > 0 && tenure > 0) {
      // Calculate loan amount using EMI formula: P = EMI * [(1+r)^n - 1] / [r * (1+r)^n]
      const loanAmount = netAvailableEMI * ((Math.pow(1 + rate, tenure) - 1) / (rate * Math.pow(1 + rate, tenure)));
      
      const totalPayment = netAvailableEMI * tenure;
      const totalInterest = totalPayment - loanAmount;

      setResults({
        maxLoanAmount: Math.round(loanAmount),
        maxEMI: Math.round(netAvailableEMI),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        foirUsed: ((existingEmi + netAvailableEMI) / income * 100).toFixed(1),
        availableIncome: Math.round(income - existingEmi - netAvailableEMI - expenses),
      });
    } else {
      setResults({
        maxLoanAmount: 0,
        maxEMI: 0,
        totalPayment: 0,
        totalInterest: 0,
        foirUsed: 0,
        availableIncome: Math.round(income - existingEmi - expenses),
      });
    }
  };

  useEffect(() => {
    calculateBorrowingCapacity();
  }, [monthlyIncome, existingEMIs, otherExpenses, interestRate, loanTenure, employmentType]);

  const incomeBreakdownData = [
    {
      category: 'Available for New EMI',
      amount: results.maxEMI || 0,
      color: '#22c55e',
    },
    {
      category: 'Existing EMIs',
      amount: parseFloat(existingEMIs) || 0,
      color: '#f59e0b',
    },
    {
      category: 'Other Expenses',
      amount: parseFloat(otherExpenses) || 0,
      color: '#ef4444',
    },
    {
      category: 'Remaining Income',
      amount: results.availableIncome || 0,
      color: '#0ea5e9',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Borrowing Capacity Calculator</h2>
        <p className="text-gray-600">Discover how much loan you can get based on your income and expenses</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Financial Profile</h3>
          
          <div className="space-y-6">
            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="input-field"
              >
                <option value="salaried">Salaried Employee</option>
                <option value="self-employed">Self Employed</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                FOIR limit: {employmentType === 'salaried' ? '55%' : '45%'} of gross income
              </p>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                Monthly Gross Income
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="input-field"
                placeholder="Enter monthly income"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setMonthlyIncome(amount)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing EMIs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calculator className="inline w-4 h-4 mr-1" />
                Existing EMIs (Monthly)
              </label>
              <input
                type="number"
                value={existingEMIs}
                onChange={(e) => setExistingEMIs(e.target.value)}
                className="input-field"
                placeholder="Enter existing EMI amount"
              />
            </div>

            {/* Other Monthly Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Other Monthly Expenses
              </label>
              <input
                type="number"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(e.target.value)}
                className="input-field"
                placeholder="Rent, utilities, food, etc."
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Interest Rate (% per annum)
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

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Loan Tenure (Years)
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

        {/* Results */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Borrowing Capacity</h3>
          
          <div className="space-y-4">
            <div className="bg-success-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-success-600 font-medium">Maximum Loan Amount</p>
                <p className="text-3xl font-bold text-success-700">{formatCurrency(results.maxLoanAmount || 0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg text-center">
                <p className="text-sm text-primary-600">Max EMI</p>
                <p className="text-lg font-semibold text-primary-700">{formatCurrency(results.maxEMI || 0)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">FOIR Used</p>
                <p className="text-lg font-semibold text-gray-900">{results.foirUsed || 0}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-warning-50 p-4 rounded-lg text-center">
                <p className="text-sm text-warning-600">Total Interest</p>
                <p className="text-lg font-semibold text-warning-700">{formatCurrency(results.totalInterest || 0)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600">Remaining Income</p>
                <p className="text-lg font-semibold text-blue-700">{formatCurrency(results.availableIncome || 0)}</p>
              </div>
            </div>

            {/* Eligibility Tips */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Tips to Increase Eligibility</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add co-applicant income to increase borrowing capacity</li>
                <li>• Close existing loans to reduce EMI burden</li>
                <li>• Maintain good credit score (750+) for better rates</li>
                <li>• Consider longer tenure to reduce EMI (but higher interest)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Income Breakdown Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Income Allocation</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeBreakdownData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Total Monthly Income: <span className="font-semibold">{formatCurrency(monthlyIncome)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BorrowingCapacity;
