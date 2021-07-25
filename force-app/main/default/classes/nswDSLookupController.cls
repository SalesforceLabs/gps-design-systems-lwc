public with sharing class nswDSLookupController {
    /* 
     * Copyright 2021 Emmanuel Schweitzer and Salesforce
     * Refer to LICENSE at the top of this repo/project
     */

    static final Integer MAX_ROWS = 256;
    @AuraEnabled(cacheable=true)
    public static List<sObject> getSuggestions(String objectApiName,
                                               List<String> fieldApiNames,
                                               String key,
                                               Integer nRows) {
        try {
            Set<String> filteredFieldApiNames = new Set<String>();
            filteredFieldApiNames.add('id');

            for (String fieldApiName : fieldApiNames) {
                if (fieldApiName == null) {
                    continue;
                }

                if (!fieldApiName.containsAny(',)')) {
                    filteredFieldApiNames.add(fieldApiName.toLowerCase());
                }
            }

            String searchKeyword = key + '*';
            String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING ' +
                            objectApiName + '(' + String.join(new List<String>(filteredFieldApiNames), ', ') + ') ' +
                        'LIMIT ' + Math.min(nRows, MAX_ROWS);

            List<List<sObject>> sObjectList = Search.query(query);
            return sObjectList[0];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static Object getLookupRecords(String fieldApiName, String targetApiName, Map<String, String> requestParams, String href) {
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm(); 
        String networkId = Network.getNetworkId();

        if (networkId != null) {
            Network n = [ SELECT Name, UrlPathPrefix FROM Network WHERE Id = :networkId ];

            Url communityUrl = new Url(Network.getLoginUrl(networkId));
            sfdcUrl = communityUrl.getProtocol() + '://' + communityUrl.getAuthority() + '/' + n.UrlPathPrefix;
            System.debug(n);
        }


        if (fieldApiName == null || targetApiName == null) {
            throw new CalloutException('Wrong fieldApiName');
        }

        List<String> fieldApiNameParts = fieldApiName.split('\\.');
        if (fieldApiNameParts.size() != 2) {
            throw new CalloutException('Wrong fieldApiName');
        }
        
        //sfdcURL = 'callout:uiApi';
        String uiAPIURL = sfdcURL + '/services/data/v52.0/ui-api/lookups/' + fieldApiNameParts[0] + '/' + fieldApiNameParts[1] + '/' + targetApiName;  
  
        if (requestParams != null) {
            if (requestParams.size() > 0) {
                uiAPIURL += '?';
            }

            List<String> fullRequestParams = new List<String>();
            for (String key : requestParams.keySet()) {
                fullRequestParams.add(key + '=' + requestParams.get(key));
            }

            uiAPIURL += String.join(fullRequestParams, '&');
        }

        System.debug(uiAPIURL);

        HttpRequest httpRequest = new HttpRequest();  
        httpRequest.setMethod('GET');   
        httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId()); 
        httpRequest.setEndpoint(uiAPIURL);  
        String response = '';

        try {  
            Http http = new Http();   
            HttpResponse httpResponse = http.send(httpRequest);  
            if (httpResponse.getStatusCode() == 200) {  
                response = JSON.serializePretty(JSON.deserializeUntyped(httpResponse.getBody()) );  
            } else if (httpResponse.getStatusCode() == 302) {
                System.debug('moved ' + httpResponse.getHeader('Location'));
                throw new CalloutException( httpResponse.getBody() );  
            } else {  
                System.debug('httpResponse ' + httpResponse.getBody() );  
                throw new CalloutException( httpResponse.getBody() );  
            }   
        } catch( System.Exception e) {  
            System.debug('ERROR: '+ e);  
            throw e;  
        }  

//        System.debug(' ** response ** : ' + response );  
        return JSON.deserializeUntyped(response);
    }
}