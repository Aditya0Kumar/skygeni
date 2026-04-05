import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Deal, Stage } from '../models/deal';

export async function loadDeals(): Promise<Deal[]> {
  const filePath = path.resolve(__dirname, '../../../deals.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((record: any) => ({
    deal_id: record.deal_id,
    created_date: new Date(record.created_date),
    closed_date: record.closed_date ? new Date(record.closed_date) : null,
    stage: record.stage as Stage,
    deal_value: parseFloat(record.deal_value),
    region: record.region,
    source: record.source,
  }));
}
