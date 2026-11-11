// Publication details approved by the operator. Review flags record approval of
// the published wording, including the limits documented in docs/legal-review.md.
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
    approvedPublicationDate: '2026-11-11',
    // A response deadline, not a promise that all external deletions finish at once.
    rightsResponseMonths: 1,
    reviews: {
      operatorAndContact: true,
      minimumAge: true,
      operatorDisclosure: true,
      websiteHostingAndLogs: true,
      providerContractsAndTransfers: true,
      retentionAndDeletion: true,
      finalLegalCopy: true,
    },
    website: {
      host: 'Cloudflare Pages',
      processingRegion: {
        es: 'Red global de Cloudflare, con posibles tratamientos fuera de la UE/EEE.',
        en: 'Cloudflare’s global network, including possible processing outside the EU/EEA.',
      },
      logRetention: {
        es: 'Cloudflare conserva datos técnicos según la finalidad del servicio y sus obligaciones legales. Publica plazos específicos para algunos conjuntos de analítica y seguridad, pero no un plazo universal para todos los registros internos de Pages.',
        en: 'Cloudflare retains technical data according to service purposes and legal obligations. It publishes specific periods for some analytics and security datasets, with no universal period for all internal Pages logs.',
      },
    },
    retainedHistory: {
      legalBasis: {
        es: 'Interés legítimo en preservar los resultados confirmados de otros participantes y la reproducibilidad de sus niveles (artículo 6.1.f del RGPD), ponderado frente a los derechos de la persona afectada. Puedes solicitar la supresión o limitación y oponerte a este tratamiento.',
        en: 'Legitimate interests in preserving other participants’ confirmed results and reproducible levels (GDPR Article 6(1)(f)), balanced against the affected person’s rights. You can request erasure or restriction and object to this processing.',
      },
      duration: {
        es: 'Actualmente no está activada la eliminación automática por antigüedad de los partidos e historiales conservados. Se conservan mientras sean necesarios para preservar los resultados confirmados de los rivales y reproducir sus niveles. Valoramos individualmente las solicitudes de supresión, limitación y oposición, y retiramos o minimizamos los datos cuando esa finalidad ya no justifica conservarlos.',
        en: 'Automatic time-based deletion of retained match and rating records is currently disabled. Records are kept while needed to preserve opponents’ confirmed results and reproducible levels. We assess erasure, restriction and objection requests individually and remove or further minimise data when that purpose no longer justifies retaining it.',
      },
    },
  },
};
