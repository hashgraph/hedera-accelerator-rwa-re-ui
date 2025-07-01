"use client";

import type { CopeData } from "@/types/erc3643/types";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Building2,
   Users,
   Shield,
   AlertTriangle,
   Hammer,
   Calendar,
   Layers,
   Home,
   BrickWall,
   Droplets,
   Dam,
} from "lucide-react";

interface CopeViewProps {
   cope?: CopeData;
}

export function CopeView({ cope = {} as CopeData }: CopeViewProps) {
   const { construction, occupancy, protection, exposure } = cope;

   return (
      <div className="space-y-8">
         <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-indigo-900">Property Risk Assessment</h1>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="indigo" className="py-0">
               <CardHeader
                  icon={<Building2 />}
                  title="Construction"
                  description="Building Structure & Materials"
                  badge={
                     <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-700 font-semibold"
                     >
                        Structure
                     </Badge>
                  }
               />
               <CardContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-50">
                        <Hammer className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Materials
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {construction?.materials || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-50">
                        <Calendar className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Year Built
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {construction?.yearBuilt || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-50">
                        <Home className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Roof Type
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {construction?.roofType || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-50">
                        <Layers className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Number of Floors
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {construction?.numFloors || "Not specified"}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card variant="emerald" className="py-0">
               <CardHeader
                  icon={<Users />}
                  title="Occupancy"
                  description="Usage & Occupancy Details"
                  badge={
                     <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 font-semibold"
                     >
                        Usage
                     </Badge>
                  }
               />
               <CardContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-emerald-50">
                        <Home className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Property Type
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {occupancy?.type || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-emerald-50">
                        <Users className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Occupancy Rate
                           </p>
                           <div className="flex items-center space-x-2">
                              <p className="text-base font-semibold text-gray-900">
                                 {occupancy?.percentageOccupied
                                    ? `${occupancy.percentageOccupied}%`
                                    : "Not specified"}
                              </p>
                              {occupancy?.percentageOccupied && (
                                 <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                       className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                       style={{ width: `${occupancy.percentageOccupied}%` }}
                                    />
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card variant="blue" className="py-0">
               <CardHeader
                  icon={<Shield />}
                  title="Protection"
                  description="Safety & Security Systems"
                  badge={
                     <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
                        Safety
                     </Badge>
                  }
               />
               <CardContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-blue-50">
                        <BrickWall className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Fire Protection
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {protection?.fire || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-blue-50">
                        <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Sprinkler System
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {protection?.sprinklers || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-blue-50">
                        <Shield className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Security System
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {protection?.security || "Not specified"}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card variant="amber" className="py-0">
               <CardHeader
                  icon={<AlertTriangle />}
                  title="Exposure"
                  description="Environmental Risk Factors"
                  badge={
                     <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 font-semibold"
                     >
                        Risk
                     </Badge>
                  }
               />
               <CardContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-amber-100/80">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Nearby Risks
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {exposure?.nearbyRisks || "Not specified"}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-amber-100/80">
                        <Dam className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Flood Zone
                           </p>
                           <p className="text-base font-semibold text-gray-900">
                              {exposure?.floodZone || "Not specified"}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="text-center">
               <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                  COPE Assessment Summary
               </h3>
               <p className="text-indigo-700/70">
                  This comprehensive analysis covers Construction, Occupancy, Protection, and
                  Exposure factors to provide a complete risk assessment profile for insurance and
                  investment purposes.
               </p>
            </div>
         </div>
      </div>
   );
}
