import { CWP, WBSResult } from '../types/wbs';
import api from './api';

// The backend returns a mapped response where the root object might be complex.
// Based on description: GET /staging/api/wbs/project/{project_id}
// Let's assume it returns an array of CWPs or a Project object containing CWPs.
// For now, I'll assume the response structure matches the "Hierarchical" description:
// root -> CWPs -> IWPs -> Tasks

interface WbsResponse {
  cwps: CWP[];
}

export const fetchWBS = async (projectId: string): Promise<WBSResult> => {
  try {
    const response = await api.get<any>(`/staging/api/wbs/project/${projectId}`);
    
    // Structure: Root -> Sites (Array) -> Packages (Array) (CWPs) -> IWPs -> Tasks
    // We need to flatten Sites to get a list of all CWPs (Packages)
    
    const result: WBSResult = {
      sites: [],
      cwps: []
    };

    if (response.data && Array.isArray(response.data.sites)) {
      // Extract Sites
      result.sites = response.data.sites.map((s: any, index: number) => ({
        site_id: s.site_id || s.id || `site-${index}`,
        site_name: s.site_name || `Site ${index + 1}`
      }));

      const allCWPs: CWP[] = [];
      
      response.data.sites.forEach((site: any, index: number) => {
        if (Array.isArray(site.packages)) {
          // Map backend package to our CWP interface if needed, or push directly
          // We might need to inject Site Name into the CWP title for context
          const currentSiteId = site.site_id || site.id || `site-${index}`;
          const currentSiteName = site.site_name || `Site ${index + 1}`;
          
          const sitePackages = site.packages.map((pkg: any) => ({
            ...pkg,
            // Prefix site name if title doesn't have it, to distinguish identical packages across sites
            title: pkg.package_name || pkg.title || 'Package', 
            site_id: currentSiteId,
            site_name: currentSiteName
          }));
          allCWPs.push(...sitePackages);
        }
      });
      
      result.cwps = allCWPs;
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching WBS:', error);
    throw error;
  }
};
