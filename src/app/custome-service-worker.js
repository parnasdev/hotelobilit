// custom-sw-worker.js
importScripts('https://van.najva.com/static/js/scripts/new-website693451-website-58913-e21898ca-831c-42b7-907c-0fc79aa6046a-service-worker.js');// Add your custom code here
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked!');
});
