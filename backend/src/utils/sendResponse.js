// Every successful response has the same shape: { success, message, data }.
export function sendResponse(res, { statusCode = 200, message, data }) {
  res.status(statusCode).json({ success: true, message, data });
}
