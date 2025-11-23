public with sharing class SfGpsDsCommunitiesController {
  @AuraEnabled(cacheable=false)
  public static Map<String, String> getAuthConfig() {
    return SfGpsDsCommunitiesUtilities.getAuthConfig();
  }

  @AuraEnabled(cacheable=false)
  public static String userLogin(String username, String password) {
    try {
      PageReference pageRef = Site.login(username, password, '/');
      return pageRef != null ? pageRef.getUrl() : null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=false)
  public static Boolean userForgotPassword(String username) {
    try {
      if (Site.isValidUserName(username)) {
        return Site.forgotPassword(username);
      } else {
        return false;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static Map<String, String> getFieldset(String fieldsetName) {
    DescribeSObjectResult[] describes = Schema.describeSObjects(new String[] { 'User' });
    Map<String, String> rv = new Map<String, String>();

    if (describes != null && describes.size() > 0) {
      // There should only be the one match for the one object type name
      Schema.FieldSet fs = describes[0].fieldSets.getMap().get(fieldSetName);

      for (Schema.FieldSetMember f : fs.fields) {
        rv.put(f.getFieldPath(), f.getType() + ':' + f.getLabel());
      }
    }

    return rv;
  }  

  @AuraEnabled(cacheable=false)
  public static Boolean registerUser(
    String username, 
    String password, 
    Map<String, String> fields
  ) {
    if (!Site.isRegistrationEnabled()) {
      return false;
    }

    Id userId;
    Id accountId;

    /*
    try {
      userId = Site.createExternalUser(username, accountId, password);

    } catch (Site.ExternalUserCreateException e) {
      if (e.getMessage().containsIgnoreCase('user already exists')) {
        throw new AuraHandledException('portalRegistrationUserExists');
      }
      throw new AuraHandledException('portalRegistrationError');
    }
    */

    return userId != null;
  }

}
