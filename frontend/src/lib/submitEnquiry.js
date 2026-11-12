const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Submits enquiry to the Verdict Beach backend API.
 * Supports both JSON payloads and multipart file attachments.
 * Resolves with the created enquiry data on success, throws on failure.
 */
export async function submitEnquiry(values) {
  let response;

  const hasFiles = Array.isArray(values.files) && values.files.length > 0;

  if (hasFiles) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key !== 'files' && val !== undefined && val !== null) {
        formData.append(key, val);
      }
    });

    values.files.forEach((file) => {
      formData.append('attachments', file);
    });

    response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      body: formData,
    });
  } else {
    const { files, ...jsonValues } = values;
    response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonValues),
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Failed to submit enquiry';
    const error = new Error(message);
    error.errors = data?.errors || [];
    throw error;
  }

  return { ok: true, data: data.data };
}
