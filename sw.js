if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let f={};const t=e=>n(e,o),c={module:{uri:o},exports:f,require:t};i[o]=Promise.all(s.map((e=>c[e]||t(e)))).then((e=>(r(...e),f)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.js",revision:null},{url:"index.html",revision:"80e3fefa9534ac2c01dc2ed1149a9120"},{url:"registerSW.js",revision:"9adf8272734ef41ab6e5351d78c8b9fd"},{url:"icons/icon-192x192.png",revision:"b180cc10a78e5613f93238f30cb75c06"},{url:"icons/icon-512x512.png",revision:"f67cd8e6060820a916f1b2abb5dfdff0"},{url:"manifest.webmanifest",revision:"9e84595fff51b05917d2c035ff2c10e1"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
