const fs = require('fs')
const version = process.env.VERSION
const commits = process.env.COMMITS || '' // Fallback to empty string if undefined
const repository = process.env.GITHUB_REPOSITORY // format: owner/repo
const lastVersion = process.env.LAST_VERSION

if (!version) {
  console.error('Version is not defined.')
  process.exit(1)
}

// Read the existing changelog
const changelogPath = 'CHANGELOG.md'
let changelog = ''
if (fs.existsSync(changelogPath)) {
  changelog = fs.readFileSync(changelogPath, 'utf8')
}

// Create a new changelog entry
let newEntry = `## v${version} - ${new Date().toISOString().split('T')[0]}\n\n`

if (commits) {
  // Add commit messages with links
  newEntry += `${commits.split('\n').map(commit => {
    const commitHash = commit.split(' ')[0]
    const commitMessage = commit.slice(commitHash.length + 1)
    return `- ${commitMessage} ([${commitHash.substring(0, 7)}](https://github.com/${repository}/commit/${commitHash}))`
  }).join('\n')}\n\n`
} else {
  // Fallback message when no commits are found
  newEntry += '- No commits found for this release.\n\n'
}

// Add the comparison link
const comparisonLink = `**Full Changelog**: [https://github.com/${repository}/compare/${lastVersion}...v${version}](https://github.com/${repository}/compare/${lastVersion}...v${version})\n\n`

// Find the position of the first version entry
const changelogHeader = '# Changelog'
let insertionPoint = changelog.indexOf(changelogHeader) + changelogHeader.length
if (insertionPoint === changelogHeader.length - 1) {
  insertionPoint = 0 // Handle case where the header is not found
} else {
  insertionPoint = changelog.indexOf('\n', insertionPoint) + 1 // Find the end of the header line
}

// Construct the updated changelog
const updatedChangelog = changelog.slice(0, insertionPoint) + '\n' + newEntry + comparisonLink + changelog.slice(insertionPoint)

// Write the updated changelog back to the file
fs.writeFileSync(changelogPath, updatedChangelog)

console.log(`Changelog updated with version ${version}`)
