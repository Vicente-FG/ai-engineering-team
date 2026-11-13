#!/usr/bin/env bash
# Installs the AI engineering team (agents + standards skill) into a project or into your user config.
#
# Project scope copies the per-tool folders (.claude, .github, .opencode, .agents, .junie, .cursor)
# plus AGENTS.md and CLAUDE.md into the target repository.
#
# User scope copies the agents and the skill into each tool's global configuration directory.
#
# Usage:
#   ./scripts/install.sh [project|user] [target-dir] [tool,tool,...]

set -euo pipefail

SCOPE="${1:-project}"
TARGET="${2:-.}"
TOOLS="${3:-claude,copilot,opencode,junie,cursor,codex}"

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS_SRC="$REPO/plugin/agents"
SKILL_SRC="$REPO/plugin/skills/engineering-standards"
HOME_DIR="$HOME"

copy_tree() {
  local src="$1" dest="$2"
  [ -d "$src" ] || return 0
  mkdir -p "$dest"
  (cd "$src" && find . -type f -print0) | while IFS= read -r -d '' file; do
    mkdir -p "$dest/$(dirname "$file")"
    cp -f "$src/$file" "$dest/$file"
  done
}

copy_file() {
  local src="$1" dest="$2"
  [ -f "$src" ] || return 0
  mkdir -p "$(dirname "$dest")"
  cp -f "$src" "$dest"
}

install_user_tool() {
  local tool="$1" agents_dir="$2" skills_dir="$3"
  [ -n "$agents_dir" ] && copy_tree "$AGENTS_SRC" "$agents_dir"
  [ -n "$skills_dir" ] && copy_tree "$SKILL_SRC" "$skills_dir/engineering-standards"
  echo "installed: $tool"
}

if [ "$SCOPE" = "project" ]; then
  ROOT="$(cd "$TARGET" && pwd)"
  for tool in ${TOOLS//,/ }; do
    case "$tool" in
      claude)   copy_tree "$REPO/.claude/agents" "$ROOT/.claude/agents";   copy_tree "$REPO/.claude/skills" "$ROOT/.claude/skills" ;;
      copilot)  copy_tree "$REPO/.github/agents" "$ROOT/.github/agents";   copy_tree "$REPO/.github/skills" "$ROOT/.github/skills"; copy_tree "$REPO/.github/instructions" "$ROOT/.github/instructions"; copy_tree "$REPO/.agents/skills" "$ROOT/.agents/skills" ;;
      opencode) copy_tree "$REPO/.opencode/agents" "$ROOT/.opencode/agents"; copy_tree "$REPO/.opencode/skills" "$ROOT/.opencode/skills" ;;
      junie)    copy_tree "$REPO/.junie" "$ROOT/.junie";                   copy_tree "$REPO/.agents/skills" "$ROOT/.agents/skills" ;;
      cursor)   copy_tree "$REPO/.cursor/rules" "$ROOT/.cursor/rules";     copy_tree "$REPO/.agents/skills" "$ROOT/.agents/skills" ;;
      codex)    : ;;
      *) echo "unknown tool: $tool" >&2 ;;
    esac
    echo "installed: $tool -> $ROOT"
  done
  copy_file "$REPO/AGENTS.md" "$ROOT/AGENTS.md"
  copy_file "$REPO/CLAUDE.md" "$ROOT/CLAUDE.md"
  copy_file "$REPO/.github/copilot-instructions.md" "$ROOT/.github/copilot-instructions.md"
  echo ""
  echo "Done. Commit the generated folders to share them with your team."
else
  for tool in ${TOOLS//,/ }; do
    case "$tool" in
      claude)   install_user_tool claude   "$HOME_DIR/.claude/agents"          "$HOME_DIR/.claude/skills" ;;
      copilot)  install_user_tool copilot  "$HOME_DIR/.copilot/agents"        "$HOME_DIR/.copilot/skills" ;;
      opencode) install_user_tool opencode "$HOME_DIR/.config/opencode/agents" "$HOME_DIR/.config/opencode/skills" ;;
      junie)    install_user_tool junie    ""                                   "$HOME_DIR/.junie/skills" ;;
      cursor)   install_user_tool cursor   ""                                   "$HOME_DIR/.cursor/skills" ;;
      codex)    install_user_tool codex    ""                                   "$HOME_DIR/.agents/skills" ;;
      *) echo "unknown tool: $tool" >&2 ;;
    esac
  done
  copy_file "$REPO/AGENTS.md" "$HOME_DIR/.codex/AGENTS.md"
  copy_file "$REPO/AGENTS.md" "$HOME_DIR/.junie/AGENTS.md"
  echo ""
  echo "Done. Restart your coding tool so it picks up the new agents and skills."
fi
