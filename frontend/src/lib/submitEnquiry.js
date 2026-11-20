const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Sends an enquiry to the Verdict Beach API (JSON, or multipart when files are attached).
 * Resolves with { id } on success. On failure throws an Error with `fieldErrors`
 * (field name -> message) so the form can show each message beside its field.
 */
export async function submitEnquiry(values) {
  const { files = [], ...fields } = values;
  let response;

  if (files.length > 0) {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    files.forEach((file) => formData.append('attachments', file));
    response = await fetch(`${API_BASE_URL}/enquiries`, { method: 'POST', body: formData });
  } else {
    response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'We could not send your enquiry. Please try again.');
    error.status = response.status;
    error.fieldErrors = Object.fromEntries((data?.errors || []).filter((e) => e.field).map((e) => [e.field, e.message]));
    throw error;
  }

  return data.data; // { id }
}
