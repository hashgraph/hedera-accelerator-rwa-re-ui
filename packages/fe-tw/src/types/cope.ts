export type ConstructionInfo = {
    materials?: string;
    yearBuilt?: string;
    roofType?: string;
    numFloors?: string;
  };
  
  export type OccupancyInfo = {
    type?: string;
    percentageOccupied?: string;
  };
  
  export type ProtectionInfo = {
    fire?: string;
    sprinklers?: string;
    security?: string;
  };
  
  export type ExposureInfo = {
    nearbyRisks?: string;
    floodZone?: string;
  };
  
  export type CopeData = {
    construction?: ConstructionInfo;
    occupancy?: OccupancyInfo;
    protection?: ProtectionInfo;
    exposure?: ExposureInfo;
    insuranceProvider?: string;
    coverageAmount?: string;
    coverageStart?: string;
    coverageEnd?: string;
    notes?: string;
  };
  