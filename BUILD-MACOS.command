#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Build DMG dijalankan di macOS. Gunakan workflow Build SaveHUB macOS jika tidak memiliki Mac."
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Pasang Node.js 24 LTS dari https://nodejs.org/ terlebih dahulu."
  exit 1
fi
node -e 'if(Number(process.versions.node.split(".")[0])<24){console.error("Gunakan Node.js 24 atau lebih baru.");process.exit(1)}'
case "${1:-$(uname -m)}" in
  arm64) build_target="dist:mac:arm64" ;;
  x86_64|x64) build_target="dist:mac:x64" ;;
  all) build_target="dist:mac" ;;
  *) echo "Arsitektur harus arm64, x64, atau all."; exit 1 ;;
esac
npm ci
npm test
export CSC_IDENTITY_AUTO_DISCOVERY="${CSC_IDENTITY_AUTO_DISCOVERY:-false}"
npm run "$build_target"
echo "Selesai. Paket macOS tersedia di folder release."
open release
