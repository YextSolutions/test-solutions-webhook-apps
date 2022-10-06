const TARGET_ENDPOINT = "${{slackWebhookUrl}}"; // need to create a channel //add in variable for channel URL 

export function handleListingStatusNotification (data: any) {

    const type = data.meta.eventType; // this is from the webhook
    const status = data.listing.status; // this is from the webhook

    if (type === "LISTING_UPDATE" &&  status === "NOT_SYNCED") {
        var accountId = data.meta.accountId;
        var entityId = data.listing.entityId;
        var entityUrl = "https://www.yext.com/s/${{businessId}}/entities"; //"https://www.yext.com/s/${{businessId}}/entity/edit3?entityIds=" + data.suggestion.entityFieldSuggestion.entity.uid; add in variable for business id
        return notSyncMessageHandler(accountId, entityId, entityUrl);
    } else if (type === "LISTING_UPDATE" &&  status === "DELETE_FAILED") {
        var accountId = data.meta.accountId;
        var entityId = data.listing.entityId;
        var entityUrl = "https://www.yext.com/s/${{businessId}}/entities"; //"https://www.yext.com/s/${{businessId}}/entity/edit3?entityIds=" + data.suggestion.entityFieldSuggestion.entity.uid; add in variable for business id
        return deleteFailedMessageHandler(accountId, entityId, entityUrl);
    } else if (type === "LISTING_UPDATE" &&  status === "DELETED") {
        var accountId = data.meta.accountId;
        var entityId = data.listing.entityId;
        var entityUrl = "https://www.yext.com/s/${{businessId}}/entities"; //"https://www.yext.com/s/${{businessId}}/entity/edit3?entityIds=" + data.suggestion.entityFieldSuggestion.entity.uid; add in variable for business id
        return deleteMessageHandler(accountId, entityId, entityUrl)
    }
    return null;
}

export function notSyncMessageHandler(accountId: string, entityId: string, entityUrl: string) {
    var message = "Your listing is not synced! \nAccount ID: " + accountId + ", Entity ID: " + entityId +  "\nSee the URL here: " + entityUrl;
    return postRequest(message);
}

export function deleteFailedMessageHandler(accountId: string, entityId: string, entityUrl: string) {
    var message = "Your listing has failed to be deleted! \nAccount ID: "+ accountId + ", Entity ID: " + entityId + "\nSee the URL here: " + entityUrl;
    return postRequest(message);
}

export function deleteMessageHandler(accountId: string, entityId: string, entityUrl: string) {
    var message = "Your listing has been deleted! \nAccount ID: "+ accountId + ", Entity ID: " + entityId + "\nSee the URL here: " + entityUrl;
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