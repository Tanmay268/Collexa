import cron from 'node-cron';
import Listing from '../models/Listing.js';

const expireListingsJob = cron.schedule('0 2 * * *', async () => {
  try {
    console.log('🕐 Running expire listings cron job...');
    
    const result = await Listing.updateMany(
      {
        status: 'active',
        expiresAt: { $lt: new Date() },
      },
      {
        $set: { status: 'expired' },
      }
    );
    
    console.log(`✅ Expired ${result.modifiedCount} listings`);
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
});

export const startCronJobs = () => {
  expireListingsJob.start();
  console.log('✅ Cron jobs started');
};
