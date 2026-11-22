#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Jalankan berkas ini pada macOS."
  exit 1
fi
if [[ -d "/Applications/SaveHUB.app" ]]; then
  open "/Applications/SaveHUB.app"
  exit 0
fi
case "$(uname -m)" in
  arm64) savehub_bundle="release/mac-arm64/SaveHUB.app" ;;
  x86_64) savehub_bundle="release/mac/SaveHUB.app" ;;
  *) echo "Arsitektur Mac ini belum didukung."; exit 1 ;;
esac
if [[ -d "$savehub_bundle" ]]; then
  open "$savehub_bundle"
  exit 0
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Untuk mode sumber, pasang Node.js 24 LTS atau pasang SaveHUB.app dari DMG terlebih dahulu."
  exit 1
fi
npm ci
npm start
