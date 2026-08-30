module.exports = function handler(req, res) {
  const event = String((req.query && req.query.event) || "view").slice(0, 32);
  const ua = String(req.headers["user-agent"] || "unknown");
  const crypto = require("crypto");
  const uaHash = crypto.createHash("sha256").update(ua).digest("hex").slice(0, 16);
  console.log(JSON.stringify({
    event: "nexuseval_pilot_event",
    action: event,
    uaHash,
    observedAt: new Date().toISOString()
  }));
  res.setHeader("Cache-Control", "no-store");
  return res.status(204).end();
};
