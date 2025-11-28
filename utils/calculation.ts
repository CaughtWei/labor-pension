
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

/**
 * Calculates a single pension option amount
 * @param salary Monthly insured salary
 * @param years Insured years
 * @param claimAge The age at which the user plans to retire/claim
 * @returns Monthly pension amount
 */
const calculateOptionAmount = (salary: number, years: number, claimAge: number): number => {
  // Statutory rules:
  // Statutory Age = 65
  // Min Claim Age = 60 (20% reduction)
  // Max Deferred Age = 70 (20% increase)
  
  // If user inputs < 60, we calculate based on 60 (Earliest allowed), 
  // assuming they stop working at 'claimAge' but start drawing at 60.
  const effectiveAge = Math.max(claimAge, 60);
  const statutoryAge = 65; // Note: For calculation purposes we use 65 as baseline for reduction/increase logic in this simplified model
  
  // Calculate difference from statutory age
  // E.g. 60 - 65 = -5 (Early)
  // E.g. 70 - 65 = +5 (Deferred)
  let diff = effectiveAge - statutoryAge;
  
  // Cap difference at +/- 5 years
  diff = Math.max(-5, Math.min(5, diff));

  // 4% per year
  const multiplier = 1 + (diff * 0.04);
  
  const baseAmount = salary * years * 0.0155;
  return Math.round(baseAmount * multiplier);
};

export const calculatePension = (
  salaryStr: string,
  yearsStr: string,
  userRetireAgeStr: string
): CalculationResult => {
  let salary = parseFloat(salaryStr);
  const years = parseFloat(yearsStr);
  const userAge = parseInt(userRetireAgeStr) || 60; // Default to 60 if empty

  if (isNaN(salary) || isNaN(years) || salary <= 0 || years <= 0) {
    return { 
      option1: { age: 0, amount: 0, label: '' },
      option2: { age: 0, amount: 0, label: '' },
      totalYears: 0 
    };
  }

  // Determine the effective start age for the first option.
  // We cannot claim before 60.
  const effectiveStartAge = Math.max(userAge, 60);

  // Option 1: User's Projected Age
  // Display matches user input (e.g. 55), but math uses effectiveStartAge (60)
  const age1 = userAge;
  const amount1 = calculateOptionAmount(salary, years, age1);

  // Option 2: Effective Start + 5 Years
  // This ensures that even if user puts 55, we compare 60 vs 65 (instead of 60 vs 60)
  const age2 = effectiveStartAge + 5;
  const amount2 = calculateOptionAmount(salary, years, age2);

  return {
    option1: {
      age: age1,
      amount: amount1,
      label: `${age1}歲退休`,
      subLabel: age1 < 60 ? `(依規定${effectiveStartAge}歲起領)` : undefined
    },
    option2: {
      age: age2,
      amount: amount2,
      label: `${age2}歲`,
      subLabel: '(往後+5年)'
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
