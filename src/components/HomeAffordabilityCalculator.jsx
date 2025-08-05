import React, { useState, useEffect } from 'react';
import { Home, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HomeAffordabilityCalculator = () => {
  const [inputs, setInputs] = useState({
    monthlyIncome: 100000,
    existingEMIs: 15000,
    downPaymentPercent: 20,
    loanTenure: 20,
    interestRate: 8.5,
    state: 'maharashtra'
  });

  const [results, setResults] = useState({});

  // State-wise stamp duty rates (approximate)
  const stampDutyRates = {
    maharashtra: 5,
    delhi: 6,
    karnataka: 5.6,
    gujarat: 4.9,
    tamilnadu: 7,
    telangana: 5,
    rajasthan: 5,
    westbengal: 6.5,
    other: 6
  };

  const calculateAffordability = () => {
    const { monthlyIncome, existingEMIs, downPaymentPercent, loanTenure, interestRate, state } = inputs;
    
    // FOIR calculation (40% for home loans)
    const maxEMI = (monthlyIncome * 0.40) - existingEMIs;
    
    if (maxEMI <= 0) {
      setResults({ error: "Your existing EMIs are too high. Consider reducing them before applying for a home loan." });
      return;
    }

    // Calculate maximum loan amount using EMI formula
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = loanTenure * 12;
    const maxLoanAmount = maxEMI * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)));
    
    // Calculate maximum home price
    const downPaymentAmount = (maxLoanAmount * downPaymentPercent) / (100 - downPaymentPercent);
    const maxHomePrice = maxLoanAmount + downPaymentAmount;
    
    // Additional costs
    const stampDuty = (maxHomePrice * stampDutyRates[state]) / 100;
    const registrationFee = Math.min(maxHomePrice * 0.01, 30000); // 1% or max ₹30,000
    const legalFees = maxHomePrice * 0.005; // 0.5%
    const processingFee = maxLoanAmount * 0.005; // 0.5% of loan amount
    const totalAdditionalCosts = stampDuty + registrationFee + legalFees + processingFee;
    
    // Total upfront cost
    const totalUpfrontCost = downPaymentAmount + totalAdditionalCosts;
    
    // Monthly breakdown
    const principalEMI = maxEMI;
    const totalInterest = (maxEMI * totalMonths) - maxLoanAmount;
    
    // Affordability ranges
    const conservativePrice = maxHomePrice * 0.8;
    const aggressivePrice = maxHomePrice * 1.1;

    setResults({
      maxHomePrice,
      maxLoanAmount,
      downPaymentAmount,
      maxEMI,
      totalUpfrontCost,
      stampDuty,
      registrationFee,
      legalFees,
      processingFee,
      totalInterest,
      conservativePrice,
      aggressivePrice,
      monthlyIncome,
      availableIncome: monthlyIncome - existingEMIs - maxEMI
    });
  };

  useEffect(() => {
    calculateAffordability();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Chart data
  const costBreakdownData = results.maxHomePrice ? [
    { name: 'Loan Amount', value: results.maxLoanAmount, color: '#3B82F6' },
    { name: 'Down Payment', value: results.downPaymentAmount, color: '#10B981' },
    { name: 'Stamp Duty', value: results.stampDuty, color: '#F59E0B' },
    { name: 'Other Costs', value: results.registrationFee + results.legalFees + results.processingFee, color: '#EF4444' }
  ] : [];

  const affordabilityRanges = results.maxHomePrice ? [
    { range: 'Conservative', amount: results.conservativePrice, description: 'Safe choice' },
    { range: 'Optimal', amount: results.maxHomePrice, description: 'Maximum affordable' },
    { range: 'Aggressive', amount: results.aggressivePrice, description: 'Stretch budget' }
  ] : [];

  if (results.error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Home className="mx-auto h-12 w-12 text-primary-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Affordability Calculator</h1>
          <p className="text-gray-600">Calculate how much home you can afford based on your income</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Unable to Calculate</h3>
              <p className="text-red-700 mt-1">{results.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Home className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Affordability Calculator</h1>
        <p className="text-gray-600">Calculate how much home you can afford based on your income and financial situation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Financial Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing EMIs</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.existingEMIs}
                  onChange={(e) => handleInputChange('existingEMIs', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (%)</label>
              <input
                type="range"
                min="10"
                max="50"
                value={inputs.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>10%</span>
                <span className="font-medium text-primary-600">{inputs.downPaymentPercent}%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (Years)</label>
              <input
                type="range"
                min="5"
                max="30"
                value={inputs.loanTenure}
                onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>5</span>
                <span className="font-medium text-primary-600">{inputs.loanTenure} years</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="range"
                min="6.5"
                max="12"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>6.5%</span>
                <span className="font-medium text-primary-600">{inputs.interestRate}%</span>
                <span>12%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={inputs.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="gujarat">Gujarat</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="telangana">Telangana</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="westbengal">West Bengal</option>
                <option value="other">Other States</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Affordability Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Home Affordability Summary</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {affordabilityRanges.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  item.range === 'Optimal' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <h3 className={`font-semibold ${
                      item.range === 'Optimal' ? 'text-primary-700' : 'text-gray-700'
                    }`}>{item.range}</h3>
                    <p className={`text-2xl font-bold ${
                      item.range === 'Optimal' ? 'text-primary-600' : 'text-gray-900'
                    }`}>{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Loan Amount:</span>
                  <span className="font-semibold">{formatCurrency(results.maxLoanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment Required:</span>
                  <span className="font-semibold">{formatCurrency(results.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI:</span>
                  <span className="font-semibold">{formatCurrency(results.maxEMI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Income After EMI:</span>
                  <span className="font-semibold">{formatCurrency(results.availableIncome)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stamp Duty:</span>
                  <span className="font-semibold">{formatCurrency(results.stampDuty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Fee:</span>
                  <span className="font-semibold">{formatCurrency(results.registrationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Legal & Processing:</span>
                  <span className="font-semibold">{formatCurrency(results.legalFees + results.processingFee)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Total Upfront Cost:</span>
                  <span className="font-bold text-lg">{formatCurrency(results.totalUpfrontCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Home Buying Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Keep your FOIR below 40% for comfortable repayment</li>
              <li>• Save at least 25-30% of home price for down payment and additional costs</li>
              <li>• Consider location, amenities, and future appreciation potential</li>
              <li>• Get pre-approved for loan to strengthen your negotiation position</li>
              <li>• Factor in maintenance costs (1-2% of property value annually)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAffordabilityCalculator;
