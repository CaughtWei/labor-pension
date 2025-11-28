
export interface CalculatorState {
  birthYear: string;
  workStartAge: string;
  retirementAge: string;
  insuredYears: string;
  currentSalary: string;
  projectedSalary: string;
}

export interface PensionOption {
  age: number;
  amount: number;
  label: string;
  subLabel?: string;
}

export interface CalculationResult {
  option1: PensionOption; // User's projected age
  option2: PensionOption; // Projected + 5 years
  totalYears: number;
}

export interface ComparisonData {
  scenario: string;
  amount1: number;
  amount2: number;
  label1: string;
  label2: string;
}
