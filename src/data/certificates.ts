// Certificates shown on /certificates, newest first. Put the image in
// /public/certificates/ (or reuse an existing one) and add an entry here.

export interface Certificate {
  title: string;
  kind: string;
  issuer: string;
  /** Leave out when the certificate isn't dated. */
  date?: string;
  image: string;
  alt: string;
}

export const certificates: Certificate[] = [
  {
    title: "2026 Vibathon",
    kind: "Certificate of Appreciation",
    issuer: "Mercedes-Benz Tech Malaysia",
    date: "Jul 2026",
    image: "/certificates/mercedes-benz-vibathon-2026.webp",
    alt: "Mercedes-Benz Certificate of Appreciation awarded to Howard Wilyman for participating in the 2026 Vibathon, dated 6 July 2026",
  },
  {
    title: "RenDify: DMT Student Showcase 2025",
    kind: "Certificate of Achievement",
    issuer: "Xiamen University Malaysia",
    date: "Oct 2025",
    image: "/certificates/rendify-dmt-showcase-2025.webp",
    alt: "Xiamen University Malaysia Certificate of Achievement presented to Wilyman Howard for participating in the RenDify: DMT Student Showcase 2025, held 23 to 25 October 2025",
  },
  {
    title: "Best Creative Third-Person Action-Adventure Game (Sea Vagabond)",
    kind: "Certificate of Achievement",
    issuer: "Xiamen University Malaysia, EGDAD-XMUM 2025",
    date: "Sep 2025",
    image: "/projects/sea-vagabond/certificate.webp",
    alt: "Certificate of Achievement from Xiamen University Malaysia's School of Computing and Data Science, awarding Sea Vagabond Best Creative Third-Person Action-Adventure Game Developed Using Unity 3D at EGDAD-XMUM 2025",
  },
  {
    title: "1st Place, Best Advanced and Creative 3D FPS Adventure Game (Code Enternis)",
    kind: "Certificate of Achievement",
    issuer: "Xiamen University Malaysia, GD-XMUM 2025",
    date: "Jul 2025",
    image: "/certificates/gd-xmum-2025-first-place.webp",
    alt: "Xiamen University Malaysia Best Award Certificate of Achievement: 1st Place, Best Advanced and Creative 3D FPS Adventure Game for the project Code Enternis at GD-XMUM 2025, presented to Louise Ellen, Gunawan Nelsen Keane, Sartayeva Aidyn, Tando Jocelyne Audrey and Wilyman Howard",
  },
  {
    title: "Head of Photography & Videography, Adiwarna Fest",
    kind: "Certificate of Appreciation",
    issuer: "GADPA, Xiamen University Malaysia",
    date: "Jun 2025",
    image: "/certificates/adiwarna-fest-2025-photography.webp",
    alt: "Certificate of Appreciation presented to Howard Wilyman for his commitment as Head of Photographer and Videographer at the Adiwarna Fest events held by GADPA at Xiamen University Malaysia on 28 to 29 June 2025",
  },
  {
    title: "Head of Photography & Videography, Simfoni",
    kind: "Certificate of Appreciation",
    issuer: "GADPA, Xiamen University Malaysia",
    date: "Apr 2025",
    image: "/certificates/simfoni-2025-photography.webp",
    alt: "Certificate of Appreciation presented to Howard Wilyman for his commitment as Head of Photography and Videography at the Simfoni event held by GADPA at Xiamen University Malaysia on 25 April 2025",
  },
  {
    title: "Huawei Talk",
    kind: "Certificate of Participation",
    issuer: "AI (MINDS) Club, Xiamen University Malaysia, with Huawei ICT Academy",
    date: "Apr 2025",
    image: "/certificates/huawei-talk-ai-minds-club.webp",
    alt: "Certificate of Participation presented to Howard Wilyman for active participation in the Huawei Talk organized by the AI (MINDS) Club at Xiamen University Malaysia, with Huawei ICT Academy",
  },
];
