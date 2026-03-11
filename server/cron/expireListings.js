import cron from 'node-cron';
import { syncExpiredListings } from '../services/dataService.js';

const expireListingsJob = cron.schedule('0 2 * * *', async () => {
  try {
    await syncExpiredListings();
    console.log('Expired listing sync complete');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

export const startCronJobs = () => {
  expireListingsJob.start();
  console.log('Cron jobs started');
};
