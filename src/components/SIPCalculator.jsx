import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const SIPCalculator = () => {
  const [inputs, setInputs] = useState({
    calculationType: 'amount', // 'amount' or 'goal'
    monthlyAmount: 10000,
    targetAmount: 1000000,
    investmentPeriod: 10,
    expectedReturn: 12,
    stepUpPercent: 10,
    stepUpFrequency: 'yearly', // 'yearly' or 'none'
    inflationRate: 6,
    taxSaving: false
  });

  const [results, setResults] = useState({});

  const calculateSIP = () => {
    const { 
      calculationType, 
      monthlyAmount, 
      targetAmount, 
      investmentPeriod, 
      expectedReturn, 
      stepUpPercent, 
      stepUpFrequency,
      inflationRate,
      taxSaving
    } = inputs;

    const monthlyRate = expectedReturn / (12 * 100);
    const totalMonths = investmentPeriod * 12;
    
    let yearlyData = [];
    let totalInvestment = 0;
    let currentSIP = monthlyAmount;
    
    if (calculationType === 'amount') {
      // Calculate maturity amount from SIP
      for (let year = 1; year <= investmentPeriod; year++) {
        let yearlyInvestment = 0;
        let yearStartValue = year === 1 ? 0 : yearlyData[year - 2].maturityValue;
        
        for (let month = 1; month <= 12; month++) {
          yearlyInvestment += currentSIP;
          totalInvestment += currentSIP;
        }
        
        // Calculate maturity value for this year
        const monthsFromStart = year * 12;
        let maturityValue = 0;
        
        // Calculate step-up SIP value
        if (stepUpFrequency === 'yearly' && year > 1) {
          // Complex calculation for step-up SIP
          let tempSIP = monthlyAmount;
          let tempTotal = 0;
          
          for (let y = 1; y <= year; y++) {
            const monthsInThisYear = 12;
            const futureMonths = (year - y) * 12;
            
            for (let m = 1; m <= monthsInThisYear; m++) {
              const remainingMonths = futureMonths + (12 - m);
              tempTotal += tempSIP * Math.pow(1 + monthlyRate, remainingMonths);
            }
            
            tempSIP = tempSIP * (1 + stepUpPercent / 100);
          }
          
          maturityValue = tempTotal;
        } else {
          // Regular SIP calculation
          maturityValue = currentSIP * (((Math.pow(1 + monthlyRate, monthsFromStart) - 1) / monthlyRate) * (1 + monthlyRate));
        }
        
        // Calculate real value (inflation-adjusted)
        const realValue = maturityValue / Math.pow(1 + inflationRate / 100, year);
        
        yearlyData.push({
          year,
          investment: totalInvestment,
          maturityValue: Math.round(maturityValue),
          realValue: Math.round(realValue),
          sipAmount: Math.round(currentSIP),
          gains: Math.round(maturityValue - totalInvestment)
        });
        
        // Step up SIP for next year
        if (stepUpFrequency === 'yearly') {
          currentSIP = currentSIP * (1 + stepUpPercent / 100);
        }
      }
      
      const finalResult = yearlyData[yearlyData.length - 1];
      
      setResults({
        calculationType: 'amount',
        monthlyAmount,
        totalInvestment: finalResult.investment,
        maturityAmount: finalResult.maturityValue,
        totalGains: finalResult.gains,
        realValue: finalResult.realValue,
        yearlyData,
        taxSavings: taxSaving ? Math.min(finalResult.investment * 0.3, 46800) : 0 // 30% tax saving up to 80C limit
      });
      
    } else {
      // Calculate required SIP for target amount
      const requiredSIP = targetAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
      
      // Generate yearly data for goal-based planning
      currentSIP = requiredSIP;
      totalInvestment = 0;
      
      for (let year = 1; year <= investmentPeriod; year++) {
        totalInvestment += currentSIP * 12;
        const monthsFromStart = year * 12;
        const maturityValue = currentSIP * (((Math.pow(1 + monthlyRate, monthsFromStart) - 1) / monthlyRate) * (1 + monthlyRate));
        const realValue = maturityValue / Math.pow(1 + inflationRate / 100, year);
        
        yearlyData.push({
          year,
          investment: totalInvestment,
          maturityValue: Math.round(maturityValue),
          realValue: Math.round(realValue),
          sipAmount: Math.round(currentSIP),
          gains: Math.round(maturityValue - totalInvestment)
        });
      }
      
      setResults({
        calculationType: 'goal',
        requiredSIP: Math.round(requiredSIP),
        targetAmount,
        totalInvestment: Math.round(requiredSIP * totalMonths),
        totalGains: targetAmount - (requiredSIP * totalMonths),
        yearlyData,
        taxSavings: taxSaving ? Math.min((requiredSIP * totalMonths) * 0.3, 46800 * investmentPeriod) : 0
      });
    }
  };

  useEffect(() => {
    calculateSIP();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'calculationType' || field === 'stepUpFrequency' || field === 'taxSaving' ? value : (parseFloat(value) || 0)
    }));
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Chart data
  const pieData = results.totalInvestment ? [
    { name: 'Total Investment', value: results.totalInvestment, color: '#3B82F6' },
    { name: 'Capital Gains', value: results.totalGains || (results.maturityAmount - results.totalInvestment), color: '#10B981' }
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <TrendingUp className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced SIP Calculator</h1>
        <p className="text-gray-600">Plan your systematic investment with step-up SIP, goal-based planning, and tax benefits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Planning</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
              <select
                value={inputs.calculationType}
                onChange={(e) => handleInputChange('calculationType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="amount">Calculate Maturity Amount</option>
                <option value="goal">Calculate Required SIP</option>
              </select>
            </div>

            {inputs.calculationType === 'amount' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly SIP Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={inputs.monthlyAmount}
                    onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={inputs.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1000000"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
              <input
                type="range"
                min="1"
                max="30"
                value={inputs.investmentPeriod}
                onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1</span>
                <span className="font-medium text-primary-600">{inputs.investmentPeriod} years</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
              <input
                type="range"
                min="6"
                max="20"
                step="0.5"
                value={inputs.expectedReturn}
                onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>6%</span>
                <span className="font-medium text-primary-600">{inputs.expectedReturn}%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Step-up SIP</label>
              <select
                value={inputs.stepUpFrequency}
                onChange={(e) => handleInputChange('stepUpFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="none">No Step-up</option>
                <option value="yearly">Yearly Step-up</option>
              </select>
            </div>

            {inputs.stepUpFrequency === 'yearly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Step-up (%)</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={inputs.stepUpPercent}
                  onChange={(e) => handleInputChange('stepUpPercent', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5%</span>
                  <span className="font-medium text-primary-600">{inputs.stepUpPercent}%</span>
                  <span>20%</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Rate (%)</label>
              <input
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={inputs.inflationRate}
                onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>3%</span>
                <span className="font-medium text-primary-600">{inputs.inflationRate}%</span>
                <span>10%</span>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="taxSaving"
                checked={inputs.taxSaving}
                onChange={(e) => handleInputChange('taxSaving', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="taxSaving" className="ml-2 block text-sm text-gray-700">
                Tax-saving ELSS (Section 80C)
              </label>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {results.calculationType === 'goal' ? 'Required Monthly SIP' : 'Maturity Amount'}
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    {results.calculationType === 'goal' 
                      ? formatCurrency(results.requiredSIP) 
                      : formatCurrency(results.maturityAmount)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.totalInvestment)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Capital Gains</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.totalGains || (results.maturityAmount - results.totalInvestment))}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Real Value (Inflation-adjusted)</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.realValue)}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Investment Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Growth Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name]}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="investment" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    name="Total Investment"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gains" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    name="Capital Gains"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="realValue" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Real Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment vs Returns Pie Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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

            {/* Key Benefits */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Power of Compounding:</span>
                  <span className="font-semibold text-green-600">
                    {((results.maturityAmount / results.totalInvestment - 1) * 100).toFixed(1)}% growth
                  </span>
                </div>
                
                {inputs.stepUpFrequency === 'yearly' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Step-up Benefit:</span>
                    <span className="font-semibold text-blue-600">
                      {inputs.stepUpPercent}% annual increase
                    </span>
                  </div>
                )}
                
                {results.taxSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Savings (80C):</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(results.taxSavings)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Inflation Impact:</span>
                  <span className="font-semibold text-orange-600">
                    {((1 - results.realValue / results.maturityAmount) * 100).toFixed(1)}% erosion
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 SIP Investment Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Start early:</strong> Time is your biggest ally in wealth creation</li>
              <li>• <strong>Stay consistent:</strong> Don't stop SIPs during market volatility</li>
              <li>• <strong>Step-up annually:</strong> Increase SIP with salary increments</li>
              <li>• <strong>Diversify:</strong> Invest across large-cap, mid-cap, and international funds</li>
              <li>• <strong>Review regularly:</strong> Assess performance and rebalance annually</li>
              <li>• <strong>Tax benefits:</strong> Use ELSS funds for Section 80C deductions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
