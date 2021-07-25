public class nswDSNavigation {

    @AuraEnabled(cacheable=true)
    public static List<NavigationMenuItem> getNavigationItems(String communityId, String devName) {
        try {
            return [
                SELECT Id, DraftRowId,
                       AccessRestriction, Label, ParentId, Position, Status, Target, TargetPrefs, Type
                FROM NavigationMenuItem
                WHERE NavigationLinkSet.DeveloperName = :devName
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getBaseUrl() {
        return URL.getSalesforceBaseUrl().toExternalForm(); 
    }
}
