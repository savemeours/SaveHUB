$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
try {
  $payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
  [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
  if ($payload.action -eq 'remove') {
    [Windows.UI.Notifications.ToastNotificationManager]::History.Remove([string]$payload.tag, 'SaveHUB', [string]$payload.appId)
  } else {
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
    [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    $xml = [Windows.Data.Xml.Dom.XmlDocument]::new()
    $xml.LoadXml([string]$payload.xml)
    $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
    $toast.Tag = [string]$payload.tag
    $toast.Group = 'SaveHUB'
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier([string]$payload.appId).Show($toast)
  }
  [Console]::Out.Write('ok')
  exit 0
} catch {
  [Console]::Error.Write('Windows could not process the platform notification.')
  exit 1
}
