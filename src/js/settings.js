var offlineDetails = document.getElementById('offlineDetails');

/**
 * Used to convert a given number of bytes
 * to a human readable string. eg. 6MB
 * @param {number} bytes 
 */
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * In the case that SW isn't supported or estimate 
 * isnt supported, fall back to default text
 */
function replaceWithDefault() {
    offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{persistentStorage}}', false);
    offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{storageQuota}}', 'N/A');
    offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{storageUsage}}', 'N/A');
    offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{usagePercentage}}', 'N/A');
};

if ('serviceWorker' in navigator) {
    // Is estimate supported?
    if (!navigator.storage || !navigator.storage.estimate) {
        replaceWithDefault();
    }

    // Is persistent storage granted?
    if (navigator.storage.persist) {
        navigator.storage.persist().then(function (granted) {
            if (granted) {
                offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{persistentStorage}}', true);
            } else {
                offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{persistentStorage}}', false);
            }
        });
    }

    // Check the storage quotas
    navigator.storage.estimate('temporary').then(function (info) {
        // The total amount in bytes 
        offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{storageQuota}}', bytesToSize(info.quota));
        // How much data you’ve used so far in bytes - storageUsage, usagePercentage
        offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{storageUsage}}', bytesToSize(info.usage));

        var usagePercentage = ((info.usage / info.quota) * 100).toFixed(2);
        offlineDetails.innerHTML = offlineDetails.innerHTML.replace('{{usagePercentage}}', usagePercentage + '%');
    });
} else {
    replaceWithDefault();
}