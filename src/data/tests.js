// Prices are sample values for the prototype (in INR)
export const tests = [
  { id: 't-cbc', name: 'CBC', full: 'Complete Blood Count', price: 350 },
  { id: 't-kft', name: 'KFT', full: 'Kidney Function Test', price: 650 },
  { id: 't-lft', name: 'LFT', full: 'Liver Function Test', price: 700 },
  { id: 't-lipid', name: 'Lipid Profile', full: 'Cholesterol, HDL, LDL, Triglycerides', price: 550 },
  { id: 't-hba1c', name: 'HbA1c', full: 'Average blood sugar over 3 months', price: 500 },
  { id: 't-fbs', name: 'Blood Sugar (Fasting)', full: 'Fasting glucose test', price: 120 },
  { id: 't-ppbs', name: 'Blood Sugar (PP)', full: 'Post-meal glucose test', price: 120 },
  { id: 't-thyroid', name: 'Thyroid Profile', full: 'T3, T4 and TSH', price: 600 },
  { id: 't-tsh', name: 'TSH', full: 'Thyroid Stimulating Hormone', price: 350 },
  { id: 't-vitd', name: 'Vitamin D', full: '25-Hydroxy Vitamin D', price: 900 },
  { id: 't-b12', name: 'Vitamin B12', full: 'Cyanocobalamin level', price: 700 },
  { id: 't-urine', name: 'Urine Routine', full: 'Urine routine and microscopy', price: 150 },
  { id: 't-iron', name: 'Iron Studies', full: 'Serum iron, TIBC, ferritin', price: 1100 },
  { id: 't-esr', name: 'ESR', full: 'Erythrocyte Sedimentation Rate', price: 150 },
  { id: 't-crp', name: 'CRP', full: 'C-Reactive Protein (inflammation marker)', price: 500 },
  { id: 't-dengue', name: 'Dengue NS1', full: 'Dengue NS1 antigen', price: 800 },
  { id: 't-malaria', name: 'Malaria Antigen', full: 'Rapid malaria antigen test', price: 400 },
  { id: 't-widal', name: 'Widal', full: 'Typhoid fever test', price: 300 },
  { id: 't-uric', name: 'Uric Acid', full: 'Serum uric acid', price: 200 },
  { id: 't-creat', name: 'Serum Creatinine', full: 'Kidney marker', price: 200 },
  { id: 't-elec', name: 'Electrolytes', full: 'Sodium, potassium, chloride', price: 450 },
  { id: 't-calcium', name: 'Calcium', full: 'Serum calcium', price: 250 },
  { id: 't-abo', name: 'Blood Group', full: 'ABO and Rh typing', price: 100 },
  { id: 't-ptinr', name: 'PT/INR', full: 'Prothrombin time (blood clotting)', price: 450 },
]

export const packages = [
  {
    id: 'p-basic', name: 'Basic Health Checkup', price: 999,
    desc: 'A quick yearly check for healthy adults.',
    includes: ['CBC', 'Blood Sugar (Fasting)', 'Lipid Profile', 'Urine Routine', 'Serum Creatinine'],
  },
  {
    id: 'p-full', name: 'Full Body Checkup', price: 2499,
    desc: 'A wide screening of major organs.',
    includes: ['CBC', 'KFT', 'LFT', 'Lipid Profile', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12', 'HbA1c', 'Urine Routine'],
  },
  {
    id: 'p-diabetes', name: 'Diabetes Care', price: 1299,
    desc: 'Track sugar control and its effect on the body.',
    includes: ['HbA1c', 'Blood Sugar (Fasting)', 'Blood Sugar (PP)', 'KFT', 'Lipid Profile', 'Urine Routine'],
  },
  {
    id: 'p-heart', name: 'Heart Health', price: 1799,
    desc: 'Cholesterol and risk markers for the heart.',
    includes: ['Lipid Profile', 'HbA1c', 'CRP', 'Electrolytes', 'Uric Acid', 'Blood Sugar (Fasting)'],
  },
  {
    id: 'p-fever', name: 'Fever Panel', price: 1499,
    desc: 'Common causes of fever in one visit.',
    includes: ['CBC', 'Dengue NS1', 'Malaria Antigen', 'Widal', 'CRP', 'Urine Routine'],
  },
  {
    id: 'p-senior', name: 'Senior Citizen Package', price: 2999,
    desc: 'Extra checks for people above 60.',
    includes: ['CBC', 'KFT', 'LFT', 'Lipid Profile', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12', 'Calcium', 'HbA1c', 'Electrolytes'],
  },
]

export const rupees = (n) => '\u20B9' + n.toLocaleString('en-IN')
