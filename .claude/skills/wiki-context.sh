#!/bin/bash

# Wiki Context Fetcher for GlycoGrit Project
# Fetches essential wiki pages from GitHub Wiki to provide development context

set -e

REPO="glycogrit-team/glycogrit-frontend"
WIKI_BASE_URL="https://raw.githubusercontent.com/wiki/${REPO}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📚 Fetching Wiki Context${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to fetch wiki page
fetch_wiki() {
  local page=$1
  local display_name=$2

  echo -e "${GREEN}📄 Fetching: ${display_name}${NC}"

  # Try to fetch via gh api first (respects GitHub token)
  if command -v gh &> /dev/null; then
    content=$(gh api "/repos/${REPO}/contents/${page}.md" \
      --jq '.content' 2>/dev/null | base64 -d 2>/dev/null || echo "")

    if [ -n "$content" ]; then
      echo "$content"
      return 0
    fi
  fi

  # Fallback to raw wiki URL
  content=$(curl -s "${WIKI_BASE_URL}/${page}.md" 2>/dev/null || echo "")

  if [ -n "$content" ] && [[ ! "$content" =~ "404" ]]; then
    echo "$content"
  else
    echo "## ${display_name} (not available)"
  fi
}

# Function to extract summary
extract_summary() {
  local content=$1
  local lines=${2:-10}

  echo "$content" | head -n $lines
}

# Determine what to fetch based on context
CONTEXT="${1:-full}"

case $CONTEXT in
  "code-review")
    echo "Context: Code Review"
    echo ""
    fetch_wiki "01-Coding-Standards" "Coding Standards" > /tmp/coding-standards.md
    fetch_wiki "04-Security-Best-Practices" "Security Best Practices" > /tmp/security.md

    echo -e "\n${BLUE}═══ Coding Standards Summary ═══${NC}"
    extract_summary "$(cat /tmp/coding-standards.md)" 20
    echo ""
    echo -e "${BLUE}═══ Security Requirements ═══${NC}"
    extract_summary "$(cat /tmp/security.md)" 20
    ;;

  "component")
    echo "Context: Component Development"
    echo ""
    fetch_wiki "01-Coding-Standards" "Coding Standards" > /tmp/coding-standards.md
    fetch_wiki "06-Component-Guidelines" "Component Guidelines" > /tmp/components.md
    fetch_wiki "05-Design-Patterns" "Design Patterns" > /tmp/patterns.md

    echo -e "\n${BLUE}═══ Component Guidelines Summary ═══${NC}"
    extract_summary "$(cat /tmp/components.md)" 25
    ;;

  "architecture")
    echo "Context: Architecture Decision"
    echo ""
    fetch_wiki "05-Design-Patterns" "Design Patterns" > /tmp/patterns.md
    fetch_wiki "02-Project-Structure" "Project Structure" > /tmp/structure.md

    echo -e "\n${BLUE}═══ Design Patterns Summary ═══${NC}"
    extract_summary "$(cat /tmp/patterns.md)" 30
    echo ""
    echo -e "${BLUE}═══ Project Structure ═══${NC}"
    extract_summary "$(cat /tmp/structure.md)" 20
    ;;

  "security")
    echo "Context: Security Implementation"
    echo ""
    fetch_wiki "04-Security-Best-Practices" "Security Best Practices" > /tmp/security.md

    echo -e "\n${BLUE}═══ Security Best Practices ═══${NC}"
    cat /tmp/security.md
    ;;

  "full"|*)
    echo "Context: Full Project Context"
    echo ""
    fetch_wiki "01-Coding-Standards" "Coding Standards" > /tmp/coding-standards.md
    fetch_wiki "05-Design-Patterns" "Design Patterns" > /tmp/patterns.md
    fetch_wiki "04-Security-Best-Practices" "Security Best Practices" > /tmp/security.md

    echo -e "\n${BLUE}═══ Essential Context Loaded ═══${NC}"
    echo "✓ Coding Standards"
    echo "✓ Design Patterns"
    echo "✓ Security Best Practices"
    echo ""
    echo "Full wiki available at: https://github.com/${REPO}/wiki"
    ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Wiki Context Loaded${NC}"
