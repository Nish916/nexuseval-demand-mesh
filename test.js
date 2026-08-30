const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("./server");

async function withServer(run) {
  const server = app.listen(0);

  await new Promise(resolve => server.once("listening", resolve));

  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
  }
}

test("catalog routes buyers to the currently priced pilot", async () => {
  await withServer(async origin => {
    const response = await fetch(`${origin}/catalog.json`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(
      body.offers.find(offer => offer.id === "batch-qa").agent402Status,
      "priced-router-eligible"
    );
    assert.equal(
      body.offers.find(offer => offer.id === "quick-gate").agent402Status,
      "indexed-unpriced"
    );
  });
});

test("buyer kit recommends the $0.49 batch pilot", async () => {
  await withServer(async origin => {
    const response = await fetch(`${origin}/buyer-kit.json`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.recommendedFirstPaidPilot.offer.id, "batch-qa");
    assert.equal(body.recommendedFirstPaidPilot.offer.price, 0.49);
    assert.deepEqual(
      body.currentMarketplaceState.pricedRoutes,
      [
        "/api/evaluate/batch",
        "/api/evaluate/launch",
        "/api/evaluate/campaign"
      ]
    );
  });
});
