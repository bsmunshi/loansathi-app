import React, { useState, useEffect } from 'react';
import { CreditCard, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CreditCardCalculator = () => {
  const [inputs, setInputs] = useState({
    currentBalance: 50000,
    interestRate: 36,
    minimumPaymentPercent: 5,
    customPayment: 5000,
    paymentStrategy: 'custom'
  });

  const [results, setResults] = useState({});

  const calculatePayoff = () => {
    const { currentBalance, interestRate, minimumPaymentPercent, customPayment, paymentStrategy } = inputs;
    
    const monthlyRate = interestRate / (12 * 100);
    const minimumPayment = Math.max((currentBalance * minimumPaymentPercent) / 100, 500); // Min ₹500
    
    let paymentAmount;
    switch (paymentStrategy) {
      case 'minimum':
        paymentAmount = minimumPayment;
        break;
      case 'custom':
        paymentAmount = Math.max(customPayment, minimumPayment);
        break;
      case 'aggressive':
        paymentAmount = currentBalance * 0.1; // 10% of balance
        break;
      default:
        paymentAmount = customPayment;
    }

    // Calculate payoff scenarios
    const scenarios = [
      { name: 'Minimum Payment', payment: minimumPayment, color: '#EF4444' },
      { name: 'Your Payment', payment: paymentAmount, color: '#3B82F6' },
      { name: 'Aggressive (10%)', payment: currentBalance * 0.1, color: '#10B981' }
    ];

    const calculatedScenarios = scenarios.map(scenario => {
      let balance = currentBalance;
      let totalInterest = 0;
      let months = 0;
      const monthlyData = [];
      
      while (balance > 1 && months < 600) { // Max 50 years to prevent infinite loop
        const interestCharge = balance * monthlyRate;
        const principalPayment = Math.min(scenario.payment - interestCharge, balance);
        
        if (principalPayment <= 0) {
          // Payment is less than interest - debt will never be paid off
          return {
            ...scenario,
            months: 'Never',
            totalInterest: 'Infinite',
            totalAmount: 'Infinite',
            monthlyData: [],
            warning: 'Payment too low - debt will never be paid off!'
          };
        }
        
        balance -= principalPayment;
        totalInterest += interestCharge;
        months++;
        
        if (months <= 60) { // Store first 5 years of data for chart
          monthlyData.push({
            month: months,
            balance: Math.max(0, balance),
            interestPaid: totalInterest,
            payment: scenario.payment
          });
        }
      }
      
      return {
        ...scenario,
        months,
        years: Math.round((months / 12) * 10) / 10,
        totalInterest,
        totalAmount: currentBalance + totalInterest,
        monthlyData,
        savings: 0 // Will be calculated relative to minimum payment
      };
    });

    // Calculate savings relative to minimum payment scenario
    const minimumScenario = calculatedScenarios[0];
    calculatedScenarios.forEach(scenario => {
      if (scenario.name !== 'Minimum Payment' && typeof minimumScenario.totalInterest === 'number') {
        scenario.savings = minimumScenario.totalInterest - scenario.totalInterest;
        scenario.timeSaved = minimumScenario.months - scenario.months;
      }
    });

    setResults({
      scenarios: calculatedScenarios,
      currentScenario: calculatedScenarios.find(s => s.payment === paymentAmount) || calculatedScenarios[1],
      minimumPayment,
      monthlyRate: monthlyRate * 100
    });
  };

  useEffect(() => {
    calculatePayoff();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'paymentStrategy' ? value : (parseFloat(value) || 0)
    }));
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatTime = (months) => {
    if (typeof months !== 'number') return months;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Card Payoff Calculator</h1>
        <p className="text-gray-600">Calculate how long it will take to pay off your credit card debt and how much you can save</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Card Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.currentBalance}
                  onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</label>
              <input
                type="range"
                min="12"
                max="48"
                step="0.5"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>12%</span>
                <span className="font-medium text-primary-600">{inputs.interestRate}%</span>
                <span>48%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payment (%)</label>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={inputs.minimumPaymentPercent}
                onChange={(e) => handleInputChange('minimumPaymentPercent', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>2%</span>
                <span className="font-medium text-primary-600">{inputs.minimumPaymentPercent}%</span>
                <span>10%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: {formatCurrency(Math.max((inputs.currentBalance * inputs.minimumPaymentPercent) / 100, 500))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Strategy</label>
              <select
                value={inputs.paymentStrategy}
                onChange={(e) => handleInputChange('paymentStrategy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="minimum">Minimum Payment Only</option>
                <option value="custom">Custom Payment</option>
                <option value="aggressive">Aggressive (10% of balance)</option>
              </select>
            </div>

            {inputs.paymentStrategy === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={inputs.customPayment}
                    onChange={(e) => handleInputChange('customPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>
              </div>
            )}

            {/* Monthly Interest Info */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Monthly Interest</span>
              </div>
              <p className="text-yellow-700 text-sm">
                You're paying approximately <strong>{formatCurrency(inputs.currentBalance * (inputs.interestRate / 1200))}</strong> in interest each month!
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payoff Scenarios Comparison</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {results.scenarios?.map((scenario, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  scenario.name === 'Your Payment' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <h3 className={`font-semibold text-sm ${
                      scenario.name === 'Your Payment' ? 'text-primary-700' : 'text-gray-700'
                    }`}>{scenario.name}</h3>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(scenario.payment)}/month</p>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Time:</span>
                        <span className="font-medium">{formatTime(scenario.months)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Interest:</span>
                        <span className="font-medium">{formatCurrency(scenario.totalInterest)}</span>
                      </div>
                      {scenario.savings > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                          <span>Savings:</span>
                          <span className="font-medium">{formatCurrency(scenario.savings)}</span>
                        </div>
                      )}
                    </div>
                    
                    {scenario.warning && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                        {scenario.warning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Insights */}
            {results.currentScenario && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Key Insights</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p>• <strong>Total Amount Paid:</strong> {formatCurrency(results.currentScenario.totalAmount)}</p>
                    <p>• <strong>Interest Paid:</strong> {formatCurrency(results.currentScenario.totalInterest)}</p>
                  </div>
                  <div>
                    <p>• <strong>Payoff Time:</strong> {formatTime(results.currentScenario.months)}</p>
                    {results.currentScenario.savings > 0 && (
                      <p>• <strong>Money Saved:</strong> {formatCurrency(results.currentScenario.savings)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payoff Timeline Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Reduction Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.currentScenario?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name]}
                    labelFormatter={(month) => `Month ${month}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Remaining Balance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interestPaid" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Total Interest Paid"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">💳 Credit Card Debt Tips</h3>
            <ul className="space-y-2 text-green-800">
              <li>• <strong>Pay more than minimum:</strong> Even ₹1,000 extra can save thousands in interest</li>
              <li>• <strong>Stop using the card:</strong> Don't add new debt while paying off existing balance</li>
              <li>• <strong>Consider balance transfer:</strong> Look for 0% APR offers to reduce interest</li>
              <li>• <strong>Pay highest interest first:</strong> If you have multiple cards, prioritize highest APR</li>
              <li>• <strong>Set up auto-pay:</strong> Never miss a payment to avoid late fees and penalty APR</li>
              <li>• <strong>Emergency fund:</strong> Build savings to avoid future credit card debt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardCalculator;
