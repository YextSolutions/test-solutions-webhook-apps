//updates in progress to account for timestamp subseq actions

const TARGET_ENDPOINT = "${{slackWebhookUrl}}"; // need to create a channel //add in variable for channel URL 

export function handleListingDuplicateNotification (data: any) {

    const type = data.meta.eventType; // this is from the webhook

    //add calculation of some value to determine if a new entity was just created with the same account id, entity id, and timestamp by user actor. If a new entity was just created, then don't send anything for the Entity Updated event type.
    if (type === "DUPLICATE_FOUND") {
        var accountId = data.meta.accountId;
        var entityId = data.duplicate.id;
        var duplicateUrl = data.duplicate.url;
        var suppressionType = data.duplicate.supressionType
        return foundMessageHandler(accountId, entityId, duplicateUrl, suppressionType);
    } else if (type === "DUPLICATE_UPDATED") {
        var accountId = data.meta.accountId;
        var entityId = data.listing.entityId;
        var approverId = data.suggestion.approver.userId;
        var duplicateUrl = data.duplicate.url;
        return updatedMessageHandler(accountId, entityId, approverId, duplicateUrl);
    } else if (type === "DUPLICATE_DELETED") {
        var accountId = data.meta.accountId;
        var entityId = data.listing.entityId;
        return deleteMessageHandler(accountId, entityId)
    }
    return null;
}

export function foundMessageHandler(accountId: string, entityId: string, duplicateUrl: string, suppressionType: string) {
    var message = "Duplicate found and " + suppressionType + " action has been taken! \nAccount ID: " + accountId + ", Duplicate Entity ID: " + entityId +  "\nSee the live listing URL here: " + duplicateUrl;
    return postRequest(message);
}

export function updatedMessageHandler(accountId: string, entityId: string, approverId: string, duplicateUrl: string) {
    var message = "Duplicate has been updated by " + approverId + "! \nAccount ID: "+ accountId + ", Duplicate Entity ID: " + entityId + "\nSee the live listing URL here: " + duplicateUrl;
    return postRequest(message);
}

export function deleteMessageHandler(accountId: string, entityId: string) {
    var message = "Duplicate has been deleted from active Listings! \nAccount ID: "+ accountId + ", Duplicate Entity ID: " + entityId;
    return postRequest(message);
}

export function postRequest(message: string){
    console.log("here")
    console.log(message)
    var payload = {text:message};
    //payload[field] = message;
    const request = new Request(TARGET_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });
    return fetch(request);
}