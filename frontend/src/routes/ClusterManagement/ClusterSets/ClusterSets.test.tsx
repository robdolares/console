/* Copyright Contributors to the Open Cluster Management project */

import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import ClusterSetsPage from './ClusterSets'
import { waitForText, clickByLabel, clickByText, typeByText, waitForNock } from '../../../lib/test-util'
import { nockIgnoreRBAC, nockDelete } from '../../../lib/nock-util'
import { mockManagedClusterSet } from '../../../lib/test-metadata'
import {
    certificateSigningRequestsState,
    clusterDeploymentsState,
    managedClusterInfosState,
    managedClustersState,
    managedClusterSetsState,
} from '../../../atoms'
import { mockClusterDeployments, mockManagedClusterInfos, mockManagedClusters } from '../Clusters/Clusters.test'

const Component = () => (
    <RecoilRoot
        initializeState={(snapshot) => {
            snapshot.set(managedClusterSetsState, [mockManagedClusterSet])
            snapshot.set(clusterDeploymentsState, mockClusterDeployments)
            snapshot.set(managedClusterInfosState, mockManagedClusterInfos)
            snapshot.set(managedClustersState, mockManagedClusters)
            snapshot.set(certificateSigningRequestsState, [])
        }}
    >
        <MemoryRouter>
            <ClusterSetsPage />
        </MemoryRouter>
    </RecoilRoot>
)

describe('ClusterSets page', () => {
    beforeEach(() => {
        nockIgnoreRBAC()
        render(<Component />)
    })
    test('renders', () => {
        waitForText(mockManagedClusterSet.metadata.name!)
    })
    test('can delete managed cluster sets with bulk actions', async () => {
        const nock = nockDelete(mockManagedClusterSet)
        await clickByLabel('Select row 0')
        await clickByText('bulk.delete')
        await typeByText('type.to.confirm', 'confirm')
        await clickByText('delete')
        await waitForNock(nock)
    })
})
