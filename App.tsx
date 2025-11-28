
import React, { useState, useEffect } from 'react';
import { Calculator, Briefcase, Calendar, Coins, User, ArrowRight, Clock, Printer, FileText } from 'lucide-react';
import { CalculatorState, ComparisonData, CalculationResult } from './types';
import { calculatePension, getInsuranceGrade, getStatutoryRetirementAge, LABOR_INSURANCE_GRADES, formatCurrency } from './utils/calculation';
import { InputGroup } from './components/InputGroup';
import { ResultCard } from './components/ResultCard';
import { ChartSection } from './components/ChartSection';

const App: React.FC = () => {
  const [formData, setFormData] = useState<CalculatorState>({
    birthYear: '',
    workStartAge: '',
    retirementAge: '',
    insuredYears: '',
    currentSalary: '',
    projectedSalary: '45800', // Default to max for the dropdown
  });

  const emptyResult: CalculationResult = {
    option1: { age: 0, amount: 0, label: '' },
    option2: { age: 0, amount: 0, label: '' },
    totalYears: 0
  };

  const [currentResult, setCurrentResult] = useState<CalculationResult>(emptyResult);
  const [projectedResult, setProjectedResult] = useState<CalculationResult>(emptyResult);
  const [extendedResult, setExtendedResult] = useState<CalculationResult>(emptyResult);
  const [extendedCurrentResult, setExtendedCurrentResult] = useState<CalculationResult>(emptyResult);
  
  const [autoGrade, setAutoGrade] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Basic number validation
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Logic: Auto-calculate Labor Insurance Grade when Current Salary changes
  useEffect(() => {
    if (formData.currentSalary) {
      const salary = parseInt(formData.currentSalary);
      const grade = getInsuranceGrade(salary);
      setAutoGrade(grade);
    } else {
      setAutoGrade(null);
    }
  }, [formData.currentSalary]);

  // Logic: Validation (Insured Years vs Working Period)
  useEffect(() => {
    if (formData.workStartAge && formData.retirementAge && formData.insuredYears) {
      const workAge = parseInt(formData.workStartAge);
      const retireAge = parseInt(formData.retirementAge);
      const insured = parseInt(formData.insuredYears);
      
      const maxPossibleYears = retireAge - workAge;

      if (retireAge <= workAge) {
        setValidationError('預計退休年紀必須大於開始工作年紀');
      } else if (insured > maxPossibleYears) {
        setValidationError(`投保年資 (${insured}年) 不可大於工作期間 (${maxPossibleYears}年)`);
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }
  }, [formData.workStartAge, formData.retirementAge, formData.insuredYears]);

  // Recalculate Results
  useEffect(() => {
    const baseYears = parseInt(formData.insuredYears) || 0;
    const baseRetireAge = parseInt(formData.retirementAge) || 60;
    const projectedSal = formData.projectedSalary;

    // 1. Current Salary Result
    // Uses the Auto-Calculated Grade
    const currentGrade = autoGrade ? autoGrade.toString() : '0';
    setCurrentResult(calculatePension(currentGrade, formData.insuredYears, formData.retirementAge));

    // 2. Projected Salary Result
    // Uses the Dropdown Value directly
    setProjectedResult(calculatePension(projectedSal, formData.insuredYears, formData.retirementAge));

    // 3. Extended Service Result (Work 5 more years)
    // Logic: Same Projected Salary, but Years + 5, and Age + 5 (assuming you work those extra years)
    if (baseYears > 0) {
      const extYears = (baseYears + 5).toString();
      const extAge = (baseRetireAge + 5).toString();
      setExtendedResult(calculatePension(projectedSal, extYears, extAge));
      
      // 4. Extended Service with CURRENT Salary
      setExtendedCurrentResult(calculatePension(currentGrade, extYears, extAge));
    } else {
      setExtendedResult(emptyResult);
      setExtendedCurrentResult(emptyResult);
    }

  }, [formData.insuredYears, autoGrade, formData.projectedSalary, formData.retirementAge]);

  // Data for chart
  const chartData: ComparisonData[] = [
    {
      scenario: '目前薪資',
      amount1: currentResult.option1.amount,
      amount2: currentResult.option2.amount,
      label1: `${currentResult.option1.age}歲`,
      label2: `${currentResult.option2.age}歲`,
    },
    {
      scenario: '預期薪資',
      amount1: projectedResult.option1.amount,
      amount2: projectedResult.option2.amount,
      label1: `${projectedResult.option1.age}歲`,
      label2: `${projectedResult.option2.age}歲`,
    },
    {
      scenario: '續拚(原薪)',
      amount1: extendedCurrentResult.option1.amount,
      amount2: extendedCurrentResult.option2.amount,
      label1: `${extendedCurrentResult.option1.age}歲`,
      label2: `${extendedCurrentResult.option2.age}歲`,
    },
    {
      scenario: '續拚(調薪)',
      amount1: extendedResult.option1.amount,
      amount2: extendedResult.option2.amount,
      label1: `${extendedResult.option1.age}歲`,
      label2: `${extendedResult.option2.age}歲`,
    },
  ];

  const handleContact = () => {
    alert("✨ 謝謝您的興趣！\n我們將儘快安排專人協助您規劃退休生活！");
  };
  
  const handlePrint = () => {
    window.print();
  };

  // Calculate statutory retirement age dynamically
  const statutoryAge = getStatutoryRetirementAge(parseInt(formData.birthYear));

  return (
    <div className="min-h-screen pb-12 font-sans text-slate-800 bg-[#FFFBEB] print:bg-white print:pb-0">
      
      {/* ================= SCREEN VIEW ONLY ================= */}
      <div className="print:hidden">
        {/* Hero Header */}
        <header className="relative bg-gradient-to-br from-blue-400 to-indigo-500 text-white pb-24 pt-10 px-6 rounded-b-[3rem] shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 opacity-20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-inner ring-1 ring-white/30">
              <Calculator className="mr-2" /> 
              <span className="font-bold tracking-wider">勞保退休金試算</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight drop-shadow-md">
              你的退休金夠用嗎？💰
            </h1>
            <p className="text-blue-50 font-medium opacity-90 text-lg">
              30秒快速試算，提早規劃第二人生！
            </p>
          </div>
        </header>

        {/* Main Content Container - Dashboard Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 space-y-8">
          
          {/* TOP SECTION: Control Panel (Inputs) */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold text-gray-700">輸入基本資料</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
              
              {/* Row 1: Birth Year (Full Width / Inline) */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <InputGroup
                  label="出生年份 (民國)"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleInputChange}
                  placeholder="例如：83"
                  icon={<Calendar size={18} />}
                  suffix="年次"
                  helperText={`法定可提領：${statutoryAge}歲`}
                  inline={true}
                />
              </div>

              {/* Row 2: Basic Info */}
              <InputGroup
                label="開始工作年紀"
                name="workStartAge"
                value={formData.workStartAge}
                onChange={handleInputChange}
                placeholder="例如：25"
                icon={<Briefcase size={18} />}
                suffix="歲"
              />

              <InputGroup
                label="預計退休年紀"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleInputChange}
                placeholder="例如：55"
                icon={<Clock size={18} />}
                suffix="歲"
              />

              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <InputGroup
                  label="預計勞保投保年資"
                  name="insuredYears"
                  value={formData.insuredYears}
                  onChange={handleInputChange}
                  placeholder="例如：30 (需滿15年以上)"
                  icon={<User size={18} />}
                  suffix="年"
                  error={validationError}
                />
              </div>

              {/* Divider for Visual Separation */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 border-t border-dashed border-gray-100 my-2"></div>
              <div className="col-span-1 md:col-span-2 lg:col-span-4 mb-2">
                <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wide flex items-center gap-1">
                  <span>💰</span> 薪資情境模擬
                </h3>
              </div>

              {/* Row 3: Salary Info */}
              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <InputGroup
                  label="目前月薪 (自動計算級距)"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleInputChange}
                  placeholder="請輸入實際月薪，如 36000"
                  icon={<Coins size={18} />}
                  suffix="元"
                  calculatedValue={autoGrade ? `${formatCurrency(autoGrade)}` : undefined}
                />
              </div>

              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <InputGroup
                  label="預計退休前 60 個月平均投保薪資"
                  name="projectedSalary"
                  value={formData.projectedSalary}
                  onChange={handleInputChange}
                  type="select"
                  options={LABOR_INSURANCE_GRADES}
                  icon={<TrendingUpIcon />}
                />
              </div>

              {/* Footer Note */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <p className="text-xs text-gray-400 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  💡 貼心提醒：若雇主低報薪資，系統將依您輸入的金額自動對應至最接近的勞保級距計算。
                </p>
              </div>
            </div>
          </section>

          {/* BOTTOM SECTION: Results & Visualization */}
          <section className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex justify-end">
               <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
               >
                 <Printer size={18} />
                 下載試算報告 PDF
               </button>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ResultCard 
                title="目前薪資"
                subtitle={`投保級距 ${autoGrade ? autoGrade.toLocaleString() : '0'} 元`}
                result={currentResult}
                colorTheme="blue"
              />
              
              <ResultCard 
                title="續拚(原薪)"
                subtitle={`投保年資 +5年 (約${extendedCurrentResult.option1.age}歲退休)`}
                result={extendedCurrentResult}
                colorTheme="purple"
              />

              <ResultCard 
                title="調薪後預估"
                subtitle={`預計級距 ${parseInt(formData.projectedSalary).toLocaleString()} 元`}
                result={projectedResult}
                colorTheme="pink"
              />

              <ResultCard 
                title="續拚(調薪)"
                subtitle={`投保年資 +5年 (約${extendedResult.option1.age}歲退休)`}
                result={extendedResult}
                colorTheme="green"
              />
            </div>

            {/* Chart */}
            <ChartSection data={chartData} />

          </section>

          {/* Call to Action */}
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-200 mt-12">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  這樣的退休金對你來說夠嗎？🤔
                </h2>
                <p className="text-indigo-100 mb-8 max-w-lg mx-auto text-lg">
                  想知道如何每月增加 1~2 萬的被動收入？<br/>
                  讓我們協助您打造更完善的退休計畫！
                </p>
                <button 
                  onClick={handleContact}
                  className="group bg-white text-indigo-600 font-bold py-4 px-10 rounded-full text-lg shadow-[0_4px_0_rgb(200,200,200)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-indigo-50 inline-flex items-center gap-2"
                >
                  <span>立即預約免費諮詢</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>

          <footer className="text-center text-gray-400 text-sm mt-8 mb-4 font-medium">
            © 2025 勞保年金 Q 版試算工具 | Designed with React & Tailwind
          </footer>

        </main>
      </div>

      {/* ================= PRINT VIEW ONLY (A4 Layout) ================= */}
      <div className="hidden print:block p-8 max-w-[210mm] mx-auto bg-white">
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-8">
           <h1 className="text-3xl font-black text-slate-800 mb-2">勞保老年年金試算報告</h1>
           <p className="text-slate-500">試算日期：{new Date().toLocaleDateString('zh-TW')}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold border-l-4 border-blue-500 pl-3 mb-4 text-slate-700">📌 輸入條件</h2>
          <table className="w-full text-left border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500 w-1/3">出生年份</td>
                <td className="py-2 font-bold">民國 {formData.birthYear} 年 (法定退休: {statutoryAge}歲)</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">工作期間</td>
                <td className="py-2 font-bold">{formData.workStartAge} 歲 ~ {formData.retirementAge} 歲</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">預計投保年資</td>
                <td className="py-2 font-bold">{formData.insuredYears} 年</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">目前投保薪資</td>
                <td className="py-2 font-bold">{autoGrade ? formatCurrency(autoGrade) : '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">退休前預估投保薪資</td>
                <td className="py-2 font-bold">{formatCurrency(parseInt(formData.projectedSalary))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-lg font-bold border-l-4 border-indigo-500 pl-3 mb-4 text-slate-700">📊 試算結果比較</h2>
          <div className="grid grid-cols-2 gap-4">
             {/* 1 */}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-bold text-blue-700 mb-2">方案 A：目前薪資</h3>
                <div className="text-xs text-gray-500 mb-2">依投保級距 {autoGrade ? formatCurrency(autoGrade) : '-'} 計算</div>
                <div className="flex justify-between items-end mb-1 border-b border-gray-200 pb-1">
                   <span>{currentResult.option1.age}歲領</span>
                   <span className="font-bold">{formatCurrency(currentResult.option1.amount)}/月</span>
                </div>
                <div className="flex justify-between items-end">
                   <span>{currentResult.option2.age}歲領 (+5年)</span>
                   <span className="font-bold text-lg">{formatCurrency(currentResult.option2.amount)}/月</span>
                </div>
             </div>

             {/* 2 */}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-bold text-purple-700 mb-2">方案 B：續拚 (原薪)</h3>
                <div className="text-xs text-gray-500 mb-2">投保年資多 5 年，薪資不變</div>
                <div className="flex justify-between items-end mb-1 border-b border-gray-200 pb-1">
                   <span>{extendedCurrentResult.option1.age}歲領</span>
                   <span className="font-bold">{formatCurrency(extendedCurrentResult.option1.amount)}/月</span>
                </div>
                <div className="flex justify-between items-end">
                   <span>{extendedCurrentResult.option2.age}歲領 (+5年)</span>
                   <span className="font-bold text-lg">{formatCurrency(extendedCurrentResult.option2.amount)}/月</span>
                </div>
             </div>

             {/* 3 */}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-bold text-pink-700 mb-2">方案 C：調薪後預估</h3>
                <div className="text-xs text-gray-500 mb-2">依預估級距 {formatCurrency(parseInt(formData.projectedSalary))} 計算</div>
                <div className="flex justify-between items-end mb-1 border-b border-gray-200 pb-1">
                   <span>{projectedResult.option1.age}歲領</span>
                   <span className="font-bold">{formatCurrency(projectedResult.option1.amount)}/月</span>
                </div>
                <div className="flex justify-between items-end">
                   <span>{projectedResult.option2.age}歲領 (+5年)</span>
                   <span className="font-bold text-lg">{formatCurrency(projectedResult.option2.amount)}/月</span>
                </div>
             </div>

             {/* 4 */}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-bold text-green-700 mb-2">方案 D：續拚 (調薪)</h3>
                <div className="text-xs text-gray-500 mb-2">投保年資多 5 年，且有調薪</div>
                <div className="flex justify-between items-end mb-1 border-b border-gray-200 pb-1">
                   <span>{extendedResult.option1.age}歲領</span>
                   <span className="font-bold">{formatCurrency(extendedResult.option1.amount)}/月</span>
                </div>
                <div className="flex justify-between items-end">
                   <span>{extendedResult.option2.age}歲領 (+5年)</span>
                   <span className="font-bold text-lg">{formatCurrency(extendedResult.option2.amount)}/月</span>
                </div>
             </div>
          </div>
        </div>
        
        <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
           此報告為初步試算結果，實際金額以勞保局核定為準。<br/>
           Produced by 勞保年金 Q 版試算工具
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

export default App;
