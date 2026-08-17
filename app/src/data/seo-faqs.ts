/* FAQ content for the SEO service pages - supplied by the SEO team
   (docx, 10 pages x 5 questions, no question repeats across pages).
   SeoPage renders these as an accordion above the footer and emits a
   matching FAQPage JSON-LD block, so the schema and the visible copy
   can never drift apart. Keyed by the page slug. */
export interface SeoFaq {
  q: string;
  a: string;
}

export const seoFaqs: Record<string, SeoFaq[]> = {
  "product-photography-in-houston": [
    {
      q: "What types of products do you photograph for Houston brands?",
      a: "At Ashkan Studios we shoot a wide range of physical products for Houston businesses, including apparel and activewear, food and beverage, furniture and handcrafted goods, luxury accessories, and fine art. Whether you sell retail products, handmade items, or artwork, we tailor the lighting and styling to highlight each product's texture, materials, and detail.",
    },
    {
      q: "Why do product photos use a white background, and can you match my brand colors?",
      a: "Clean white backgrounds keep the focus on your product and give online stores a consistent, professional look, which is why they're the classic e-commerce standard. But we're not limited to white. Our Houston studio stocks a plethora of background colors, so we can match your brand palette or create lifestyle setups when you want more mood and context.",
    },
    {
      q: "Can you add models or hair and makeup to a product shoot?",
      a: "Yes. Beyond flat-lay and packshot imagery, we have models plus hair and makeup artists available in-house, so we can show apparel, accessories, or beauty products being worn and used. Adding a model helps customers picture scale, fit, and lifestyle, which is especially useful for activewear, fashion, and cosmetic brands.",
    },
    {
      q: "How should I prepare and send my products for a photo shoot?",
      a: "Send us clean, market-ready samples of each item you want photographed, along with any reference images or a shot list showing the angles and details that matter most. During your consultation we'll confirm quantities, styling notes, and whether products should be shipped to the studio or brought in, so the shoot day runs smoothly and every item is covered.",
    },
    {
      q: "Will these product images work for my online store, Etsy, and print catalogs?",
      a: "Absolutely. We deliver detail-rich product images built to perform across channels: your website and product pages, Etsy or other marketplaces, social media, and print pieces like brochures and catalogs. Consistent, high-quality visuals build customer trust and help turn browsers into buyers wherever your products appear.",
    },
  ],
  "commercial-videographers-houston": [
    {
      q: "What does hiring a commercial videographer at Ashkan Studios include?",
      a: "You get more than one camera operator. Our commercial video projects come with a full creative team: videographers, on-set support like models and hair and makeup when needed, and professional editors for post-production. From concept and shoot planning through filming and the final edit, we handle the whole process so you don't have to coordinate separate vendors.",
    },
    {
      q: "What questions should I ask before hiring a commercial videographer in Houston?",
      a: "Ask to see a reel of similar work, how they approach storytelling and style, what the process and timeline look like, what's included in the edit, and how revisions and music rights are handled. Any strong videographer will answer these clearly, and we're happy to walk through all of them during your consultation.",
    },
    {
      q: "How involved will I be during the shoot, and how do you use my ideas?",
      a: "Very involved, if you'd like to be. We start by combining your thoughts and goals with our creative direction to build the shoot plan, so the final video reflects your brand. On set you're welcome to collaborate, and we keep you in the loop from planning through the final cut.",
    },
    {
      q: "Can I see a reel or examples of your commercial video work?",
      a: "Yes, we're glad to share our reel and relevant examples so you can judge our style and quality before booking. Seeing past work is one of the best ways to know a videographer is the right fit, and it helps us align on the look you want for your project.",
    },
    {
      q: "What camera and recording equipment do your videographers use?",
      a: "We shoot with professional cinema-grade cameras, lighting, and audio gear, and we match the specific setup to each project's creative needs and shooting environment. Combined with our Houston studio's live monitor and infinity wall, that lets us deliver polished, broadcast-quality footage for commercials, brand films, and social content.",
    },
  ],
  "product-photographer-in-houston": [
    {
      q: "How much does it cost to hire a product photographer in Houston?",
      a: "Pricing depends on how many products you're shooting, the number of angles or setups per item, and whether you need models, styling, or lifestyle scenes. Rather than a one-size-fits-all rate, Ashkan Studios builds a custom quote around your catalog and goals. Book a free consultation and we'll scope the shoot and give you a clear price.",
    },
    {
      q: "Do you charge per image, per hour, or per day?",
      a: "It depends on the project. High-volume catalog work is often quoted per image or per product, while creative campaigns with elaborate styling are usually quoted per half-day or full-day. During your consultation we'll recommend the structure that gives you the most value for the number of products and the look you're after.",
    },
    {
      q: "What is the turnaround time for finished product photos?",
      a: "Turnaround varies with the size of the shoot and the level of retouching involved, but we always confirm a delivery timeline before we begin so it aligns with your launch or catalog deadline. If you have a firm date in mind, let us know up front and we'll build the schedule around it.",
    },
    {
      q: "What experience do you have photographing different product categories?",
      a: "Our team has photographed products across many categories, including women's activewear, dancewear, hand-crafted wood furniture, luxury eyewear, and food and beverage brands. That range means we understand how to light reflective surfaces, capture fabric texture, and style very different products so each one looks its best.",
    },
    {
      q: "How do you handle tricky products like reflective, transparent, or very small items?",
      a: "Reflective metals, glass, jewelry, and food each need specific lighting and styling techniques to avoid glare, show true color, and hold fine detail. In our controlled studio we use tailored lighting setups, careful angles, and precise retouching to make challenging products look clean and appealing. Bring your trickiest items, that's exactly what a professional product photographer is for.",
    },
  ],
  "business-marketing-photography-houston": [
    {
      q: "What is business marketing photography, and how is it different from product photography?",
      a: "Business marketing photography is imagery created specifically to promote your brand: team and culture shots, branded lifestyle scenes, workspace and service images, and content designed for ads and campaigns. Where product photography focuses on individual items for sale, marketing photography captures the wider story and personality of your business to support your overall marketing.",
    },
    {
      q: "How can my business use these photos across social media, ads, and our website?",
      a: "A single marketing shoot fuels many channels at once. The images work as scroll-stopping social posts, paid ad creative, website and landing-page visuals, email headers, and print collateral. Because everything is shot in a consistent brand style, your presence looks cohesive whether a customer finds you on social media, Google, or your homepage.",
    },
    {
      q: "What is a brand media inventory, and why does a reusable image library matter?",
      a: "A media inventory is a library of on-brand images you can draw from again and again instead of scrambling for new visuals every time you post or launch. We build that long-standing inventory in one shoot, giving your marketing team ready-to-use content for months, which saves time, keeps your branding consistent, and stretches your budget further.",
    },
    {
      q: "How do I plan a marketing photoshoot that fits my brand goals?",
      a: "It starts with a consultation where we talk through your brand voice, target audience, and where the images will be used. From there we develop a shot plan covering the scenes, settings, and moods that support your campaigns. This planning ensures every frame we capture has a clear marketing purpose rather than being a generic stock-style photo.",
    },
    {
      q: "How does professional marketing photography help drive engagement and conversions?",
      a: "High-quality, authentic imagery builds trust, communicates your brand faster than words, and gives people a reason to stop, read, and act. Strong visuals lift social engagement, improve ad performance, and make website calls-to-action more compelling, all of which support more inquiries and conversions for your Houston business.",
    },
  ],
  "commercial-photographer-houston": [
    {
      q: "What does a commercial photographer do, and how is it different from a portrait photographer?",
      a: "A commercial photographer creates images that help a business sell or promote something: products, services, people, and brand campaigns intended for advertising and marketing use. A portrait photographer focuses on capturing individuals for personal use. The key difference is purpose and licensing, since commercial images are made and licensed for business and promotional use.",
    },
    {
      q: "Who owns the copyright and usage rights to commercial photos?",
      a: "Under U.S. law the photographer generally holds the copyright, while clients receive usage rights to use the images for agreed purposes. At Ashkan Studios we make those rights clear up front, so you know exactly how, where, and for how long you can use your photos. We'll define the licensing scope as part of your project.",
    },
    {
      q: "Can I use the images for advertising, packaging, and third-party platforms like Amazon?",
      a: "Yes. We scope your usage rights to match how you actually plan to use the images, whether that's paid advertising, product packaging, your website, or marketplaces like Amazon. Telling us your intended channels during the consultation lets us grant the right license so you're fully covered wherever the photos appear.",
    },
    {
      q: "What industries and businesses do you work with as a Houston commercial photographer?",
      a: "We work with a broad mix of Houston businesses and brands, from startups to established companies across retail, food and beverage, fashion, professional services, healthcare, and the arts. Because we tailor each shoot to the client, no project is too niche; we adapt our approach to your industry and commercial objectives.",
    },
    {
      q: "What should I look for when choosing a commercial photographer for my brand?",
      a: "Look for a portfolio that fits your style, clear communication about process and licensing, and a photographer who takes time to understand your brand before shooting. We start every engagement with a free consultation for exactly that reason, so you can gauge fit and we can align on your vision before any camera comes out.",
    },
  ],
  "commercial-photography-houston": [
    {
      q: "What types of commercial photography do you offer under one roof?",
      a: "Our Houston studio is a one-stop shop for commercial imagery, including product photography, professional and team headshots, lifestyle and brand photography, and campaign visuals for websites, ads, and print. Handling multiple shoot types in one place means you get a consistent look across all your business imagery in fewer sessions.",
    },
    {
      q: "What is the difference between cinematography and videography?",
      a: "Videography generally covers capturing events and straightforward footage, while cinematography is a more artistic, story-driven craft using deliberate lighting, camera movement, and composition to evoke emotion. Our team approaches motion work with a cinematographer's eye, so your brand films feel intentional and cinematic rather than simply recorded.",
    },
    {
      q: "Do you offer cinematography and commercial video alongside photography?",
      a: "Yes. Because our team includes filmmakers as well as photographers, we can pair a commercial photo shoot with cinematography for brand films, commercials, and social video, often in the same studio session. Capturing stills and motion together saves time and keeps your visual storytelling consistent across every format.",
    },
    {
      q: "What makes your Houston studio different for commercial shoots?",
      a: "Our high-end studio was built for commercial work, featuring a live monitor so you can see images as they're captured and adjust posing, lighting, and wardrobe on the spot, plus a vast selection of backgrounds, props, and an infinity wall. It's a controlled, well-equipped environment that gives your shoot flexibility and polish.",
    },
    {
      q: "How much does a commercial photography project cost in Houston?",
      a: "Cost depends on the scope: the type of shoot, hours and setups required, whether you add video, and the usage rights you need. Instead of fixed packages, we tailor a quote to your project. Reach out for a free consultation and we'll recommend the right scope and provide clear pricing.",
    },
  ],
  "headshot-photography-houston": [
    {
      q: "How much do professional headshots cost in Houston?",
      a: "Headshot pricing depends on whether it's an individual session or a team booking, how many final images and looks you need, and whether you add hair and makeup or on-location service. Rather than a flat rate, we tailor a quote to your needs. Contact us for a free consultation and we'll recommend the right session and price.",
    },
    {
      q: "What should I wear for a professional headshot?",
      a: "Choose solid, non-distracting colors and outfits that fit well and reflect how you present yourself professionally. Bring a couple of options, such as a business look and a slightly more relaxed one, so we can vary the images. Avoid busy patterns and brand-new stiff clothing, and we'll guide you on posing and expression during the session.",
    },
    {
      q: "How long does a headshot session take?",
      a: "An individual professional headshot session is usually fairly quick, while team and corporate bookings are scheduled per person to keep large groups moving efficiently. During booking we'll estimate the time based on how many people and looks are involved, so your day runs on schedule.",
    },
    {
      q: "Do you photograph headshots for entire teams and executives, on location if needed?",
      a: "Yes. We regularly create consistent, professional headshots for whole teams and executives, either in our Houston studio or on location at your business. Shooting your team in one cohesive style keeps your website, LinkedIn profiles, and marketing materials looking unified, and we can bring hair and makeup to keep everyone camera-ready.",
    },
    {
      q: "How often should I update my professional headshot?",
      a: "A good rule of thumb is to refresh your headshot every couple of years, or sooner if your appearance changes noticeably or your current photo no longer matches how you present yourself. Keeping it current builds trust with clients and colleagues who recognize you from your website, LinkedIn, or company profile.",
    },
  ],
  "commercial-videography-in-houston": [
    {
      q: "What types of commercial videos do you produce?",
      a: "We produce strategic commercials, brand films, corporate profiles, product-launch videos, promotional and marketing campaigns, and artistic commissions. Whether you need a polished TV-style spot or engaging social content, we shape the format, length, and storytelling around your goals and where the video will be seen.",
    },
    {
      q: "What is the difference between commercial videography and corporate video?",
      a: "Corporate video usually serves internal or informational needs like training, event recaps, or company updates, while commercial videography is built to market and sell, with higher production value and brand storytelling aimed at customers. We focus on commercial work designed to promote your brand and move your audience to act.",
    },
    {
      q: "How much does a commercial video cost to produce in Houston?",
      a: "Video cost depends on length, number of shoot days and locations, crew size, and the complexity of the edit, including motion graphics or effects. Because these variables differ for every brand, we quote each project individually. Share your vision in a free consultation and we'll outline a scope and price that fit your budget.",
    },
    {
      q: "How long does commercial video production take from concept to final cut?",
      a: "A typical project moves through consultation and planning, the shoot, and post-production editing, with total time depending on scope and revisions. Simple pieces can turn around quickly, while multi-location or highly produced videos take longer. We set a clear timeline before we start and keep you updated at each stage.",
    },
    {
      q: "What's included when you deliver a commercial video, such as length, music, and revisions?",
      a: "We deliver a finished, ready-to-publish video at the length your platform needs, with royalty-free music and full rights to use it on your website and social media. Sound design, color grading, and motion graphics are part of our post-production, and we align on revisions during planning so the final cut matches your expectations.",
    },
  ],
  "video-editing-services-in-houston": [
    {
      q: "Can you edit footage I already shot myself?",
      a: "Yes, that's a core part of what we do. Send us your existing footage and we'll give it a fresh cut or a complete overhaul, whether it's raw clips from a recent shoot or an older video that needs new life. You don't have to film with us to have us edit your project.",
    },
    {
      q: "What does your post-production and editing service include?",
      a: "We handle every aspect of post-production: cutting and story structure, color grading, sound design, royalty-free music, motion graphics, and visual effects, delivered in the formats you need. Whether you want a quick social-media cut or a full commercial edit, we take your footage from rough to polished, final-delivery ready.",
    },
    {
      q: "How much do video editing services cost, and how is editing priced?",
      a: "Editing cost depends on the amount of footage, the length of the final video, and how much color, sound, and motion-graphics work is involved. Projects can be quoted per video or per finished minute. Send us your footage and project details and we'll provide a clear, custom quote before any work begins.",
    },
    {
      q: "How long does it take to edit a video, and how many revisions are included?",
      a: "Turnaround depends on the length and complexity of the edit, and we confirm a delivery date up front so it meets your deadline. We also agree on the number of revision rounds during planning, so you have room to refine the cut and land on a final version you're happy with.",
    },
    {
      q: "Do you provide editing and production services across Texas, or only Houston?",
      a: "While our studio is in Houston, our editing and post-production work is footage-based, so we can serve clients throughout Texas and beyond; just send your footage and we'll handle the rest. For full production shoots we're based in Houston and can discuss travel for projects elsewhere in Texas during your consultation.",
    },
  ],
  "videography-in-the-woodlands": [
    {
      q: "Do you provide videography services in The Woodlands, TX?",
      a: "Yes. Ashkan Studios serves The Woodlands and the greater Houston area with professional commercial, brand, and event videography. Although our studio is based in Houston, The Woodlands is just a short drive away, so we regularly film for businesses and brands throughout the community.",
    },
    {
      q: "Is Ashkan Studios located in The Woodlands, or do you travel there?",
      a: "Our high-end studio is located near downtown Houston, and we travel north to The Woodlands for on-location shoots. You get the best of both: access to a fully equipped studio with a live monitor and infinity wall when you want it, plus a crew that comes to your Woodlands business or event location when that works better.",
    },
    {
      q: "Do you charge a travel fee to shoot in The Woodlands?",
      a: "Because The Woodlands is close to our Houston base, travel is straightforward. Any travel considerations are discussed transparently when we scope your project, so there are no surprises and you'll know exactly what's included in your quote before the shoot. Reach out and we'll lay it all out during your consultation.",
    },
    {
      q: "What types of Woodlands businesses and events do you film?",
      a: "We create video for a wide range of Woodlands clients, from commercials and brand films for local companies to corporate content and event coverage. Whatever your industry, we tailor the storytelling and style to your brand, drawing on experience with clients ranging from boutiques and athletic brands to healthcare professionals.",
    },
    {
      q: "How do we get started on a videography project in The Woodlands?",
      a: "Just reach out to schedule a shoot. We begin with a consultation to understand your goals, style, and where the video will be used, then build a plan and timeline for filming in The Woodlands or at our Houston studio. From there our team handles production and editing through final delivery.",
    },
  ],

  // ─── Fashion landing pages (client docs, 8/17) ───
  "fashion-photography-in-houston": [
    {
      q: "What is included in a fashion photography session in Houston?",
      a: "A typical session includes a pre-shoot consultation, creative and styling direction, professional lighting, and a set of fully retouched final images. Depending on your package we can also arrange models, hair and makeup, and multiple looks or backdrops at our Houston studio.",
    },
    {
      q: "Do you offer both studio and on-location fashion shoots?",
      a: "Yes. We shoot fashion photography at our studio in the Silos at Sawyer Yards and on location throughout Houston, TX. The choice depends on the mood you want, whether that is controlled editorial lighting in-studio or a real-world backdrop that fits your brand story.",
    },
    {
      q: "Can you provide models, hair, and makeup for a fashion shoot?",
      a: "We do. Ashkan Studios has models plus hair and makeup artists available in-house, so you can book a complete fashion production in one place instead of coordinating separate vendors across Houston.",
    },
    {
      q: "What types of fashion photography do you shoot?",
      a: "We cover editorial and high fashion, commercial and lookbook photography, campaign imagery, and model portfolios. Whether you are a designer showing a new collection or a boutique building a catalog, we tailor the styling and lighting to your brand.",
    },
    {
      q: "How do I book a fashion photography shoot in Houston?",
      a: "Reach out through our contact page or call the studio, and we will set up a consultation to discuss your collection, timeline, and creative direction. From there we build a shoot plan and lock in your date.",
    },
  ],

  "fashion-video-production-services-houston": [
    {
      q: "What do fashion video production services in Houston include?",
      a: "Our services cover the full production: creative concept, styling and casting, lighting, filming, editing, and color grading. Depending on your package we can add models, hair and makeup, and multiple looks, all produced at our Houston studio or on location.",
    },
    {
      q: "What types of fashion videos do you produce?",
      a: "We produce brand films, campaign videos, lookbook and collection videos, runway and editorial content, and social-first clips for designers and labels. We match the format and length to where the video will run.",
    },
    {
      q: "Do you shoot fashion video in-studio or on location?",
      a: "Both. We film at our studio in the Silos at Sawyer Yards and on location across Houston, TX, depending on the mood and setting your collection calls for.",
    },
    {
      q: "Can you handle both photography and video in one shoot?",
      a: "Yes. As a full-service production studio, Ashkan Studios can capture fashion photography and video in the same session, so you leave with a complete set of campaign assets from a single production day.",
    },
    {
      q: "How do I get started with a fashion video project in Houston?",
      a: "Contact our team or call the studio to set up a consultation. We will talk through your collection, goals, and timeline, then build a production plan and schedule your shoot.",
    },
  ],
};
