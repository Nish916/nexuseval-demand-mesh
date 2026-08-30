const beacon = require("../future-beacon.json");

module.exports = function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Nexus-Signal", "future-beacon-v1");

  if (req.method === "HEAD") return res.status(200).end();
  return res.status(200).json(beacon);
};
