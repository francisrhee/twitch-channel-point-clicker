const CLAIM_FIELD_SELECTOR = ".community-points-summary > div > .tw-transition";
const CLAIM_BUTTON_SELECTOR = ".community-points-summary > div > .tw-transition .tw-button"

function runIfValidUrl() {
    const url = window.location.href;
    if (isValidUrl(url)) {
        runAfterTargetLoaded(CLAIM_FIELD_SELECTOR, runClaimObserver);
    }
}

function isValidUrl(url) {
    let re = /twitch\.tv\/\w+/;
    return re.test(url);
}

function runAfterTargetLoaded(targetSelector, callback) {
    let target = document.querySelector(targetSelector);
    if (target === undefined || target == null) {
        let intervalId = setInterval(() => {
            target = document.querySelector(targetSelector);
            if (target != null) {
                console.log("Target found!");
                clearInterval(intervalId);
                callback();
            }
        }, 1000);
    } else {
        callback();
    }
}

function runClaimObserver() {
    claimChannelPoints();
    const target = document.querySelector(CLAIM_FIELD_SELECTOR);
    if (target === undefined || target == null) {
        return;
    } 
    const config = { attributes: true, childList: true, subtree: true };
    let observer = loadObserver(claimChannelPoints);
    observer.observe(target, config);
}

function loadObserver(callback) { // TODO: refactor?
    let observer = new MutationObserver(callback);    
    return observer;
}

function claimChannelPoints() {
    if (isRewardClaimable()) {
        clickClaimButton();
        console.log("Reward claimed!");
    }
}

function isRewardClaimable() {
    return document.querySelector(CLAIM_BUTTON_SELECTOR) != null;
}

function clickClaimButton() {
    document.querySelector(CLAIM_BUTTON_SELECTOR).click();
}

function checkURLChanges() {
    let last_url = "";
    setInterval(() => {
        let current_url = window.location.href;
        if (last_url !== current_url) {
            last_url = current_url;
            runIfValidUrl();
        }
    }, 1000);
}

// Driver
checkURLChanges();
// runIfValidUrl();
