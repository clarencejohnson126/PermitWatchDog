export async function createDraft(params: {
  subject: string;
  bodyText: string;
  toRecipient: string;
  ccRecipient?: string;
}): Promise<string> {
  const token = process.env.OUTLOOK_GRAPH_ACCESS_TOKEN;
  if (!token) {
    throw new Error("OUTLOOK_GRAPH_ACCESS_TOKEN environment variable is missing.");
  }

  const { subject, bodyText, toRecipient, ccRecipient } = params;

  const payload: any = {
    subject,
    body: {
      contentType: "Text",
      content: bodyText,
    },
    toRecipients: [
      {
        emailAddress: {
          address: toRecipient,
        },
      },
    ],
  };

  if (ccRecipient) {
    payload.ccRecipients = [
      {
        emailAddress: {
          address: ccRecipient,
        },
      },
    ];
  }

  // Use the built-in fetch (Node.js 18+)
  const res = await fetch("https://graph.microsoft.com/v1.0/me/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error("Outlook Graph token expired — refresh required (see backlog)");
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Graph API error: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  const data = await res.json() as any;
  return data.id;
}
