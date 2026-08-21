// Vercel Serverless Function: perantara (proxy) untuk proses login.
// Tujuan: supaya browser pengguna TIDAK mengirim password langsung ke domain
// script.google.com (yang sering dicurigai Google Safe Browsing sebagai pola
// phishing/credential harvesting). Dengan file ini, browser cukup kirim
// password ke domain sendiri (mutabaah-sdum.vercel.app/api/login), lalu
// SERVER Vercel (bukan browser) yang meneruskan ke Google Apps Script.

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUDNPQW8LLPG9AJhJROzyoB5SYQtQ8UB0RLTnPPYw6bHWZV3wfDtXhLXL55jCmaGECIQ/exec";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method tidak diizinkan' });
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
}
