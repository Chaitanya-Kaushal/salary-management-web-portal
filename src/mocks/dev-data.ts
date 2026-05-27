import type { Employee, EmploymentType } from '@/lib/api-contract';

const FIRST_NAMES = [
  'Alice',
  'Bob',
  'Carol',
  'Dave',
  'Eve',
  'Frank',
  'Grace',
  'Hank',
  'Iris',
  'Jack',
  'Kate',
  'Liam',
  'Mia',
  'Noah',
  'Olivia',
  'Priya',
  'Quinn',
  'Ravi',
  'Sara',
  'Tom',
];

const LAST_NAMES = [
  'Anderson',
  'Brown',
  'Carter',
  'Davies',
  'Evans',
  'Fischer',
  'Garcia',
  'Hayes',
  'Iyer',
  'Jones',
  'Kumar',
  'Lopez',
  'Mehta',
  'Nguyen',
  'Okafor',
  'Patel',
  'Quinn',
  'Reyes',
  'Singh',
  'Tanaka',
];

const COUNTRIES: { code: string; currency: string; avgSalary: number }[] = [
  { code: 'US', currency: 'USD', avgSalary: 150_000 },
  { code: 'UK', currency: 'GBP', avgSalary: 90_000 },
  { code: 'IN', currency: 'INR', avgSalary: 1_500_000 },
  { code: 'DE', currency: 'EUR', avgSalary: 80_000 },
  { code: 'FR', currency: 'EUR', avgSalary: 75_000 },
];

const JOB_TITLES = ['Engineer', 'Manager', 'Designer', 'Analyst', 'Director'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Operations'];
const EMPLOYMENT_TYPES: EmploymentType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'];

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function generateEmployees(count: number): Employee[] {
  const rand = seededRandom(42);
  const employees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const country = COUNTRIES[i % COUNTRIES.length];
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const fullName = `${firstName} ${lastName}`;
    const variation = 0.6 + rand() * 0.8;
    const salaryMajor = Math.round(country.avgSalary * variation);
    employees.push({
      id: `emp-${i + 1}`,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i + 1}@corp.example`,
      jobTitle: JOB_TITLES[Math.floor(rand() * JOB_TITLES.length)],
      department: DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)],
      country: country.code,
      currency: country.currency,
      salary: salaryMajor * 100,
      employmentType: EMPLOYMENT_TYPES[Math.floor(rand() * EMPLOYMENT_TYPES.length)],
      hireDate: '2023-06-01',
      createdAt: '2023-06-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
    });
  }
  return employees;
}

export const devStore = {
  employees: generateEmployees(50),
  hrUser: { id: 'hr-1', email: 'hr@corp.example', name: 'Priya Sharma' },
};
