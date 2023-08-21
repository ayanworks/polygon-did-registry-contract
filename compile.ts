import path from 'path'
import fs from 'fs-extra'
// @ts-ignore
import solc from 'solc'
import * as ethers from 'ethers'

const sourceFolderPath = path.resolve(__dirname, 'contracts')
const buildFolderPath = path.resolve(__dirname, 'artifacts')
const lastSourceHashFilePath = path.resolve(__dirname, 'sst-config.json')

const getContractSource = (contractFileName: string) => {
  const contractPath = path.resolve(__dirname, 'contracts', contractFileName)
  const source = fs.readFileSync(contractPath, 'utf8')
  return source
}

let sources = {}

fs.readdirSync(sourceFolderPath).forEach((contractFileName: string) => {
  sources = {
    ...sources,
    [contractFileName]: {
      content: getContractSource(contractFileName),
    },
  }
})
// console.log(sources);

function convertToHex(inputString: string) {
  let hex = ''
  for (let i = 0; i < inputString.length; i++) {
    hex += '' + inputString.charCodeAt(i).toString(16)
  }
  return hex
}

const sourceHash = ethers.utils.sha256(
  '0x' + convertToHex(JSON.stringify(sources)),
)

console.log('\n'.repeat(process.stdout.rows))

if (
  fs.existsSync(buildFolderPath) &&
  fs.existsSync(lastSourceHashFilePath) &&
  JSON.parse(fs.readFileSync(lastSourceHashFilePath, 'utf8')).sourceHash ===
    sourceHash
) {
  console.log(
    'No changes in .sol files detected... \nSkiping compile script...\n',
  )
} else {
  // write the source hash there at the end of
  // console.log(lastSourceHash,sourceHash);

  const input = {
    language: 'Solidity',
    sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  console.log('Compiling contracts...')
  const output = JSON.parse(solc.compile(JSON.stringify(input))) as any
  console.log('Done')

  let shouldBuild = true

  if (output.errors) {
    // console.error(output.errors);
    for (const error of output.errors) {
      console.log('-'.repeat(process.stdout.columns))
      console.group(error.severity.toUpperCase())
      console.log(error.formattedMessage)
      console.groupEnd()
    }
    if (Object.values(output.errors).length)
      console.log('-'.repeat(process.stdout.columns))
    // throw '\nError in compilation please check the contract\n';
    for (const error of output.errors) {
      if (error.severity === 'error') {
        shouldBuild = false
        throw 'Error found\n'
        break
      }
    }
  }

  if (shouldBuild) {
    console.log('\nBuilding please wait...')

    fs.removeSync(buildFolderPath)
    fs.ensureDirSync(buildFolderPath)

    let i = 0
    for (const contractFile in output.contracts) {
      for (const key in output.contracts[contractFile]) {
        console.log(key, path.resolve(buildFolderPath, `${key}.json`))
        fs.outputJsonSync(
          path.resolve(buildFolderPath, `${key}.json`),
          output.contracts[contractFile][key],
        )
      }
      i++
    }
    console.log('Build finished successfully!\n')
  } else {
    console.log('\nBuild failed\n')
  }

  fs.outputJsonSync(path.resolve(lastSourceHashFilePath), { sourceHash })
}
