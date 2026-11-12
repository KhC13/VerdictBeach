/**
 * FRONTEND PLACEHOLDER — nothing is sent or stored anywhere.
 *
 * This is the only place enquiry submission is handled. When a backend exists,
 * replace the body with a real request (e.g. fetch to your API) and keep the
 * same contract: resolve on success, throw on failure. Drop `simulated` once
 * data is genuinely delivered so the demo notice disappears from the form.
 */
export async function submitEnquiry(values) {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate latency
  if (import.meta.env.DEV) console.info('[placeholder] enquiry received (not saved):', values);
  return { ok: true, simulated: true };
}
