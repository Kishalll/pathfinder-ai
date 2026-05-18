export async function GET() {
  const stats = {
    studentsGuided: "10k+",
    careerMatches: "94%",
    successRate: "92%",
    avgRating: "4.8",
  };

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
