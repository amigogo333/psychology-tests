# Google 試算表接收程式（尚未啟用）

目的：接收完整 FFNI 答案與選填背景、另頁存放選填電郵。工作表欄位已在使用者指定試算表建立。程式不會查詢或公開任何已儲存的研究資料，也不寄送郵件。

## 狀態

目前已備妥程式與欄位，但尚未在 Google 帳戶建立或部署接收程式，也未更動公開網站啟用資料送出。只有試算表網址無法完成連接。

## 建立 Google 接收程式

1. 開啟目標 Google 試算表，選「擴充功能 → Apps Script」。建議在電腦操作。
2. 將 `Code.gs` 全文貼入程式碼檔。另新增 HTML 檔，命名為 `Bridge`，貼入 `Bridge.html`。
3. 儲存，執行 `setup`。依 Google 畫面檢查所要求的權限，由試算表擁有者本人授權。
4. 在專案設定的指令碼屬性，新增：`RESEARCHER_NAME`（蒐集者）、`RESEARCHER_EMAIL`（聯絡信箱）、`RETENTION_DESCRIPTION`（保存期限）、`NOTICE_VERSION`（例如 `2026-11-v1`）。`SPREADSHEET_ID` 由 setup 自動記錄。`COLLECTION_ENABLED` 暫保持 `false`。
5. 「部署 → 新增部署 → 網頁應用程式」；執行身分選擁有者。若要未登入的訪客可提交，需依帳戶政策設定訪客存取；這不代表公開試算表。擁有者檢查並決定此部署授權，不要把試算表設為公開。
6. 保留部署產生的 `/exec` 網址，回傳給網站開發者。不需要提供密碼、驗證碼、OAuth token 或其他憑證。
7. 網站需另外接上 iframe/postMessage bridge，先讀取 status，再呈現告知；已確認版本的 submission 才能送出。沒有伺服器成功回覆，不得顯示已儲存。勿改用 `fetch(mode:'no-cors')` 來假定成功。
8. 檢查研究告知、適用的倫理程序、招募範圍及保存安排；完成端到端測試後再將 `COLLECTION_ENABLED` 設為 `true`。目前中文量表是待審閱試譯，正式研究需確認適用性。

## 接收規格

通道 `ffni-google-sheets-v1`；訊息 `{channel, requestId, action:'status'|'submit', payload}`。Bridge 僅接受指定網站 origin 的父視窗訊息，伺服器驗證版本、148 答案、UUID、時間、背景選項與電郵用途，重新計分；不接受傳入的分數。

payload：`{schemaVersion:'ffni-research-v1',instrumentVersion,id,startedAt,finishedAt,noticeVersion,answers,profile,entry?,contact?:{email,purpose:'research_invitation'}}`。profile／entry 與既有問卷資料格式一致。電郵僅能與同次完整答案一併送出，答題者先決定是否提供；不會提供補查任意作答代碼或公開匯出功能。

同一作答代碼的重試不新增、不覆寫已接受資料；修改答案後欲送新紀錄需有新代碼並在前端說明。每次提交包含所有答案，因此完成後的「送出資料」與「寄後續邀請」應在同一明確動作前完成。伺服器每日寫入上限 500 筆為簡易防濫用，不等同完整機器人防護；擴大招募前應評估更完整的防濫用措施。

兩個分頁屬同一檔案、共用同一組分享權限；分頁不是獨立存取控制。一般分析匯出應排除「聯絡資料」分頁，若研究助理需只讀答案，另建立無電郵的分析檔，不分享此原始工作簿。

原生 API 依據：https://developers.google.com/apps-script/guides/web

## 本地檢查

`node integrations/google-sheets/build-receiver.mjs`

`node integrations/google-sheets/receiver.test.mjs`

測試不使用 Google 憑證、不傳送資料、不寫入使用者試算表。
