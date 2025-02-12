import React from "react";
import "../styles/PricingTable.css";

const candidateTiers = [
  {
    name: "Free",
    features: {
      basicSearch: true,
      advancedSearch: false,
      postResume: false,
    },
  },
  {
    name: "Level 1",
    features: {
      basicSearch: true,
      advancedSearch: true,
      postResume: false,
    },
  },
  {
    name: "Level 2", // Highest Tier
    features: {
      basicSearch: true,
      advancedSearch: true,
      postResume: true,
    },
  },
];

const recruiterTiers = [
  {
    name: "Basic",
    features: {
      postJob: true,
      manageApplicants: false,
      premiumVisibility: false,
    },
  },
  {
    name: "Pro",
    features: {
      postJob: true,
      manageApplicants: true,
      premiumVisibility: false,
    },
  },
  {
    name: "Enterprise", // Highest Tier
    features: {
      postJob: true,
      manageApplicants: true,
      premiumVisibility: true,
    },
  },
];

const candidateFeaturesList = [
  { key: "basicSearch", label: "Basic Job Search" },
  { key: "advancedSearch", label: "Advanced Search" },
  { key: "postResume", label: "Post Resume" },
];

const recruiterFeaturesList = [
  { key: "postJob", label: "Post a Job" },
  { key: "manageApplicants", label: "Manage Applicants" },
  { key: "premiumVisibility", label: "Premium Visibility" },
];

const PricingTable = ({ user }) => {
  const isCandidate = user?.role === "candidate" && user.tier < 2;
  const isRecruiter = user?.role === "recruiter" && user.tier < 2;

  return (
    <div className="pricing-tables">
      <h3 className="browse-free">Browse and apply for free!</h3>
      {/* Candidate Table */}
      {isCandidate && (
        <div className="pricing-table">
          <h2>Candidate Pricing</h2>
          <table>
            <thead>
              <tr>
                <th>Features</th>
                {candidateTiers.map((tier) => (
                  <th key={tier.name}>{tier.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidateFeaturesList.map((feature) => (
                <tr key={feature.key}>
                  <td>{feature.label}</td>
                  {candidateTiers.map((tier) => (
                    <td key={tier.name}>
                      {tier.features[feature.key] ? "✔️" : "❌"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recruiter Table */}
      {isRecruiter && (
        <div className="pricing-table">
          <h2>Recruiter Pricing</h2>
          <table>
            <thead>
              <tr>
                <th>Features</th>
                {recruiterTiers.map((tier) => (
                  <th key={tier.name}>{tier.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recruiterFeaturesList.map((feature) => (
                <tr key={feature.key}>
                  <td>{feature.label}</td>
                  {recruiterTiers.map((tier) => (
                    <td key={tier.name}>
                      {tier.features[feature.key] ? "✔️" : "❌"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
