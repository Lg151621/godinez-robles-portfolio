# Project inquiry delivery

Both Start a project buttons open the same native dialog. Validation is shared by the form and `POST /api/inquiries`. The existing MotionProvider handles background scroll locking; the form uses native internal scrolling.

Delivery is intentionally unconfigured until a real recipient/backend is selected. Set `INQUIRY_WEBHOOK_URL` in the hosting environment to an HTTPS endpoint that durably accepts the JSON inquiry and returns 2xx. Set `INQUIRY_WEBHOOK_TOKEN` if it requires Bearer authentication. Keep both values server-only. Restart the local server after changing `.env.local`.

The JSON payload contains `studio`, `name`, `email`, `business`, `website`, `projectTypes` (array), `goal`, `budget`, `timeline`, and `details`. The website does not store inquiries. Configure the receiver to notify the studio and retain inquiries as appropriate. A success screen appears only after the receiver accepts the request. Missing configuration returns 503; delivery failure or timeout returns 502. Neither clears the form. Avoid blind retries after an ambiguous delivery timeout; check the receiver first.

For a future email provider, replace only the delivery block in `src/app/api/inquiries/route.ts`; the UI and validation stay the same. Before public launch, verify delivery end to end with your chosen recipient and apply abuse controls at the receiver or hosting layer.

Playwright tests intercept delivery to exercise sending, success, errors, and retry without sending real client information. API tests exercise actual server validation and unconfigured behavior.
