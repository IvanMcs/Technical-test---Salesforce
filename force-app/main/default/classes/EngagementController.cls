public with sharing class EngagementController {
    
    // Retrieves engagement statistics including opportunity amount and activity counts
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getEngagementStats(Id engagementId) {
        Map<String, Object> results = new Map<String, Object>();
        
        // Query engagement and related opportunity amount - Optionally
        Engagement__c eng = [SELECT Name, Related_Opportunity__r.Amount 
                             FROM Engagement__c 
                             WHERE Id = :engagementId LIMIT 1];
        
        // Count completed tasks
        Integer completedTasks = [SELECT Count() FROM Task 
                                  WHERE WhatId = :engagementId 
                                  AND Status = 'Completed'];
        
        // Count upcoming events
        Integer upcomingEvents = [SELECT Count() FROM Event 
                                  WHERE WhatId = :engagementId 
                                  AND StartDateTime >= TODAY];
        
        results.put('oppAmount', eng.Related_Opportunity__r.Amount);
        results.put('taskCount', completedTasks);
        results.put('eventCount', upcomingEvents);
        results.put('engName', eng.Name);
        
        return results;
    }

    // Creates a follow-up task for the engagement
    @AuraEnabled
    public static void createFollowUpTask(Id engagementId, String engName) {
        Task t = new Task();
        t.Subject = 'Follow-up on ' + engName;
        t.ActivityDate = Date.today().addDays(1);
        t.Type = 'Call';
        t.Status = 'Not Started';
        t.Priority = 'Normal';
        t.WhatId = engagementId;
        
        insert t;
    }
}