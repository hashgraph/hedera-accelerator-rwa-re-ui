export type AuditData = {
   companyName?: string;
   auditorName?: string;

   auditDate?: string;
   auditType?: string;
   auditReferenceId?: string;
   auditValidityFrom?: string;
   auditValidityTo?: string;

   overallConditionRating?: string;
   immediateActionRequired?: string;
   nextRecommendedAuditDate?: string;

   auditReportFile?: File | null;
   auditReportIpfsId?: string;

   notes?: string;

   submissionDate?: string;
};

export const copeIpfsData: Record<string, AuditData> = {
   QmMockCopeHashFor1234: {
      companyName: "Acme Audit Services",
      auditorName: "John Smith",
      auditDate: "2024-01-15",
      auditType: "comprehensive",
      auditReferenceId: "AUD-2024-001",
      auditValidityFrom: "2024-01-01",
      auditValidityTo: "2025-01-01",
      overallConditionRating: "good",
      immediateActionRequired: "no",
      nextRecommendedAuditDate: "2025-01-15",
      auditReportIpfsId: "QmMockAuditReportHash123",
      notes: "Initial comprehensive audit. Recommend minor improvements for floors 8-10.",
      submissionDate: "2024-01-15T10:30:00Z",
   },
};
