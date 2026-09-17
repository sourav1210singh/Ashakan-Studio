/* HubSpot Forms API - website ke contact form ki leads client ke CRM
   me pahunchati hai (9/17).

   Kyun Forms API aur koi HubSpot embed nahi:
   - Form ka look bilkul wahi rehna tha jo abhi hai (client ki request),
     aur hbspt.forms.create() apna markup inject karta hai.
   - ashkanimage.com pe pehle se yahi tareeka chal raha hai, to portal
     me dono sites ka data ek jaise shape me aata hai.
   Dono sites ki leads ek hi contact list me milti hain, isliye har
   submission ke saath WEBSITE_SOURCE bhejte hain - HubSpot me us
   property pe filter/list bana ke ashkanstudios ki leads alag dikh
   jaati hain.

   Portal 244809545 (region na2) client ka hai. GUID sirf is site ke
   apne form ka hai - ashkanimage ke forms ko haath nahi lagaya gaya. */
export const HUBSPOT_PORTAL_ID = "244809545";
export const HUBSPOT_CONTACT_FORM_GUID = "8512f25a-fadc-47f1-95a7-8f5427eea0a3";

const SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_CONTACT_FORM_GUID}`;

/* Ye site sirf ashkanstudios.com pe chalti hai, par preview builds
   (vercel.app / localhost) bhi isi code se submit karte hain - unki
   test leads CRM me alag pehchani ja saken isliye host bhejte hain. */
const SOURCE = "ashkanstudios.com";

export interface HubSpotLead {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}

/* hubspotutk cookie tracking script (index.html) lagata hai. Ye cookie
   submission ko usi visitor ki browsing history se jodti hai - iske
   bina HubSpot "cookie needed to link form submissions isn't being
   sent" warning deta hai aur attribution adhoora rehta hai. Cookie na
   mile to bhi submission chalti hai, bas analytics kam ho jaata hai. */
function readHubspotCookie(): string {
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/* HubSpot ke paas alag firstname/lastname hain, hamare form me ek hi
   NAME field. Pehle space pe todte hain; single-word naam pe lastname
   bhejte hi nahi (khaali value bhejne se CRM me blank last name set ho
   jaata hai). */
function splitName(full: string): { firstname: string; lastname: string } {
  const parts = full.trim().split(/\s+/);
  return { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
}

/* Ye function kabhi throw nahi karta. HubSpot down ho, ad-blocker
   hs-scripts/hsforms block kar de, ya network girr jaye - lead phir
   bhi /contact.php se client ko email ho jaati hai aur /admin/leads me
   save rehti hai. Isliye yahan sirf true/false wapas jaata hai, form
   ka success/failure ispe depend nahi karta. */
export async function submitToHubSpot(lead: HubSpotLead): Promise<boolean> {
  try {
    const { firstname, lastname } = splitName(lead.name);
    /* Field names HubSpot ke internal names hain - galat naam pe API
       200 hi deta hai aur value chupchaap drop kar deta hai (9/17 me
       test kiya), isliye inhe badalna mat. project_type aur
       website_source is portal ki custom properties hain. */
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

    /* Form ko HubSpot ke bharose latakna nahi hai: 8s ke baad chhod
       dete hain, user ko tab tak /contact.php wala confirmation mil
       chuka hota hai. */
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
