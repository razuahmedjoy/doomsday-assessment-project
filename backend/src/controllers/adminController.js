import * as seedService from '../services/seedService.js';
import { sendResponse } from '../utils/sendResponse.js';

export async function reset(req, res) {
  await seedService.resetToSampleData();
  sendResponse(res, { message: 'Database reset to sample data' });
}
