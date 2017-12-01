// TODO: Read from database
const IssueArea = {
  "no-specific-issue": "No Specific Issue",
  "1st-amendment": "1st Amendment",
  "2nd-amendment": "2nd Amendment",
  "cultural-issues": "cultural Issues",
  "economy": "Economy",
  "education": "Education",
  "environment": "Environment",
  "health-care": "Health Care",
  "homelessness": "Homelessness",
  "housing": "Housing",
  "immigration": "Immigration",
  "international-issues": "International Issues",
  "national-security": "National Security",
  "political-reform": "Political Reform",
  "public-safety": "Public Safety",
  "social-justice": "Social Justice",
  "taxes": "Taxes",
  "transportation": "Transportation",
  "other-issue": "Other Issue"
};

export type IssueAreaType = $Keys<typeof IssueArea>;

export default IssueArea;
