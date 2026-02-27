#!/usr/bin/env node

/**
 * Generate CSV file from invalid URLs in validation report
 * Usage: npx ts-node scripts/generate-invalid-urls-csv.ts <input.json> [output.csv]
 */

import * as fs from 'fs'

interface CsvHeader {
  id: string
  title: string
}

interface InvalidUrlEntry {
  url?: string
  status?: number | null
  duration?: number
  finalUrl?: string
  finalStatus?: number | null
  redirectType?: string
}

interface CsvWriter {
  writeRecords: (records: InvalidUrlEntry[]) => Promise<void>
}

interface CreateCsvWriterOptions {
  path: string
  header: CsvHeader[]
}

type ValidationReportByStatus = Partial<Record<string, InvalidUrlEntry[]>>

interface ValidationReport {
  invalidUrls?: InvalidUrlEntry[]
  byStatus?: ValidationReportByStatus
}

const createCsvWriter: (options: CreateCsvWriterOptions) => CsvWriter =
  require('csv-writer').createObjectCsvWriter

const inputFile = process.argv[2]
if (!inputFile) {
  console.error('Please provide the input JSON file as the first argument.')
  process.exit(1)
}
const outputFile = process.argv[3] || 'invalid_urls.csv'

try {
  console.log(`Reading JSON from ${inputFile}`)
  const jsonData = fs.readFileSync(inputFile, 'utf8')
  const data: ValidationReport = JSON.parse(jsonData)

  const invalidUrls: InvalidUrlEntry[] = data.invalidUrls || []
  const redirectUrls: InvalidUrlEntry[] = Object.entries(data.byStatus || {})
    .filter(([status]) => [301, 302, 307, 308].includes(Number(status)))
    .flatMap(([_status, urls]) => urls || [])

  const allProblematicUrls: InvalidUrlEntry[] = [
    ...invalidUrls,
    ...redirectUrls,
  ]

  if (allProblematicUrls.length === 0) {
    console.log('No problematic URLs found')
  } else {
    console.log(
      `Found ${invalidUrls.length} invalid URLs and ${redirectUrls.length} redirect URLs`,
    )

    const csvWriter = createCsvWriter({
      path: outputFile,
      header: [
        { id: 'url', title: 'URL' },
        { id: 'status', title: 'Status' },
        { id: 'duration', title: 'Duration' },
        { id: 'finalUrl', title: 'Final URL' },
        { id: 'finalStatus', title: 'Final Status' },
        { id: 'redirectType', title: 'Redirect Type' },
      ],
    })

    console.log(`Writing to ${outputFile}`)
    csvWriter.writeRecords(allProblematicUrls).then(() => {
      console.log('CSV file written successfully')
    })
  }
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  console.error('Error:', errorMessage)
}
