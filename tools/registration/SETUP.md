# Workshop sign-ups: one-time setup (about 5 minutes)

The website's **Sign up** page sends each registration to a Google Sheet you own.
You get an email for each new sign-up, tick **Accepted** next to the people you take,
and tap **Send WhatsApp** to message them the congratulations text.

## 1. Make the sheet

1. Go to <https://sheets.new> (signed in to the club's Google account).
2. Name it, for example **AUB Cooking Club – Sign-ups**.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete what's in the editor, then paste everything from [`Code.gs`](Code.gs).
3. Click **Save** (the disk icon).
4. In the function list at the top, choose **setup**, then click **Run**.
5. Google asks for permission. Choose your account → **Advanced** → **Go to … (unsafe)** → **Allow**.
   (It says "unsafe" because it's your own script, not one from the Google store. It only needs
   access to this sheet and to send you the notification emails.)
6. Back in the sheet you'll now see two tabs: **Sign-ups** and **Settings**.

## 3. Put it online

1. In Apps Script: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. Send that URL to Claude (or paste it into `endpoint:` in the `REGISTRATION` section of `index.html`).

That's it. Opening the URL in a browser should show `{"ok":true,...}`.

## Every workshop

- **Questions:** edit `REGISTRATION` in `index.html` (workshop name, date, and the `fields` list).
  New questions get their own column in the sheet automatically.
- **Closing sign-ups:** set `open: false`.
- **The WhatsApp message:** edit cell **B1** in the **Settings** tab. You can use `{first}`, `{name}` and `{workshop}`.
- **Turning off the emails:** type `no` in **Settings → B2**.

## Accepting people

1. Open the **Sign-ups** tab. Each row is one person (yellow rows mean the same number signed up twice).
2. Tick **Accepted**. A **Send WhatsApp ✉** link appears in the next column.
3. Tap it: WhatsApp opens with their number and your message ready. Press send.
4. Tick **Messaged** so the committee knows it's done.

## If you change the script later

Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**, so the URL stays the same.
