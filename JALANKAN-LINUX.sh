#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Linux" ]]; then
  echo "Jalankan skrip ini pada Linux."
  exit 1
fi
if command -v savehub >/dev/null 2>&1; then
  exec savehub "$@"
fi
case "$(uname -m)" in
  x86_64|amd64) savehub_arch="x64" ;;
  aarch64|arm64) savehub_arch="arm64" ;;
  *) echo "Arsitektur Linux ini belum didukung."; exit 1 ;;
esac
if [[ "$savehub_arch" == "x64" ]]; then
  savehub_binary="release/linux-unpacked/savehub"
else
  savehub_binary="release/linux-arm64-unpacked/savehub"
fi
if [[ -x "$savehub_binary" ]]; then
  exec "$savehub_binary" "$@"
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Pasang SaveHUB dari paket DEB/AppImage, atau Node.js 24 untuk menjalankan source."
  exit 1
fi
npm ci
npm start -- "$@"
