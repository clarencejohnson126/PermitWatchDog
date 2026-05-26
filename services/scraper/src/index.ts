import express from 'express';
import { MannheimBekanntmachungenScraper } from './mannheim';
const { PrismaClient } = require('../../../infra/cloud-sql/node_modules/@prisma/client');

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post('/invoke', async (req, res) => {
  console.log('Received cron trigger to /invoke');
  const started_at = new Date();
  try {
    const scraper = new MannheimBekanntmachungenScraper();
    const records = await scraper.run();
    
    const source_breakdown = records.reduce((acc: any, r: any) => {
      acc[r.source_type] = (acc[r.source_type] || 0) + 1;
      return acc;
    }, {});

    const completed_at = new Date();

    await prisma.scraperRun.create({
      data: {
        started_at,
        completed_at,
        total_filings_ingested: records.length,
        errors_count: 0,
        source_breakdown
      }
    });

    console.log(`Successfully scraped ${records.length} records:`, records);
    
    res.json({ status: 'success', scraped: records.length });
  } catch (error: any) {
    console.error('Scraper run failed:', error);
    const completed_at = new Date();
    await prisma.scraperRun.create({
      data: {
        started_at,
        completed_at,
        total_filings_ingested: 0,
        errors_count: 1,
        source_breakdown: {}
      }
    });
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`PermitWatchDog Scraper Service running on port ${PORT}`);
  console.log(`Trigger via POST http://localhost:${PORT}/invoke`);
});
