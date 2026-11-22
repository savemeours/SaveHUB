!macro customInstall
  WriteRegStr SHCTX "Software\Classes\AppUserModelId\${APP_ID}" "DisplayName" "SaveHUB"
  WriteRegStr SHCTX "Software\Classes\AppUserModelId\${APP_ID}" "IconUri" "$INSTDIR\SaveHUB.exe"
  WriteRegStr SHCTX "Software\Classes\AppUserModelId\${APP_ID}" "CustomActivator" "{7D68C3B0-41A0-4DD1-9C4D-5E4A37741F83}"
!macroend

!macro customUnInstall
  RMDir /r "$SMPROGRAMS\SaveHUB Platforms"
  DeleteRegKey SHCTX "Software\Classes\AppUserModelId\${APP_ID}"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.whatsapp"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.telegram"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.instagram"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.facebook"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.discord"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.tiktok"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.threads"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.x"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${APP_ID}.platform.reddit"

!macroend
