import React, { useState, useEffect } from 'react';
import { Shield, Heart, Users, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const InsuranceCalculator = () => {
  const [inputs, setInputs] = useState({
    age: 30,
    annualIncome: 1200000,
    spouseIncome: 600000,
    numberOfChildren: 2,
    childrenAges: [5, 8],
    currentSavings: 500000,
    outstandingLoans: 2500000,
    monthlyExpenses: 80000,
    inflationRate: 6,
    expectedReturn: 8,
    retirementAge: 60,
    spouseAge: 28,
    hasExistingInsurance: true,
    existingLifeCover: 1000000,
    existingHealthCover: 500000
  });

  const [results, setResults] = useState({});

  const calculateInsuranceNeed = () => {
    const {
      age,
      annualIncome,
      spouseIncome,
      numberOfChildren,
      childrenAges,
      currentSavings,
      outstandingLoans,
      monthlyExpenses,
      inflationRate,
      expectedReturn,
      retirementAge,
      spouseAge,
      existingLifeCover,
      existingHealthCover
    } = inputs;

    // Life Insurance Calculation using Human Life Value method
    const workingYears = retirementAge - age;
    const realReturnRate = ((1 + expectedReturn / 100) / (1 + inflationRate / 100)) - 1;
    
    // Future value of income stream
    const futureIncomeValue = annualIncome * (1 - Math.pow(1 + realReturnRate, -workingYears)) / realReturnRate;
    
    // Immediate needs
    const immediateNeeds = outstandingLoans + (monthlyExpenses * 12); // 1 year expenses
    
    // Children's education and marriage costs
    let childrenCosts = 0;
    childrenAges.forEach(childAge => {
      const yearsToEducation = Math.max(18 - childAge, 0);
      const educationCost = 1500000; // Estimated higher education cost
      const marriageCost = childAge < 25 ? 1000000 : 0; // Marriage cost if applicable
      
      const inflatedEducationCost = educationCost * Math.pow(1 + inflationRate / 100, yearsToEducation);
      const inflatedMarriageCost = marriageCost * Math.pow(1 + inflationRate / 100, Math.max(25 - childAge, 0));
      
      childrenCosts += inflatedEducationCost + inflatedMarriageCost;
    });
    
    // Spouse's financial needs
    const spouseWorkingYears = Math.max(retirementAge - spouseAge, 0);
    const spouseIncomeReplacement = spouseIncome > 0 ? 0 : (annualIncome * 0.7 * spouseWorkingYears);
    
    // Total life insurance need
    const totalLifeInsuranceNeed = futureIncomeValue + immediateNeeds + childrenCosts + spouseIncomeReplacement - currentSavings;
    const additionalLifeInsuranceNeeded = Math.max(totalLifeInsuranceNeed - existingLifeCover, 0);
    
    // Health Insurance Calculation
    const baseHealthCover = 500000; // Minimum recommended
    const familySize = 2 + numberOfChildren;
    const recommendedHealthCover = Math.max(
      baseHealthCover * familySize,
      annualIncome * 0.5, // 50% of annual income
      1000000 // Minimum 10 lakhs for family
    );
    
    const additionalHealthInsuranceNeeded = Math.max(recommendedHealthCover - existingHealthCover, 0);
    
    // Premium calculations (approximate)
    const lifeInsurancePremium = (additionalLifeInsuranceNeeded * 0.008); // 0.8% of sum assured annually
    const healthInsurancePremium = (recommendedHealthCover * 0.015); // 1.5% of sum assured annually
    
    // Affordability check
    const totalAnnualPremium = lifeInsurancePremium + healthInsurancePremium;
    const premiumAffordability = (totalAnnualPremium / annualIncome) * 100;
    
    setResults({
      totalLifeInsuranceNeed: Math.round(totalLifeInsuranceNeed),
      additionalLifeInsuranceNeeded: Math.round(additionalLifeInsuranceNeeded),
      recommendedHealthCover: Math.round(recommendedHealthCover),
      additionalHealthInsuranceNeeded: Math.round(additionalHealthInsuranceNeeded),
      lifeInsurancePremium: Math.round(lifeInsurancePremium),
      healthInsurancePremium: Math.round(healthInsurancePremium),
      totalAnnualPremium: Math.round(totalAnnualPremium),
      premiumAffordability: premiumAffordability.toFixed(1),
      immediateNeeds: Math.round(immediateNeeds),
      childrenCosts: Math.round(childrenCosts),
      futureIncomeValue: Math.round(futureIncomeValue),
      familySize
    });
  };

  useEffect(() => {
    calculateInsuranceNeed();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    if (field === 'childrenAges') {
      setInputs(prev => ({ ...prev, [field]: value }));
    } else {
      setInputs(prev => ({
        ...prev,
        [field]: typeof value === 'boolean' ? value : (parseFloat(value) || 0)
      }));
    }
  };

  const updateChildAge = (index, age) => {
    const newAges = [...inputs.childrenAges];
    newAges[index] = parseInt(age) || 0;
    handleInputChange('childrenAges', newAges);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Chart data
  const lifeInsuranceBreakdown = [
    { name: 'Future Income', value: results.futureIncomeValue, color: '#3B82F6' },
    { name: 'Immediate Needs', value: results.immediateNeeds, color: '#EF4444' },
    { name: 'Children Costs', value: results.childrenCosts, color: '#F59E0B' },
    { name: 'Current Savings', value: -inputs.currentSavings, color: '#10B981' }
  ].filter(item => item.value > 0);

  const insuranceComparison = [
    {
      type: 'Life Insurance',
      current: inputs.existingLifeCover,
      recommended: results.totalLifeInsuranceNeed,
      additional: results.additionalLifeInsuranceNeeded,
      premium: results.lifeInsurancePremium
    },
    {
      type: 'Health Insurance',
      current: inputs.existingHealthCover,
      recommended: results.recommendedHealthCover,
      additional: results.additionalHealthInsuranceNeeded,
      premium: results.healthInsurancePremium
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Shield className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Need Calculator</h1>
        <p className="text-gray-600">Calculate your life and health insurance requirements based on your financial situation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
                <input
                  type="number"
                  value={inputs.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Age</label>
                <input
                  type="number"
                  value={inputs.spouseAge}
                  onChange={(e) => handleInputChange('spouseAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.annualIncome}
                  onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.spouseIncome}
                  onChange={(e) => handleInputChange('spouseIncome', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.numberOfChildren}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  handleInputChange('numberOfChildren', count);
                  // Reset children ages array
                  const newAges = Array(count).fill(0).map((_, i) => inputs.childrenAges[i] || 5);
                  handleInputChange('childrenAges', newAges);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span className="font-medium text-primary-600">{inputs.numberOfChildren}</span>
                <span>5</span>
              </div>
            </div>

            {inputs.numberOfChildren > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages</label>
                <div className="grid grid-cols-2 gap-2">
                  {inputs.childrenAges.slice(0, inputs.numberOfChildren).map((age, index) => (
                    <input
                      key={index}
                      type="number"
                      value={age}
                      onChange={(e) => updateChildAge(index, e.target.value)}
                      placeholder={`Child ${index + 1} age`}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outstanding Loans</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={inputs.outstandingLoans}
                  onChange={(e) => handleInputChange('outstandingLoans', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Existing Insurance</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Life Insurance Cover</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={inputs.existingLifeCover}
                    onChange={(e) => handleInputChange('existingLifeCover', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Insurance Cover</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={inputs.existingHealthCover}
                    onChange={(e) => handleInputChange('existingHealthCover', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insurance Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Life Insurance</h3>
                    <p className="text-sm text-gray-600">Protect your family's future</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Cover:</span>
                  <span className="font-semibold">{formatCurrency(inputs.existingLifeCover)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(results.totalLifeInsuranceNeed)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Additional Needed:</span>
                  <span className="font-bold text-lg text-red-600">{formatCurrency(results.additionalLifeInsuranceNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Annual Premium:</span>
                  <span className="font-semibold">{formatCurrency(results.lifeInsurancePremium)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Health Insurance</h3>
                    <p className="text-sm text-gray-600">Cover medical expenses</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Cover:</span>
                  <span className="font-semibold">{formatCurrency(inputs.existingHealthCover)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(results.recommendedHealthCover)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Additional Needed:</span>
                  <span className="font-bold text-lg text-red-600">{formatCurrency(results.additionalHealthInsuranceNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Annual Premium:</span>
                  <span className="font-semibold">{formatCurrency(results.healthInsurancePremium)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Affordability Check */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Affordability</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Annual Premium</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalAnnualPremium)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">% of Annual Income</p>
                <p className={`text-xl font-bold ${
                  results.premiumAffordability > 10 ? 'text-red-600' : 
                  results.premiumAffordability > 7 ? 'text-yellow-600' : 'text-green-600'
                }`}>{results.premiumAffordability}%</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Outgo</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalAnnualPremium / 12)}</p>
              </div>
            </div>
            
            {results.premiumAffordability > 10 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 text-sm">
                    Premium exceeds 10% of income. Consider term insurance for life cover and higher deductible health plans.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Life Insurance Breakdown Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Insurance Need Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifeInsuranceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {lifeInsuranceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Math.abs(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insurance Comparison Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current vs Recommended Coverage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insuranceComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="current" fill="#94A3B8" name="Current Coverage" />
                  <Bar dataKey="recommended" fill="#3B82F6" name="Recommended Coverage" />
                  <Bar dataKey="additional" fill="#EF4444" name="Additional Needed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🛡️ Insurance Planning Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Term insurance first:</strong> Get maximum life cover at lowest cost</li>
              <li>• <strong>Health insurance is essential:</strong> Medical costs are rising faster than inflation</li>
              <li>• <strong>Buy early:</strong> Premiums are lower when you're young and healthy</li>
              <li>• <strong>Review annually:</strong> Increase coverage with life changes (marriage, children, loans)</li>
              <li>• <strong>Don't mix investment and insurance:</strong> Keep them separate for better returns</li>
              <li>• <strong>Family floater vs individual:</strong> Compare costs for health insurance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCalculator;
