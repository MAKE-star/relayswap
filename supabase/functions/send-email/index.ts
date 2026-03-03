import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');

function emailTemplate({ tx, isAdmin }) {
  const time = new Date(tx.created_at).toLocaleString('en-US', {
    dateStyle: 'medium', timeStyle: 'short'
  });

  const statusColor = tx.status === 'confirmed' ? '#00ff88' : '#ffaa00';
  const modeLabel = tx.mode === 'bridge' ? 'Cross-Chain Bridge' : 'Token Swap';
  const modeIcon = tx.mode === 'bridge' ? '⛓' : '⇄';

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

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1117,#111827);border:1px solid #1f2937;border-radius:16px 16px 0 0;padding:32px 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <span style="font-size:22px;">⚡</span>
                      <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;">RELAY</span>
                      <span style="font-size:10px;color:#6b7280;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-left:4px;">SWAP</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="background:#00ff8822;border:1px solid #00ff8844;color:#00ff88;font-size:10px;font-weight:700;letter-spacing:1.5px;padding:4px 10px;border-radius:20px;text-transform:uppercase;">
                      ● ${tx.status}
                    </span>
                  </td>
                </tr>
              </table>

              <div style="margin-top:24px;">
                <div style="font-size:11px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">
                  ${isAdmin ? '🔔 New Transaction Alert' : `${modeIcon} Transaction Confirmed`}
                </div>
                <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                  ${tx.from_amount} ${tx.from_token}
                  <span style="color:#00ff88;margin:0 8px;">→</span>
                  ${tx.to_amount} ${tx.to_token}
                </div>
                <div style="font-size:13px;color:#9ca3af;margin-top:6px;">${modeLabel} · ${time}</div>
              </div>
            </td>
          </tr>

          <!-- DETAILS -->
          <tr>
            <td style="background:#0d1117;border-left:1px solid #1f2937;border-right:1px solid #1f2937;padding:0 36px;">

              <!-- TX DETAILS TABLE -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #1f2937;border-radius:12px;overflow:hidden;">
                ${[
                  ['Sold', `${tx.from_amount} ${tx.from_token}`],
                  ['Received', `${tx.to_amount} ${tx.to_token}`, '#00ff88'],
                  ['From Chain', tx.from_chain],
                  ['To Chain', tx.to_chain],
                  ['Wallet', tx.wallet_name],
                  ['Wallet Address', `${tx.wallet_address.slice(0,6)}...${tx.wallet_address.slice(-4)}`],
                  ['Status', tx.status.charAt(0).toUpperCase() + tx.status.slice(1), statusColor],
                  ['Time', time],
                ].map(([k, v, color], i) => `
                <tr style="background:${i % 2 === 0 ? '#111827' : '#0d1117'}">
                  <td style="padding:12px 16px;font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;width:140px;">${k}</td>
                  <td style="padding:12px 16px;font-size:13px;color:${color || '#e5e7eb'};font-weight:600;text-align:right;">${v}</td>
                </tr>`).join('')}
              </table>

              <!-- TX HASH -->
              <div style="background:#111827;border:1px solid #1f2937;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
                <div style="font-size:10px;color:#6b7280;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Transaction Hash</div>
                <div style="font-size:11px;color:#00ff88;font-family:'Courier New',monospace;word-break:break-all;">${tx.tx_hash}</div>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#080b10;border:1px solid #1f2937;border-radius:0 0 16px 16px;padding:24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:11px;color:#374151;line-height:1.6;">
                      This is an automated notification from RelaySwap.<br/>
                      ${isAdmin ? 'Admin copy — transaction recorded in database.' : 'If you did not perform this transaction, please contact support immediately.'}
                    </div>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="font-size:18px;">⚡</span>
                  </td>
                </tr>
              </table>
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
    const tx = await req.json();

    const emails = [
      // Admin notification
      {
        from: 'RelaySwap <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🔔 New ${tx.mode === 'bridge' ? 'Bridge' : 'Swap'}: ${tx.from_amount} ${tx.from_token} → ${tx.to_token}`,
        html: emailTemplate({ tx, isAdmin: true }),
      }
    ];

    // If wallet address looks like an email (for demo purposes)
    // In production you'd have user emails in your DB
    const results = await Promise.all(
      emails.map(email =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(email),
        }).then(r => r.json())
      )
    );

    return new Response(JSON.stringify({ success: true, results }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
});