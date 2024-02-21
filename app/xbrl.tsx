"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/KWot8TTw4Qb
 */
import { Search } from "./Search";
import React, { useEffect, useState } from "react";

interface Company {
  cik: string;
  name: string;
}

export function XBRL() {
  const [company, setCompany] = React.useState<Company | null>(null);
  return (
    <div className="flex flex-col min-h-screen min-w-[1240px]">
      <header className="border-b">
        <div className="container px-4 py-2 md:py-4 lg:py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChartIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold tracking-tight">
                SEC XBRL API Explorer
              </h1>
            </div>
            <div className="flex-1">
              <div className="w-full m-auto rounded-lg">
                <Search entity={company} setEntity={setCompany} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-4 px-4 text-sm md:gap-8 md:px-6 min-w-full">
          <CompanyInfo company={company} />
          <CompanyFacts company={company} />
        </div>
      </main>
    </div>
  );
}

function CompanyInfo({ company }: { company: Company | null }) {
  if (company === null) return <></>;
  const edgarUrl = `https://www.sec.gov/edgar/browse/?CIK=${company.cik}`;
  return (
    <div className="grid gap-2">
      <h2 className="font-semibold">{company.name}</h2>
      <p className="text-sm">
        Central Index Key (CIK): {String(company.cik).padStart(10, "0")}
      </p>
      <div>
        EDGAR page:{" "}
        <a
          href={edgarUrl}
          className="text-blue-500 no-underline hover:text-blue-700"
        >
          {edgarUrl}
        </a>
      </div>
    </div>
  );
}

function CompanyFacts({ company }: { company: Company | null }) {
  const [companyFacts, setCompanyFacts] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (company === null) return;
      const res = await fetch(`/api/companyfacts?cik=${company.cik}`);
      const data = await res.json();
      setCompanyFacts(data.facts);
    }
    fetchData();
  }, [company]); // Empty dependency array means this effect runs once on mount

  if (company === null) return;
  if (!companyFacts) return <div>Loading...</div>;

  // Render your component with companyFacts data
  return <XbrlFacts facts={companyFacts}></XbrlFacts>;
}

function XbrlFacts({ facts }: any) {
  return (
    <section className="flex flex-col space-y-4">
      {Object.entries(facts).map(([key, value]: any[]) => (
        <article key={key} className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{key}</h2>
          {Object.values(value).map(({ label, description, units }: any) => (
            <div className="bg-white shadow sm:rounded-lg" key={label}>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {label}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {description}
                </p>
              </div>
              <XbrlUnitsTable units={units} />
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}

interface FactUnit {
  end: string;
  val: number;
  accn: string;
  fy: number;
  fp: string;
  form: string;
  filed: string;
  frame?: string;
}

interface UnitsProp {
  [unitType: string]: FactUnit[]; // Supports dynamic unit types
}

interface FactsProps {
  units: UnitsProp;
}

function XbrlUnitsTable({ units }: FactsProps) {
  return (
    <div>
      {Object.entries(units).map(([unitType, unitData]) => (
        <div key={unitType} className="mb-8 overflow-x-auto">
          <table className="min-w-full mt-3 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACCN
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fiscal Year
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fiscal Period
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Form
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Filed Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Frame (optional)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unitData.map((unit: FactUnit) => (
                <tr key={unit.accn}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.val}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unitType || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.accn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.fy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.fp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.form}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.filed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.frame || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function BarChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
