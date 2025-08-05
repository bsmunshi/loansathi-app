import React, { useState, useEffect } from 'react';
import { Scale, Plus, Trash2, Award, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const LoanComparisonCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [loanTenure, setLoanTenure] = useState(20);
  
  const [loans, setLoans] = useState([
    {
      id: 1,
      bankName: 'SBI Home Loan',
      interestRate: 8.5,
      processingFee: 0.35,
      processingFeeType: 'percentage', // 'percentage' or 'fixed'
      prepaymentCharges: 2,
      insurance: 5000,
      legalCharges: 15000,
      otherCharges: 10000
    },
    {
      id: 2,
      bankName: 'HDFC Home Loan',
      interestRate: 8.75,
      processingFee: 3000,
      processingFeeType: 'fixed',
      prepaymentCharges: 0,
      insurance: 7000,
      legalCharges: 20000,
      otherCharges: 8000
    },
    {
      id: 3,
      bankName: 'ICICI Home Loan',
      interestRate: 8.65,
      processingFee: 0.5,
      processingFeeType: 'percentage',
      prepaymentCharges: 1,
      insurance: 6000,
      legalCharges: 18000,
      otherCharges: 12000
    }
  ]);

  const [results, setResults] = useState([]);

  const calculateLoanComparison = () => {
    const calculatedResults = loans.map(loan => {
      const monthlyRate = loan.interestRate / (12 * 100);
      const totalMonths = loanTenure * 12;
      
      // EMI Calculation
      const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                  (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      // Total amount payable
      const totalAmount = emi * totalMonths;
      const totalInterest = totalAmount - loanAmount;
      
      // Processing fee calculation
      const processingFeeAmount = loan.processingFeeType === 'percentage' 
        ? (loanAmount * loan.processingFee) / 100
        : loan.processingFee;
      
      // Total upfront costs
      const totalUpfrontCosts = processingFeeAmount + loan.insurance + loan.legalCharges + loan.otherCharges;
      
      // Prepayment charges (if you prepay 20% after 5 years)
      const prepaymentAmount = loanAmount * 0.2;
      const prepaymentChargesAmount = (prepaymentAmount * loan.prepaymentCharges) / 100;
      
      // Total cost of loan (including all charges)
      const totalCostOfLoan = totalAmount + totalUpfrontCosts + prepaymentChargesAmount;
      
      return {
        ...loan,
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        processingFeeAmount: Math.round(processingFeeAmount),
        totalUpfrontCosts: Math.round(totalUpfrontCosts),
        prepaymentChargesAmount: Math.round(prepaymentChargesAmount),
        totalCostOfLoan: Math.round(totalCostOfLoan)
      };
    });

    // Sort by total cost of loan (best deal first)
    calculatedResults.sort((a, b) => a.totalCostOfLoan - b.totalCostOfLoan);
    
    setResults(calculatedResults);
  };

  useEffect(() => {
    calculateLoanComparison();
  }, [loans, loanAmount, loanTenure]);

  const addLoan = () => {
    const newLoan = {
      id: Date.now(),
      bankName: `Bank ${loans.length + 1}`,
      interestRate: 9.0,
      processingFee: 0.5,
      processingFeeType: 'percentage',
      prepaymentCharges: 2,
      insurance: 5000,
      legalCharges: 15000,
      otherCharges: 10000
    };
    setLoans([...loans, newLoan]);
  };

  const removeLoan = (id) => {
    if (loans.length > 2) {
      setLoans(loans.filter(loan => loan.id !== id));
    }
  };

  const updateLoan = (id, field, value) => {
    setLoans(loans.map(loan => 
      loan.id === id 
        ? { ...loan, [field]: field === 'bankName' || field === 'processingFeeType' ? value : (parseFloat(value) || 0) }
        : loan
    ));
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Chart data
  const chartData = results.map((loan, index) => ({
    name: loan.bankName.split(' ')[0], // Short name for chart
    EMI: loan.emi,
    'Total Interest': loan.totalInterest,
    'Upfront Costs': loan.totalUpfrontCosts,
    'Total Cost': loan.totalCostOfLoan,
    rank: index + 1
  }));

  const bestLoan = results[0];
  const savings = results.length > 1 ? results[results.length - 1].totalCostOfLoan - bestLoan?.totalCostOfLoan : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Scale className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Comparison Calculator</h1>
        <p className="text-gray-600">Compare multiple loan offers to find the best deal for your needs</p>
      </div>

      {/* Loan Parameters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Parameters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2500000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (Years)</label>
            <input
              type="range"
              min="5"
              max="30"
              value={loanTenure}
              onChange={(e) => setLoanTenure(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5</span>
              <span className="font-medium text-primary-600">{loanTenure} years</span>
              <span>30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Deal Summary */}
      {bestLoan && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Best Deal: {bestLoan.bankName}</h2>
                <p className="text-green-600">Lowest total cost of loan</p>
              </div>
            </div>
            {savings > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">You save</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(savings)}</p>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(bestLoan.emi)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-lg font-bold text-gray-900">{bestLoan.interestRate}%</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(bestLoan.totalInterest)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(bestLoan.totalCostOfLoan)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loan Comparison Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="EMI" fill="#3B82F6" name="Monthly EMI" />
              <Bar dataKey="Total Interest" fill="#EF4444" name="Total Interest" />
              <Bar dataKey="Upfront Costs" fill="#F59E0B" name="Upfront Costs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loan Input Forms */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Loan Offers</h2>
          <button
            onClick={addLoan}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Loan
          </button>
        </div>

        <div className="grid gap-6">
          {loans.map((loan, index) => (
            <div key={loan.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Loan Option {index + 1}
                  {results[index] && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      index === 0 ? 'bg-green-100 text-green-800' : 
                      index === 1 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      Rank #{results.findIndex(r => r.id === loan.id) + 1}
                    </span>
                  )}
                </h3>
                {loans.length > 2 && (
                  <button
                    onClick={() => removeLoan(loan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={loan.bankName}
                    onChange={(e) => updateLoan(loan.id, 'bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loan.interestRate}
                    onChange={(e) => updateLoan(loan.id, 'interestRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee</label>
                  <div className="flex">
                    <input
                      type="number"
                      step="0.01"
                      value={loan.processingFee}
                      onChange={(e) => updateLoan(loan.id, 'processingFee', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <select
                      value={loan.processingFeeType}
                      onChange={(e) => updateLoan(loan.id, 'processingFeeType', e.target.value)}
                      className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">₹</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prepayment Charges (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loan.prepaymentCharges}
                    onChange={(e) => updateLoan(loan.id, 'prepaymentCharges', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance (₹)</label>
                  <input
                    type="number"
                    value={loan.insurance}
                    onChange={(e) => updateLoan(loan.id, 'insurance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legal Charges (₹)</label>
                  <input
                    type="number"
                    value={loan.legalCharges}
                    onChange={(e) => updateLoan(loan.id, 'legalCharges', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges (₹)</label>
                  <input
                    type="number"
                    value={loan.otherCharges}
                    onChange={(e) => updateLoan(loan.id, 'otherCharges', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results for this loan */}
              {results.find(r => r.id === loan.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Monthly EMI:</span>
                      <span className="font-semibold ml-2">{formatCurrency(results.find(r => r.id === loan.id).emi)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-semibold ml-2">{formatCurrency(results.find(r => r.id === loan.id).totalInterest)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Upfront Costs:</span>
                      <span className="font-semibold ml-2">{formatCurrency(results.find(r => r.id === loan.id).totalUpfrontCosts)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-semibold ml-2">{formatCurrency(results.find(r => r.id === loan.id).totalCostOfLoan)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Loan Comparison Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>Look beyond interest rates:</strong> Consider all fees and charges</li>
          <li>• <strong>Check prepayment terms:</strong> Some banks charge penalties for early repayment</li>
          <li>• <strong>Compare total cost:</strong> The loan with lowest EMI may not be cheapest overall</li>
          <li>• <strong>Read fine print:</strong> Watch for hidden charges and conditions</li>
          <li>• <strong>Negotiate:</strong> Use comparison data to negotiate better terms</li>
          <li>• <strong>Consider service quality:</strong> Factor in bank's customer service and processing time</li>
        </ul>
      </div>
    </div>
  );
};

export default LoanComparisonCalculator;
