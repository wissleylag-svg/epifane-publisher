const { runAgent } = require("../agent");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      agent: "epifane-publisher",
      message: "EPIFANE Publisher Agent is ready"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await runAgent(req.body);

    return res.status(200).json({
      success: true,
      product: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
