/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { compile, JSONSchema } from 'json-schema-to-typescript'
import RefParser from '@apidevtools/json-schema-ref-parser'
import prettier from 'prettier'

const main = async () => {
  execSync(
    'aws s3 sync s3://agent-experiment-metadata-dev ./scripts/output/agent-metadata',
    { cwd: `${__dirname}/..` },
  )

  const { experiments } = JSON.parse(
    readFileSync('scripts/output/agent-metadata/index.json', 'utf8'),
  )

  const jobSchemas: Record<string, JSONSchema> = {}

  for (const experiment of experiments) {
    const manifest = JSON.parse(
      readFileSync(
        `scripts/output/agent-metadata/${experiment.id}/manifest.json`,
        'utf8',
      ),
    )

    const inputSchema = await RefParser.dereference(manifest.input_schema)
    const outputSchema = await RefParser.dereference(manifest.output_schema)

    jobSchemas[experiment.id] = {
      type: 'object',
      additionalProperties: false,
      required: ['Input', 'Output'],
      properties: {
        Input: inputSchema as JSONSchema,
        Output: outputSchema as JSONSchema,
      },
    }
  }

  const outputPath = 'gpApi/generated/agent-job-contracts.ts'

  const types = await compile(
    {
      type: 'object',
      additionalProperties: false,
      properties: jobSchemas,
      required: Object.keys(jobSchemas),
    },
    'AgentJobContracts',
    {
      bannerComment: '',
    },
  )

  const prettierConfig = await prettier.resolveConfig(outputPath)
  const formatted = await prettier.format(types, {
    ...prettierConfig,
    parser: 'typescript',
  })

  writeFileSync(outputPath, formatted)

  console.log('✅ Agent job contracts generated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
