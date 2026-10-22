// ─────────────────────────────────────────────────────────────
//  ตั้งค่าแอป KB NPD บนมือถือ — แก้ไฟล์นี้ไฟล์เดียว
//  (ค่าทั้งหมดในไฟล์นี้เปิดเผยได้ ไม่ใช่ความลับ)
// ─────────────────────────────────────────────────────────────
self.KB_CONFIG = {
  // URL ของเว็บแอป Apps Script (Deploy → Web app → URL ที่ลงท้ายด้วย /exec)
  appUrl: 'https://script.google.com/a/macros/kingsbrite.com/s/AKfycbzxldyPYWmsta4v4qbQ_hQuZEJ-sb39OKSOe6GjYWBP3rYALBugN_jaNZOhEDCdaHFoHg/exec',

  // Firebase Console → Project settings → General → Your apps → Web app → firebaseConfig
  firebase: {
    apiKey: 'BGXorxxZLxFlyWJ4Z0lqsIll4LL_cj_oYbSF7ftQ6Eer8fz6DdA2DdABSrzPVi6GeBEEEhFtHGs-gBSaMVIXTzw',
    authDomain: 'kb-npd.firebaseapp.com',
    projectId: 'kb-npd',
    storageBucket: 'kb-npd.appspot.com',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:xxxxxxxxxxxx'
  },

  // Firebase Console → Project settings → Cloud Messaging → Web Push certificates → Key pair
  vapidKey: 'XXXX'
};
