/* Copyright Contributors to the Open Cluster Management project */

import { Cluster, mapClusters } from '../../../../../resources'
import { useMemo } from 'react'
import { useSharedAtoms, useRecoilValue } from '../../../../../shared-recoil'

/**
 * Hook to retrieve aggregated list of all clusters
 * @param excludeUnclaimed Excludes unclaimed clusters in cluster pools (or claimed clusters for which the user can not see the claim)
 */
export function useAllClusters(excludeUnclaimed?: boolean, excludeAddons?: boolean) {
  const {
    managedClustersState,
    clusterDeploymentsState,
    managedClusterInfosState,
    certificateSigningRequestsState,
    managedClusterAddonsState,
    clusterManagementAddonsState,
    clusterClaimsState,
    clusterCuratorsState,
    agentClusterInstallsState,
    hostedClustersState,
    nodePoolsState,
  } = useSharedAtoms()

  const managedClusters = useRecoilValue(managedClustersState)
  const clusterDeployments = useRecoilValue(clusterDeploymentsState)
  const managedClusterInfos = useRecoilValue(managedClusterInfosState)
  const certificateSigningRequests = useRecoilValue(certificateSigningRequestsState)
  const managedClusterAddons = useRecoilValue(managedClusterAddonsState)
  const clusterManagementAddOns = useRecoilValue(clusterManagementAddonsState)
  const clusterClaims = useRecoilValue(clusterClaimsState)
  const clusterCurators = useRecoilValue(clusterCuratorsState)
  const agentClusterInstalls = useRecoilValue(agentClusterInstallsState)
  const hostedClusters = useRecoilValue(hostedClustersState)
  const nodePools = useRecoilValue(nodePoolsState)

  const clusters = useMemo(
    () =>
      mapClusters(
        clusterDeployments,
        managedClusterInfos,
        certificateSigningRequests,
        managedClusters,
        managedClusterAddons,
        excludeAddons,
        clusterManagementAddOns,
        clusterClaims,
        clusterCurators,
        agentClusterInstalls,
        hostedClusters,
        nodePools
      ).filter((cluster) => {
        if (excludeUnclaimed) {
          if (cluster.hive.clusterPool) {
            return cluster.hive.clusterClaimName !== undefined
          }
        }
        return true
      }),
    [
      clusterDeployments,
      managedClusterInfos,
      certificateSigningRequests,
      managedClusters,
      managedClusterAddons,
      excludeAddons,
      clusterManagementAddOns,
      clusterClaims,
      clusterCurators,
      agentClusterInstalls,
      hostedClusters,
      nodePools,
      excludeUnclaimed,
    ]
  )
  return clusters as Cluster[]
}
