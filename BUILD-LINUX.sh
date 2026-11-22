#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Linux" ]]; then
  echo "Gunakan Linux atau workflow Build SaveHUB Linux untuk membuat AppImage/DEB."
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Pasang Node.js 24 LTS terlebih dahulu."
  exit 1
fi
node -e 'if(Number(process.versions.node.split(".")[0])<24){console.error("Gunakan Node.js 24 atau lebih baru.");process.exit(1)}'
case "${1:-$(uname -m)}" in
  x86_64|x64|amd64) build_target="dist:linux:x64" ;;
  aarch64|arm64) build_target="dist:linux:arm64" ;;
  *) echo "Arsitektur harus x64 atau arm64."; exit 1 ;;
esac
npm ci
npm test
npm run "$build_target" -- --publish never
echo "Selesai. AppImage dan DEB tersedia di folder release."
