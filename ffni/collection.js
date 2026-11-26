const channel = 'ffni-google-sheets-v1';
export const schemaVersion = 'ffni-research-v1';

function googleScriptOrigin(origin) {
  return /^https:\/\/(?:script\.google\.com|(?:[a-z0-9-]+[-.])?script\.googleusercontent\.com)$/.test(origin);
}

function comesFromFrame(source, frame) {
  if (!frame || !source) return false;
  try {
    for (let win = source; win; win = win.parent) {
      if (win === frame.contentWindow) return true;
      if (win === win.parent) break;
    }
  } catch { /* An unloaded frame can no longer send a valid receipt. */ }
  return false;
}

// Apps Script renders Bridge inside a Google-owned wrapper iframe.
export function connectReceiver(url, instrumentVersion, onStatus) {
  let frame, peer, peerOrigin, pending, readyTimer;
  let config = null;

  function start() {
    if (pending) return;
    clearTimeout(readyTimer);
    frame?.remove();
    peer = null;
    config = null;
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(url)) {
      onStatus('unconfigured');
      return;
    }
    onStatus('loading');
    frame = document.createElement('iframe');
    frame.title = '問卷資料接收服務';
    frame.hidden = true;
    frame.referrerPolicy = 'no-referrer';
    frame.src = url;
    readyTimer = setTimeout(() => onStatus('unavailable'), 15000);
    document.body.append(frame);
  }

  window.addEventListener('message', event => {
    const msg = event.data;
    if (msg?.channel !== channel || !googleScriptOrigin(event.origin) || !comesFromFrame(event.source, frame)) return;
    if (msg.action === 'hello') {
      clearTimeout(readyTimer);
      const c = msg.config;
      if (!c?.ready || c.origin !== window.location.origin || c.instrumentVersion !== instrumentVersion ||
          c.schemaVersion !== schemaVersion || ![c.noticeVersion, c.researcher, c.email, c.retention].every(x => typeof x === 'string' && x.trim())) {
        peer = null;
        config = null;
        onStatus('disabled');
        return;
      }
      peer = event.source;
      peerOrigin = event.origin;
      config = c;
      onStatus('ready', c);
      return;
    }
    if (msg.action !== 'result' || event.source !== peer || event.origin !== peerOrigin ||
        !pending || msg.requestId !== pending.requestId) return;
    const request = pending;
    pending = null;
    clearTimeout(request.timer);
    if (msg.ok === true && msg.id === request.id) request.resolve(msg);
    else request.reject(new Error('試算表尚未確認這筆作答，請重試。'));
  });

  function submit(payload) {
    if (!config || !peer || pending) return Promise.reject(new Error('目前無法連線到試算表，請稍後重試。'));
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending = null;
        reject(new Error('尚未收到試算表的回覆。請保留此分頁並重試，同一筆作答只會計入一次。'));
      }, 45000);
      pending = {requestId, id: payload.id, resolve, reject, timer};
      try {
        peer.postMessage({channel, requestId, action: 'submit', payload}, peerOrigin);
      } catch {
        clearTimeout(timer);
        pending = null;
        reject(new Error('無法送出作答，請重新連線後重試。'));
      }
    });
  }
  return {start, submit};
}
