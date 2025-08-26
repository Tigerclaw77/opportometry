import React from "react";
import "../styles/PricingTable.css";

const candidateTiers = [
  { name: "Free", features: { basicSearch: true, advancedSearch: false, postResume: false } },
  { name: "Level 1", features: { basicSearch: true, advancedSearch: true, postResume: false } },
  { name: "Level 2", features: { basicSearch: true, advancedSearch: true, postResume: true } },
];

const recruiterTiers = [
  { name: "Basic", features: { postJob: true, manageApplicants: false, premiumVisibility: false } },
  { name: "Pro", features: { postJob: true, manageApplicants: true, premiumVisibility: false } },
  { name: "Enterprise", features: { postJob: true, manageApplicants: true, premiumVisibility: true } },
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
  const currentCandidateTier = user?.userRole === "candidate" ? user?.tier ?? null : null;
  const currentRecruiterTier = user?.userRole === "recruiter" ? user?.tier ?? null : null;

  return (
    <div className="pricing-tables">
      {/* Candidate Table */}
      <div className="pricing-table-container">
        <table className="pricing-table">
          <thead>
            <tr>
              <th colSpan={candidateTiers.length + 1} className="table-title">
                Candidate Pricing
              </th>
            </tr>
            <tr>
              <th>Features</th>
              {candidateTiers.map((tier, index) => (
                <th
                  key={tier.name}
                  className={currentCandidateTier === index ? "highlight-tier" : ""}
                >
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidateFeaturesList.map((feature) => (
              <tr key={feature.key}>
                <td>{feature.label}</td>
                {candidateTiers.map((tier) => (
                  <td key={tier.name}>
                    <span
                      className={tier.features[feature.key] ? "feature-icon yes" : "feature-icon no"}
                    >
                      {tier.features[feature.key] ? "✔️" : "❌"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recruiter Table */}
      <div className="pricing-table-container">
        <table className="pricing-table">
          <thead>
            <tr>
              <th colSpan={recruiterTiers.length + 1} className="table-title">
                Recruiter Pricing
              </th>
            </tr>
            <tr>
              <th>Features</th>
              {recruiterTiers.map((tier, index) => (
                <th
                  key={tier.name}
                  className={currentRecruiterTier === index ? "highlight-tier" : ""}
                >
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recruiterFeaturesList.map((feature) => (
              <tr key={feature.key}>
                <td>{feature.label}</td>
                {recruiterTiers.map((tier) => (
                  <td key={tier.name}>
                    <span
                      className={tier.features[feature.key] ? "feature-icon yes" : "feature-icon no"}
                    >
                      {tier.features[feature.key] ? "✔️" : "❌"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingTable;
