"use client";

import { useExplorerData } from "@/hooks/useExplorerData";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   TrendingUp,
   Building2,
   Slice,
   DollarSign,
   MapPin,
   Star,
   ArrowRight,
   PieChart,
   Shield,
   Zap,
   Users,
   Target,
   Vault,
} from "lucide-react";
import { useMemo } from "react";

export function ExplorerView() {
   const { featuredBuildings, featuredSlices, slices, buildings } = useExplorerData();

   const platformStats = useMemo(() => {
      const totalBuildings = buildings?.length || 0;
      const totalSlices = slices?.length || 0;
      const totalValue =
         buildings?.reduce((sum, building) => sum + (building.estimatedValue || 0), 0) || 0;

      return {
         totalBuildings,
         totalSlices,
         totalValue,
      };
   }, [buildings, slices]);

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                     Featured Real World Asset Investments
                  </h1>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                     Discover tokenized real estate investments through diversified slices or direct
                     building ownership
                  </p>
                  <div className="flex justify-center items-center space-x-8 mt-6 text-sm text-gray-500">
                     <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        {platformStats.totalBuildings} Properties
                     </div>
                     <div className="flex items-center">
                        <Slice className="h-4 w-4 mr-2" />
                        {platformStats.totalSlices} Investment Slices
                     </div>
                     <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />$
                        {(platformStats.totalValue / 1000000).toFixed(1)}M+ Value
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <Card variant="indigo">
                  <CardHeader
                     icon={<PieChart />}
                     title="Investment Slices"
                     description="Diversified Real Estate Portfolios"
                     badge={
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                           {platformStats.totalSlices} Available
                        </Badge>
                     }
                  />
                  <CardContent className="space-y-6 flex flex-col flex-auto justify-between">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <Shield className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">Risk Diversified</p>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <Zap className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">Auto-Managed</p>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <Target className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">Optimized Returns</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Why Choose Slices?</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Instant Diversification:</strong> Spread risk across
                                 multiple properties with a single investment
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Professional Management:</strong> Expert portfolio
                                 rebalancing and optimization
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Lower Entry Point:</strong> Start investing with smaller
                                 amounts
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Automated Yields:</strong> Passive income through smart
                                 contract distribution
                              </span>
                           </li>
                        </ul>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Featured Slices</h4>
                        <div className="grid gap-3">
                           {featuredSlices?.slice(0, 3).map((slice) => (
                              <Link key={slice.id} href={`/slices/${slice.id}`}>
                                 <div className="flex items-center p-3 bg-white/80 rounded-lg hover:bg-white/90 transition-colors border border-indigo-100">
                                    <img
                                       src={slice.imageIpfsUrl || "/assets/dome.jpeg"}
                                       alt={slice.name}
                                       className="w-12 h-12 object-cover rounded-lg mr-4"
                                    />
                                    <div className="flex-1 min-w-0">
                                       <h5 className="font-medium text-gray-900 truncate">
                                          {slice.name}
                                       </h5>
                                       <div className="flex items-center text-sm text-gray-600">
                                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                          <span>4.8 Rating</span>
                                          <span className="mx-2">•</span>
                                          <span>{slice.allocation || "25"}% Allocation</span>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-sm font-medium text-indigo-600">
                                          12.5% APY
                                       </div>
                                       <div className="text-xs text-gray-500">Est. Return</div>
                                    </div>
                                 </div>
                              </Link>
                           ))}
                        </div>
                     </div>

                     <Link href="/slices" className="mt-auto">
                        <Button className="w-full">
                           Explore All Slices
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card variant="emerald">
                  <CardHeader
                     icon={<Building2 />}
                     title="Direct Building Investment"
                     description="Own Tokenized Real Estate"
                     badge={
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                           {platformStats.totalBuildings} Properties
                        </Badge>
                     }
                  />
                  <CardContent className="space-y-6 flex flex-col flex-auto justify-between">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <Vault className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">Vault Strategies</p>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">Auto-Compound</p>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                           <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                           <p className="text-xs font-medium text-gray-700">DAO Governance</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Why Direct Investment?</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Full Property Exposure:</strong> Direct ownership of
                                 specific real estate assets
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Vault Strategies:</strong> Automated yield optimization and
                                 compound growth
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Governance Rights:</strong> Vote on property decisions and
                                 improvements
                              </span>
                           </li>
                           <li className="flex items-start">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>
                                 <strong>Higher Potential Returns:</strong> Capture full upside of
                                 property appreciation
                              </span>
                           </li>
                        </ul>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Featured Properties</h4>
                        <div className="grid gap-3">
                           {featuredBuildings?.slice(0, 3).map((building) => (
                              <Link key={building.id} href={`/building/${building.id}`}>
                                 <div className="flex items-center p-3 bg-white/80 rounded-lg hover:bg-white/90 transition-colors border border-emerald-100">
                                    <img
                                       src={building.imageUrl || "/assets/dome.jpeg"}
                                       alt={building.title}
                                       className="w-12 h-12 object-cover rounded-lg mr-4"
                                    />
                                    <div className="flex-1 min-w-0">
                                       <h5 className="font-medium text-gray-900 truncate">
                                          {building.title}
                                       </h5>
                                       <div className="flex items-center text-sm text-gray-600">
                                          <MapPin className="h-3 w-3 mr-1" />
                                          <span>{building.location || "Premium Location"}</span>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-sm font-medium text-emerald-600">
                                          {building.estimatedValue
                                             ? `$${(building.estimatedValue / 1000).toFixed(0)}K`
                                             : "$500K"}
                                       </div>
                                       <div className="text-xs text-gray-500">
                                          {building.roi || "8.5"}% ROI
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           ))}
                        </div>
                     </div>

                     <Link href="/building" className="mt-auto">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                           Browse All Properties
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
