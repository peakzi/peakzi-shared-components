#!/usr/bin/env node
// CI gate: a PR that changes anything that ships in the package must bump
// `version` in package.json above the base branch's version. Merging to main
// then publishes that version automatically (see .github/workflows/release.yml).
//
// Usage: node scripts/check-version.mjs <base-ref>   (e.g. origin/main)

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const baseRef = process.argv[2] ?? 'origin/main'
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

// Paths whose changes alter the published package. Stories, tests, docs and
// CI config don't ship, so they don't require a release.
const SHIPPED = [/^src\//, /^assets\//, /^package\.json$/, /^vite\.config\.ts$/, /^tsconfig\.json$/]
const NOT_SHIPPED = [/\.stories\.tsx?$/, /\.test\.tsx?$/, /^src\/test\//]

function parse(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version)
  if (!match) throw new Error(`Not a semver version: "${version}"`)
  return { core: match.slice(1, 4).map(Number), pre: match[4] }
}

// Returns >0 if a > b. Pre-releases sort below their release (1.0.0-rc.1 < 1.0.0).
function compare(a, b) {
  const [pa, pb] = [parse(a), parse(b)]
  for (let i = 0; i < 3; i++) {
    if (pa.core[i] !== pb.core[i]) return pa.core[i] - pb.core[i]
  }
  if (pa.pre === pb.pre) return 0
  if (!pa.pre) return 1
  if (!pb.pre) return -1
  return pa.pre.localeCompare(pb.pre, undefined, { numeric: true })
}

const mergeBase = git('merge-base', baseRef, 'HEAD')
const changed = git('diff', '--name-only', mergeBase, 'HEAD').split('\n').filter(Boolean)
const shipped = changed.filter((file) => SHIPPED.some((re) => re.test(file)) && !NOT_SHIPPED.some((re) => re.test(file)))

const headVersion = JSON.parse(readFileSync('package.json', 'utf8')).version
const baseVersion = JSON.parse(git('show', `${baseRef}:package.json`)).version

if (shipped.length === 0) {
  console.log(`No shipped files changed — no version bump required (version ${headVersion}).`)
  process.exit(0)
}

if (compare(headVersion, baseVersion) > 0) {
  console.log(`Version bumped ${baseVersion} → ${headVersion}. It will be published when this PR merges.`)
  process.exit(0)
}

console.error(`::error file=package.json::This PR changes files that ship in @peakzi/components but "version" is ${headVersion} (${baseRef} has ${baseVersion}). Bump it (patch: fix, minor: feature or breaking change while <1.0, major: breaking change after 1.0).`)
console.error('Shipped files changed:\n' + shipped.map((file) => `  - ${file}`).join('\n'))
process.exit(1)
