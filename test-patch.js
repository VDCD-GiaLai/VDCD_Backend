fetch('http://localhost:3001/api/v1/partners/21aa66d1-245e-4448-a2db-ab5496546457', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: "Test", logo: "http://logo.com", logoFileId: null, websiteUrl: null, order: 0, isActive: true, id: "21aa66d1-245e-4448-a2db-ab5496546457" })
}).then(r => r.json()).then(console.log).catch(console.error);
