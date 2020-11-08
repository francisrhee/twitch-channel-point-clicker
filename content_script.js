const CLAIM_FIELD_SELECTOR = ".community-points-summary > div > .tw-transition";

function runIfValidUrl() {
    console.log("Running (should print on load + once every page change)"); // TODO: remove later - should print multiple times if changing screens
    const url = window.location.href;
    if (isValidUrl(url)) {
        runAfterTargetLoaded(CLAIM_FIELD_SELECTOR, runClaimObserver);
    } else {
        console.log(url, "is not valid.");
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
        console.log("Twitch Channel Auto-Clicker: Could not find channel points on this page.");
        return;
    } 
    const config = { attributes: true, childList: true, subtree: true };
    let observer = loadObserver(claimChannelPoints);
    console.log("Observing channel point changes (should print once after each channel page load)");
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
    return document.getElementsByClassName("claimable-bonus__icon") !== undefined && document.getElementsByClassName("claimable-bonus__icon").length > 0;
}

function clickClaimButton() {
    document.getElementsByClassName("claimable-bonus__icon")[0].click();
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
runIfValidUrl();
