const fs = require('fs')

// Read package.json file
const packageJsonPath = 'package.json'
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

// Read package-lock.json file
const packageLockJsonPath = 'package-lock.json'
const packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, 'utf8'))

// Get the current version
const currentVersion = packageJson.version

// Parse version into major, minor, and patch parts
const [major, minor, patch] = currentVersion.split('.')

// Define version type (patch, minor, or major)
const versionType = process.argv[2]

// Increment the version based on version type
let newVersion
switch (versionType) {
  case 'patch':
    newVersion = `${major}.${minor}.${parseInt(patch) + 1}`
    break
  case 'minor':
    newVersion = `${major}.${parseInt(minor) + 1}.${0}`
    break
  case 'major':
    newVersion = `${parseInt(major) + 1}.${0}.${0}`
    break
  default:
    console.error('Invalid version type. Use "patch", "minor", or "major".')
    process.exit(1)
}

// Update package.json with the new version
packageJson.version = newVersion
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// Update package-lock.json with the new version
packageLockJson.version = newVersion
fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, null, 2))

console.log(`Version bumped to ${newVersion}`)
