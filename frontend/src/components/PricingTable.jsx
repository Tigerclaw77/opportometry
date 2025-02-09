import React from "react";
import "./PricingTable.css";

const tiers = [
  {
    name: "Free",
    features: {
      basicSearch: true,
      advancedSearch: false,
      postResume: false,
      postJob: false,
    },
  },
  {
    name: "Level 1",
    features: {
      basicSearch: true,
      advancedSearch: true,
      postResume: false,
      postJob: false,
    },
  },
  {
    name: "Level 2",
    features: {
      basicSearch: true,
      advancedSearch: true,
      postResume: true,
      postJob: true,
    },
  },
];

const featuresList = [
  { key: "basicSearch", label: "Basic Job Search" },
  { key: "advancedSearch", label: "Advanced Search" },
  { key: "postResume", label: "Post Resume" },
  { key: "postJob", label: "Post a Job" },
];

const PricingTable = () => {
  return (
    <div className="pricing-table">
      <table>
        <thead>
          <tr>
            <th>Features</th>
            {tiers.map((tier) => (
              <th key={tier.name}>{tier.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featuresList.map((feature) => (
            <tr key={feature.key}>
              <td>{feature.label}</td>
              {tiers.map((tier) => (
                <td key={tier.name}>
                  {tier.features[feature.key] ? "✔️" : "❌"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
