function runIfValidUrl() {
    console.log("Running"); // TODO: remove later - should print multiple times if changing screens
    const url = window.location.href;
    if (isValidUrl(url)) {
        runAfterLoading(runObserver);
    } else {
        console.log(url, "is not valid.");
    }
}

function isValidUrl(url) {
    let re = /twitch\.tv\/\w+/;
    return re.test(url);
}

function runAfterLoading(callback) { // TODO: check if element exists?
    if (document.readyState !== "complete") {
        document.addEventListener('readystatechange', event => { 
            if (event.target.readyState === "complete") {
                claimChannelPoints();
                callback();
                console.log("callback called.");
            }
        });
    } else {
        callback();
    }
}

function runObserver() {
    const target = document.querySelector(".community-points-summary > div > .tw-transition");
    console.log(target);
    if (target === undefined || target == null) {
        console.log("Twitch Channel Auto-Clicker: Could not find channel points on this page.");
        return;
    } 
    const config = { attributes: true, childList: true, subtree: true };
    let observer = loadObserver(claimChannelPoints);
    console.log(typeof target, target); // TODO: remove later
    console.log("Observing channel point changes");
    observer.observe(target, config);
}

function loadObserver(callback) {
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

function checkDOMChanges() {
    runAfterLoading(reloadExtensionOnDOMChange);
}

function reloadExtensionOnDOMChange() {
    let target = document.querySelector(".channel-info-content h1"); // Streamer name
    if (target === undefined || target == null) {
        target = document.querySelector(".root");
    }
    console.log(target);
    const config = { characterData: true, attributes: false, childList: false, subtree: true };
    let observer = loadObserver(runIfValidUrl);
    console.log("Observing DOM changes...", target);
    observer.observe(target, config);
}


// Driver
checkDOMChanges();
runIfValidUrl();
