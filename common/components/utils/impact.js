export default async function fetchImpactData(summary = false) {
  try {
        const options = summary ? "?summary=true" : "";
        const response = await fetch(`/api/impact_dashboard${options}`);
        if (!response.ok) { throw response; }
        return response.json();
    } catch (error) {
        return console.error('Impact Data Fetch Error:', error);
    }
}
