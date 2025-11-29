
import { CalculatorState, CalculationResult } from '../types';

// Labor Insurance Salary Grades (Approximate for 2024/2025)
// Capped at 45,800 for Old Age Pension calculation purposes in this context
export const LABOR_INSURANCE_GRADES = [
  27470, 27600, 28800, 30300, 31800, 
  33300, 34800, 36300, 38200, 40100, 
  42000, 43900, 45800
];

export const getInsuranceGrade = (inputSalary: number): number => {
  if (inputSalary <= 0) return 0;
  const grade = LABOR_INSURANCE_GRADES.find(g => g >= inputSalary);
  return grade || 45800;
};

/**
 * Returns the Statutory Retirement Age based on ROC Birth Year
 * Rules:
 * <= 46: 60
 * 47: 61
 * 48: 62
 * 49: 63
 * 50: 64
 * >= 51: 65
 */
export const getStatutoryRetirementAge = (rocYear: number): number => {
  if (isNaN(rocYear) || rocYear <= 0) return 65; // Default/Future
  if (rocYear >= 51) return 65;
  if (rocYear === 50) return 64;
  if (rocYear === 49) return 63;
  if (rocYear === 48) return 62;
  if (rocYear === 47) return 61;
  return 60;
};

export const calculatePension = (
  salaryStr: string,
  yearsStr: string,
): CalculationResult => {
  let salary = parseFloat(salaryStr);
  const years = parseFloat(yearsStr);
  
  // Note: We ignore user input age for the result columns as requested.
  // We standardize on comparing Age 60 vs Age 65.

  if (isNaN(salary) || isNaN(years) || salary <= 0 || years <= 0) {
    return { 
      option1: { age: 0, amount: 0, label: '' },
      option2: { age: 0, amount: 0, label: '' },
      totalYears: 0 
    };
  }

  // Formula: Salary * Years * 1.55%
  const baseAmount = salary * years * 0.0155;

  // Option 1: 60 Years Old (Early Withdrawal)
  // Rule: Max 5 years early, 4% reduction per year.
  // 60 is 5 years before 65.
  // Reduction = 5 * 4% = 20%.
  // Multiplier = 0.8
  const age1 = 60;
  const amount1 = Math.round(baseAmount * 0.8);

  // Option 2: 65 Years Old (Statutory Withdrawal)
  // Full amount.
  const age2 = 65;
  const amount2 = Math.round(baseAmount);

  return {
    option1: {
      age: age1,
      amount: amount1,
      label: '60歲請領',
      subLabel: '(提早5年, 減給20%)'
    },
    option2: {
      age: age2,
      amount: amount2,
      label: '65歲請領',
      subLabel: '(法定年齡, 全額給付)'
    },
    totalYears: years,
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};