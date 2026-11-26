# FFNI 研究問卷收件設定

完整 FFNI 問卷可將 148 題答案、選填背景、分數及從 NPI-16 帶入的答案寫入「作答資料」。後續研究邀請信箱為選填，寫在「聯絡資料」。兩個分頁共用試算表的分享權限。

1. 從指定試算表開啟「擴充功能 → Apps Script」。使用本目錄的 `Code.gs`，新增名為 `Bridge` 的 HTML 檔並使用 `Bridge.html` 的內容。
2. 執行 `setup` 並授權。它會核對兩頁標頭，並將這份試算表的 ID 存在專案設定中。
3. 在「專案設定 → 指令碼屬性」填入 `RESEARCHER_NAME`（公開聯絡稱呼）、`RESEARCHER_EMAIL`（公開聯絡信箱）、`RETENTION_DESCRIPTION`（保存期限）、`NOTICE_VERSION`（告知版本）及 `COLLECTION_ENABLED`（`true` 為開啟，`false` 為暫停）。告知內容有異動時請更新版本。
4. 部署為網頁應用程式，以擁有者身分執行，開放任何人使用接收服務。將部署產生的 `https://script.google.com/macros/s/…/exec` 填入網站 `ffni/collection-config.js` 的 `receiverUrl`。試算表本身可維持私人。更新已部署的程式碼時，請在「管理部署作業」將同一部署切換到新版本。
5. 從已發佈的 FFNI 問卷測試送出，以畫面回執及試算表中的作答代碼核對是否成功。相同代碼重試只會計入一次。若收件暫停，可繼續個人練習或下載個人結果。

只有答題者在最後一頁送出時，網站才會傳送答案。僅做短測驗、返回舊進度、查看結果均不會上傳。接收程式會驗證欄位、重新計分，並依台灣時區記錄收件時間。研究試算表沒有公開查詢端點。

修改接收程式時編輯 `receiver-source.js`，執行 `node integrations/google-sheets/build-receiver.mjs` 以更新部署用的 `Code.gs`。執行 `node ffni/scoring.test.mjs`、`node integrations/google-sheets/receiver.test.mjs` 及 `node integrations/google-sheets/bridge.test.mjs` 可測試計分、寫入與收件回覆。
