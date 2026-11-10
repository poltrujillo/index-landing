// One source for published identity/contact details. Unknown facts stay null;
// the production build rejects unresolved legal/operational review decisions.
export default {
  name: 'Index Tennis',
  plannedOrigin: 'https://indextennis.com',
  productionOrigin: 'https://indextennis.com',
  contacts: { support: 'support@indextennis.com', privacy: 'support@indextennis.com' },
  supportApproved: true,
  operator: { name: 'Pol Trujillo Albert', countryCode: 'ES', postalAddress: null },
  downloads: { ios: null, android: null },
  legal: {
    minimumAge: 14,
    draftPreparedOn: '2026-11-10',
    approvedPublicationDate: null,
    // A response deadline, not a promise that all external deletions finish at once.
    rightsResponseMonths: 1,
    reviews: {
      operatorAndContact: true,
      minimumAge: true,
      operatorDisclosure: false,
      websiteHostingAndLogs: false,
      providerContractsAndTransfers: false,
      retentionAndDeletion: false,
      finalLegalCopy: false,
    },
    website: {
      host: 'Cloudflare Pages',
      processingRegion: {
        es: 'Red global de Cloudflare; no limitada a la UE/EEE. Las medidas de localización específicas no se presumen activas.',
        en: 'Cloudflare global network; not limited to the EU/EEA. Specific localisation controls are not assumed to be enabled.',
      },
      logRetention: {
        es: 'La política de Cloudflare utiliza criterios de finalidad y necesidad legal, sin un plazo universal para todos los registros de Pages. Falta verificar la configuración de la cuenta y cualquier exportación de registros.',
        en: 'Cloudflare’s policy uses purpose and legal-need criteria, without one universal lifetime for all Pages logs. Account settings and any exported logs still need verification.',
      },
    },
    retainedHistory: { legalBasis: null, duration: null },
  },
};
