/* HubSpot Forms API - carries the contact form's leads into the
   client's CRM (9/17).

   Why the Forms API and not a HubSpot embed:
   - The form had to keep exactly the look it has (client's request),
     and hbspt.forms.create() injects its own markup.
   - ashkanimage.com already does it this way, so both sites land in the
     portal in the same shape.
   Both sites' leads arrive in one contact list, so every submission
   carries WEBSITE_SOURCE - a filter or list on that property in HubSpot
   separates the ashkanstudios ones.

   Portal 244809545 (region na2) is the client's. The GUID belongs only
   to this site's own form - ashkanimage's forms were left alone. */
export const HUBSPOT_PORTAL_ID = "244809545";
export const HUBSPOT_CONTACT_FORM_GUID = "8512f25a-fadc-47f1-95a7-8f5427eea0a3";

const SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_CONTACT_FORM_GUID}`;

/* The site only runs on ashkanstudios.com, but preview builds
   (vercel.app / localhost) submit through this same code - sending the
   host is what makes their test leads identifiable in the CRM. */
const SOURCE = "ashkanstudios.com";

export interface HubSpotLead {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}

/* The tracking script in index.html sets the hubspotutk cookie. It ties
   a submission to that visitor's browsing history - without it HubSpot
   warns that the "cookie needed to link form submissions isn't being
   sent" and attribution stays incomplete. A missing cookie does not stop
   the submission; it only costs analytics. */
function readHubspotCookie(): string {
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/* HubSpot keeps firstname and lastname apart; our form has a single
   NAME field. Split on the first space, and for a one-word name send no
   lastname at all - sending an empty value writes a blank last name into
   the CRM. */
function splitName(full: string): { firstname: string; lastname: string } {
  const parts = full.trim().split(/\s+/);
  return { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
}

/* This never throws. HubSpot can be down, an ad-blocker can block
   hs-scripts/hsforms, the network can drop - the lead still reaches the
   client by email through /contact.php and is still saved in
   /admin/leads. So this only reports true or false; the form's success
   does not hang on it. */
export async function submitToHubSpot(lead: HubSpotLead): Promise<boolean> {
  try {
    const { firstname, lastname } = splitName(lead.name);
    /* These are HubSpot's internal field names. A wrong name still
       returns 200 and the value is silently dropped (tested 9/17), so do
       not rename them. project_type and website_source are this portal's
       custom properties. */
    const pairs: Array<[string, string]> = [
      ["email", lead.email],
      ["firstname", firstname],
      ["lastname", lastname],
      ["phone", lead.phone],
      ["company", lead.company],
      ["project_type", lead.projectType],
      ["message", lead.message],
      ["website_source", SOURCE],
    ];

    const hutk = readHubspotCookie();
    const body = {
      fields: pairs
        .filter(([, value]) => value.trim() !== "")
        .map(([name, value]) => ({ objectTypeId: "0-1", name, value })),
      context: {
        ...(hutk ? { hutk } : {}),
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    /* Don't leave the form hanging on HubSpot: give up after 8s, by
       which point the user already has the confirmation from
       /contact.php. */
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      return res.ok;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return false;
  }
}
