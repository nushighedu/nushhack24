import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { Agency } from '@/lib/types';

export async function GET() {
    try {
        // Read the CSV file
        const filePath = path.join(process.cwd(), 'data', 'agencies.csv');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Parse CSV data
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        // Validate and transform the data
        const agencies: Agency[] = records.map((record: any) => ({
            name: record.name,
            focus: record.focus,
            sector: record.sector,
            platform: record.platform,
            website: record.website,
        }));

        return NextResponse.json({ agencies });
    } catch (error) {
        console.error('Error reading agencies data:', error);
        return NextResponse.json(
            { error: 'Failed to load agencies data' },
            { status: 500 }
        );
    }
}