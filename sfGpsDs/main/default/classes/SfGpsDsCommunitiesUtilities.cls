public without sharing class SfGpsDsCommunitiesUtilities {
  private static Boolean orgPersonAccountStatus = Schema.sObjectType.Account.fields.getMap().containsKey('isPersonAccount');
  
  public static Boolean isPersonAccountEnabled() {
    return orgPersonAccountStatus;
  }

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

  public static Map<String, String> getAuthConfig() {
    Map<String, String> rv = new Map<String, String>();

    Id networkId = Network.getNetworkId();
    String baseUrl = Site.getBaseSecureUrl();
    String pathPrefix = Site.getPathPrefix();
    Boolean isLoginEnabled = Site.isLoginEnabled();
    Boolean isRegistrationEnabled = Site.isRegistrationEnabled();

    System.debug(UserInfo.getUserId());

    rv.put('baseUrl', baseUrl);
    rv.put('pathPrefix', pathPrefix);
    rv.put('isLoginEnabled', String.valueOf(isLoginEnabled));
    rv.put('registrationIsEnabled1', String.valueOf(isRegistrationEnabled));
    rv.put('communitiesLanding', Network.communitiesLanding().getUrl());
    rv.put('loginUrl1', Network.getLoginUrl(networkId));
    rv.put('registrationUrl1', Network.getSelfRegUrl(networkId));
  
    Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(baseUrl, baseUrl + '/' + pathPrefix);
    List<AuthProvider> authProviders = authConfig.getAuthProviders();
    List<SamlSsoConfig> samlProviders = authConfig.getSamlProviders();

    rv.put('loginIsEnabled', String.valueOf(isLoginEnabled));
    rv.put('backgroundColor', authConfig.getBackgroundColor());
    rv.put('footerText', authConfig.getFooterText());
    rv.put('forgotPasswordUrl', authConfig.getForgotPasswordUrl());

    Boolean selfRegEnabled = authConfig.getSelfRegistrationEnabled();
    rv.put('registrationEnabled', String.valueOf(selfRegEnabled));
    Id selfRegDefaultProfileId;

    /* Not usable in Community context */ voir table Network.SelfRegProfileId
    if (selfRegEnabled) {
      try {
        selfRegDefaultProfileId = authConfig.getDefaultProfileForRegistration();
      } catch(System.NoDataFoundException e) {
        selfRegDefaultProfileId = null;
      }
    }

    rv.put('registrationProfileId', selfRegDefaultProfileId);

    String selfRegUrl;

    /* Not usable in Community context */
    if (selfRegEnabled) {
      try {
        selfRegUrl = authConfig.getSelfRegistrationUrl();
      } catch(System.NoDataFoundException e) {
        selfRegUrl = null;
      }
    }

    rv.put('registrationUrl', selfRegUrl);
    rv.put('startUrl', authConfig.getStartUrl());
    rv.put('usernamePasswordEnabled', String.valueOf(authConfig.getUsernamePasswordEnabled()));

    for (AuthProvider authProvider : authProviders) {
      rv.put('auth:' + authProvider, 'Yo');
    }

    for (String key: rv.keySet()) {
      System.debug(key + '=' + rv.get(key));
    }

    return rv;
  }
}
