import fs from "fs";
import path from "path";

const LOG_FILE = path.join(import.meta.dirname, "../logs/info.log");

fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

// Log every request once its response is sent:
// 2026-10-17 14:53:43 -- ::ffff:10.0.1.7 -- GET /eXlBiSl 302 Found -- response-time: 0.27 ms
const logRequests = (req, res, next) => {
  const start = performance.now();

  res.on("finish", async () => {
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const ms = (performance.now() - start).toFixed(2);
    await fs.promises.appendFile(
      LOG_FILE,
      `${date} -- ${req.ip} -- ${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} -- response-time: ${ms} ms\n`
    );
  });

  next();
};

export { logRequests };
