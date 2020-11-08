const CLAIM_FIELD_SELECTOR = ".community-points-summary > div > .tw-transition";
const CLAIM_BUTTON_SELECTOR = ".community-points-summary > div > .tw-transition .tw-button"

function runObserverIfValidUrl() {
    const url = window.location.href;
    if (isValidUrl(url)) {
        runObserverAfterTargetLoaded(CLAIM_FIELD_SELECTOR);
    }
}

function isValidUrl(url) {
    let re = /twitch\.tv\/\w+/;
    return re.test(url);
}

function runObserverAfterTargetLoaded(targetSelector) {
    let target = document.querySelector(targetSelector);
    if (target === undefined || target == null) {
        let intervalId = setInterval(() => {
            target = document.querySelector(targetSelector);
            if (target != null) {
                clearInterval(intervalId);
                runClaimObserver();
            }
        }, 1000);
    } else {
        runClaimObserver();
    }
}

function runClaimObserver() {
    claimChannelPoints();
    const target = document.querySelector(CLAIM_FIELD_SELECTOR);
    if (target === undefined || target == null) {
        return;
    } 
    const config = { attributes: true, childList: true, subtree: false };
    let observer = new MutationObserver(claimChannelPoints);
    observer.observe(target, config);
}

function claimChannelPoints() {
    if (isRewardClaimable()) {
        clickClaimButton();
    }
}

function isRewardClaimable() {
    return document.querySelector(CLAIM_BUTTON_SELECTOR) != null;
}

function clickClaimButton() {
    document.querySelector(CLAIM_BUTTON_SELECTOR).click();
}

function runOnUrlChange() {
    let last_url = "";
    setInterval(() => {
        let current_url = window.location.href;
        if (last_url !== current_url) {
            last_url = current_url;
            runObserverIfValidUrl();
        }
    }, 5000);
}

// Driver
runOnUrlChange();
