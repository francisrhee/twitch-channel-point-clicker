function clickClaimButton() {
    document.getElementsByClassName("claimable-bonus__icon")[0].click();
}

function isRewardClaimable() {
    return document.getElementsByClassName("claimable-bonus__icon") !== undefined && document.getElementsByClassName("claimable-bonus__icon").length > 0;
}

function claimChannelPoints() {
    if (isRewardClaimable()) {
        clickClaimButton();
        console.log("Reward claimed!");
    }
}

function runObserver() {
    const target = document.querySelector(".community-points-summary > div > .tw-transition");    
    const config = { attributes: true, childList: true, subtree: true };
    let observer = loadObserver();
    observer.observe(target, config);
}


function loadObserver() {
    let observer = new MutationObserver(claimChannelPoints);    
    return observer;
}

if (document.readyState !== "complete") {
    document.addEventListener('readystatechange', event => { 
        if (event.target.readyState === "complete") {
            runObserver();
        }
    });
} else {
    runObserver();
}

// const minInMillis = 60 * 1000;
// setInterval(claimChannelPoints, minInMillis);
