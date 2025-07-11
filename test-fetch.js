fetch("https://arevqehvhkcqivwyojoju.supabase.co/functions/v1/delete-user", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": "Bearer test" },
  body: JSON.stringify({ uid: "test" })
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error); 