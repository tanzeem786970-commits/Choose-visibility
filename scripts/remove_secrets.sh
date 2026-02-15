#!/usr/bin/env bash
# Helper script to untrack env files and show recommended commands to remove secrets from git history.
# RUN THIS LOCALLY. This script will NOT rewrite history automatically — follow instructions carefully.

set -euo pipefail

echo "1) Remove sensitive files from git tracking and add to .gitignore"
git rm --cached .env || true
git rm --cached backend/.env || true
git rm --cached backend/.env.production || true
git add .gitignore
git commit -m "chore: remove env files from repository tracking (do NOT push yet)" || true

echo ""
echo "2) Recommended: Use one of the following tools to scrub secrets from history."
echo "   - BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/"
echo "   - git filter-repo: https://github.com/newren/git-filter-repo"
echo ""
echo "Example (git-filter-repo):"
echo "  git clone --mirror <repo-url> repo.git"
echo "  cd repo.git"
echo "  git filter-repo --invert-paths --paths .env --paths backend/.env --paths backend/.env.production"
echo "  git push --force --all"
echo "  git push --force --tags"

echo "If you used BFG, then run 'git reflog expire --expire=now --all && git gc --prune=now --aggressive'"

echo "3) AFTER you scrub history: rotate all affected credentials (OpenAI, Stripe, AWS, Supabase, Firebase) immediately."
echo "   Also rotate webhook secrets and review provider access logs."

echo "Done. Review commits locally before pushing."
