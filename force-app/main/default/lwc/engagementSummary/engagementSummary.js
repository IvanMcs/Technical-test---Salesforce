import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Engagement fields
import NAME_FIELD from '@salesforce/schema/Engagement__c.Name';
import AMOUNT_FIELD from '@salesforce/schema/Engagement__c.Related_Opportunity__r.Amount';

// Apex methods
import getEngagementStats from '@salesforce/apex/EngagementController.getEngagementStats';
import createFollowUpTask from '@salesforce/apex/EngagementController.createFollowUpTask';

const FIELDS = [NAME_FIELD, AMOUNT_FIELD];

export default class EngagementSummary extends LightningElement {
    @api recordId;
    
    @track stats;
    @track error;
    @track isProcessing = false;
    
    // Store wire result to enable refresh after task creation
    wiredStatsResult; 

    // Wire engagement record data
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    engagementRecord;

    // Get related opportunity amount
    get oppAmount() {
        return getFieldValue(this.engagementRecord.data, AMOUNT_FIELD);
    }

    // Get engagement name
    get engagementName() {
        return getFieldValue(this.engagementRecord.data, NAME_FIELD);
    }

    // Wire engagement statistics from Apex
    @wire(getEngagementStats, { engagementId: '$recordId' })
    wiredStats(result) {
        this.wiredStatsResult = result;
        if (result.data) {
            this.stats = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = 'Error loading stats';
            this.stats = undefined;
        }
    }

    // Create follow-up task and refresh statistics
    handleCreateTask() {
        this.isProcessing = true;
        
        // Call Apex method to create follow-up task
        createFollowUpTask({ 
            engagementId: this.recordId, 
            engName: this.engagementName 
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Follow-up Task created successfully',
                    variant: 'success'
                })
            );
            // Refresh stats to reflect new task count
            return refreshApex(this.wiredStatsResult);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
        .finally(() => {
            this.isProcessing = false;
        });
    }
}