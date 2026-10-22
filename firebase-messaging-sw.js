/* Service worker ของแอป KB NPD
 *  - รับ push จาก Firebase Cloud Messaging ตอนแอปปิดอยู่ (Firebase แสดงแจ้งเตือนให้เอง)
 *  - เก็บไฟล์หน้าแอปไว้ในเครื่อง ให้เปิดไอคอนได้เร็ว
 *  - กดแจ้งเตือน → เปิดแอปไปที่คำขอนั้น
 */
importScripts('config.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

var C = self.KB_CONFIG || {};
var CACHE = 'kb-npd-shell-v6.38'; // เปลี่ยนเลขทุกครั้งที่อัปเดตไฟล์บน GitHub → เครื่องผู้ใช้โหลดของใหม่
var SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/badge-96.png'];

try {
  if (C.firebase && C.firebase.apiKey && !/^X+$/.test(C.firebase.apiKey)) {
    firebase.initializeApp(C.firebase);
    var messaging = firebase.messaging();
    // ข้อความแบบ data อย่างเดียว (ไม่มี notification) → แสดงเอง
    messaging.onBackgroundMessage(function(p){
      if (p.notification) return; // มี notification แล้ว Firebase แสดงให้เอง
      var d = p.data || {};
      return self.registration.showNotification(d.title || 'KB NPD', {
        body: d.body || '', icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: d.url || 'kb-npd', renotify: true, data: { url: d.url || './' }
      });
    });
  }
} catch (e) { /* ยังไม่ได้ตั้งค่า Firebase */ }

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).catch(function(){}));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k.indexOf('kb-npd-shell-') === 0 && k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
// หน้าแอป: ใช้ของใหม่จากเน็ตก่อน ถ้าออฟไลน์ค่อยใช้ของในเครื่อง
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function(r){
    var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
    return r;
  }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match('index.html'); }); }));
});

// กดที่แจ้งเตือน (ที่แอปแสดงเอง) → เปิด/สลับไปที่แอป
self.addEventListener('notificationclick', function(e){
  var d = (e.notification && e.notification.data) || {};
  if (d.FCM_MSG) return; // แจ้งเตือนที่ Firebase แสดงให้ — Firebase จัดการการกดเอง (เปิด fcm_options.link)
  e.notification.close();
  var target = new URL(d.url || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf(self.registration.scope) === 0 && 'focus' in list[i]) {
        return list[i].focus().then(function(c){ return target !== c.url && 'navigate' in c ? c.navigate(target) : c; });
      }
    }
    return self.clients.openWindow(target);
  }));
});
