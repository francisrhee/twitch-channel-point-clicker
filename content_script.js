const CLAIM_FIELD_SELECTOR = ".community-points-summary > div > .tw-transition";
const ROOT_SELECTOR = ".root";
const CHANNEL_NAME_SELECTOR = ".channel-info-content h1";

// Sets up claim observer if the url is valid.
function runIfValidUrl() {
    console.log("Running (should print on load + once every page change)"); // TODO: remove later - should print multiple times if changing screens
    const url = window.location.href;
    if (isValidUrl(url)) {
        // runAfterLoading(runClaimObserver);
        runAfterTargetLoaded(CLAIM_FIELD_SELECTOR, runClaimObserver);
    } else {
        console.log(url, "is not valid.");
    }
}

function runIfValidUrl2() {
    console.log("Valid URL 2 (once per change)");
    runAfterLoading(runClaimObserver);
}

// Checks if current url is valid
function isValidUrl(url) {
    let re = /twitch\.tv\/\w+/;
    return re.test(url);
}

// Makes sure page is fully loaded before running given callback function
// function runAfterLoading(callback) { // TODO: determine if components loaded - check if element exists?
//     console.log(document.readyState);
//     if (document.readyState !== "complete") {
//         document.addEventListener('readystatechange', event => { 
//             if (event.target.readyState === "complete") {
//                 claimChannelPoints(); // Attempt to claim channel points if they are already present - might want to put this elsewhere?
//                 callback();
//             }
//         });
//     } else {
//         callback();
//     }
//     // observeDOMChangeIfNodeMissing(".community-points-summary > div > .tw-transition", callback);
// }

// Checks if target exists every second; once found, performs callback
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
    }
}

// Checks if element exists - if exists, runs callback. if not exists, waits until it exists to run callback.
// function observeDOMChangeIfNodeMissing(nodeSelector, callback) { // Observe DOM for changes -> detect change -> if node with target is added, run the claimObserver


//     const node = document.querySelector(nodeSelector);
//     if (node !== undefined && node != null) {
//         callback();
//     }
//     const target = document.querySelector(".root");
//     const config = { attributes: true, childList: true, subtree:true };
//     let observer = loadObserver();

// }

// Sets up claim observer with autoclaim callback on channel page
function runClaimObserver() {
    claimChannelPoints(); // Attempt to claim channel points if available already
    const target = document.querySelector(CLAIM_FIELD_SELECTOR);
    console.log("runClaimObserver", typeof target, target);
    if (target === undefined || target == null) {
        console.log("Twitch Channel Auto-Clicker: Could not find channel points on this page.");
        return;
    } 
    const config = { attributes: true, childList: true, subtree: true };
    let observer = loadObserver(claimChannelPoints);
    console.log("Observing channel point changes (should print once after each channel page load)");
    observer.observe(target, config);
}

// Load observer
function loadObserver(callback) { // TODO: refactor?
    let observer = new MutationObserver(callback);    
    return observer;
}

// Claim function
function claimChannelPoints() {
    if (isRewardClaimable()) {
        clickClaimButton();
        console.log("Reward claimed!");
    }
}

// Self-explanatory
function isRewardClaimable() {
    return document.getElementsByClassName("claimable-bonus__icon") !== undefined && document.getElementsByClassName("claimable-bonus__icon").length > 0;
}

// Self-explanatory
function clickClaimButton() {
    document.getElementsByClassName("claimable-bonus__icon")[0].click();
}

// Makes sure the DOM observer starts to run AFTER page is fully loaded - any page
function checkDOMChanges() {
    runAfterTargetLoaded(CHANNEL_NAME_SELECTOR, resetClaimObserverOnDOMChange);
}

// Setup DOM observer to reset the claim observer on DOM change
function resetClaimObserverOnDOMChange() { // TODO: instead of channel name, we need to detect changes in the DOM where we have access to the target on all pages (but ignore chat)
    let target = document.querySelector(CHANNEL_NAME_SELECTOR); // Streamer name
    if (target === undefined || target == null) {
        target = document.querySelector(ROOT_SELECTOR);
    }
    console.log("resetClaimObserverOnDOMChange", target);
    const config = { characterData: true, attributes: false, childList: false, subtree: true };
    let observer = loadObserver(runIfValidUrl);
    console.log("Observing DOM changes... (should be printed once)", target);
    observer.observe(target, config);
}


// Driver
checkDOMChanges();
runIfValidUrl();
