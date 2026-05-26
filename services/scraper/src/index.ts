import express from 'express';
import { MannheimBekanntmachungenScraper } from './mannheim';
// import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());

// In a real implementation, we would connect to Prisma here.
// const prisma = new PrismaClient();

app.post('/invoke', async (req, res) => {
  console.log('Received cron trigger to /invoke');
  try {
    const scraper = new MannheimBekanntmachungenScraper();
    const records = await scraper.run();
    
    // Here we would insert into Cloud SQL via Prisma.
    // For the scaffold, we just log the records.
    console.log(`Successfully scraped ${records.length} records:`, records);
    
    res.json({ status: 'success', scraped: records.length });
  } catch (error: any) {
    console.error('Scraper run failed:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`PermitWatchDog Scraper Service running on port ${PORT}`);
  console.log(`Trigger via POST http://localhost:${PORT}/invoke`);
});
