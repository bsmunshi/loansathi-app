import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IndianRupee, Calendar, Percent } from 'lucide-react';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [loanType, setLoanType] = useState('home');
  const [results, setResults] = useState({});

  const loanTypes = {
    home: { name: 'Home Loan', rate: 8.5, maxTenure: 30 },
    personal: { name: 'Personal Loan', rate: 12.0, maxTenure: 7 },
    car: { name: 'Car Loan', rate: 9.5, maxTenure: 7 },
    education: { name: 'Education Loan', rate: 10.0, maxTenure: 15 },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const tenure = parseFloat(loanTenure) * 12;

    if (principal && rate && tenure) {
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const totalAmount = emi * tenure;
      const totalInterest = totalAmount - principal;

      setResults({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: Math.round(principal),
      });
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    setInterestRate(loanTypes[loanType].rate);
  }, [loanType]);

  const pieData = [
    { name: 'Principal', value: results.principal, color: '#0ea5e9' },
    { name: 'Interest', value: results.totalInterest, color: '#f59e0b' },
  ];

  const generateYearlyBreakdown = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const tenure = parseFloat(loanTenure) * 12;
    const emi = results.emi;

    let balance = principal;
    const yearlyData = [];

    for (let year = 1; year <= Math.min(loanTenure, 10); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12 && balance > 0; month++) {
        const interestPayment = balance * rate;
        const principalPayment = emi - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }

      yearlyData.push({
        year: `Year ${year}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
      });

      if (balance <= 0) break;
    }

    return yearlyData;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">EMI Calculator</h2>
        <p className="text-gray-600">Calculate your Equated Monthly Installment for various loan types</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Loan Details</h3>
          
          <div className="space-y-6">
            {/* Loan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="input-field"
              >
                {Object.entries(loanTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Loan Amount */}
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
              <div className="flex flex-wrap gap-2 mt-2">
                {[1000000, 2500000, 5000000, 10000000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="inline w-4 h-4 mr-1" />
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

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Math.min(e.target.value, loanTypes[loanType].maxTenure))}
                max={loanTypes[loanType].maxTenure}
                className="input-field"
                placeholder="Enter loan tenure"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum tenure for {loanTypes[loanType].name}: {loanTypes[loanType].maxTenure} years
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Calculation Results</h3>
          
          {results.emi && (
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-primary-600 font-medium">Monthly EMI</p>
                  <p className="text-3xl font-bold text-primary-700">{formatCurrency(results.emi)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(results.totalAmount)}</p>
                </div>
                <div className="bg-warning-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-warning-600">Total Interest</p>
                  <p className="text-lg font-semibold text-warning-700">{formatCurrency(results.totalInterest)}</p>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yearly Breakdown Chart */}
      {results.emi && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Yearly Payment Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateYearlyBreakdown()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="principal" stackId="a" fill="#0ea5e9" name="Principal" />
                <Bar dataKey="interest" stackId="a" fill="#f59e0b" name="Interest" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
