console.log("Loaded Twitch Channel Points Auto-Clicker");

function clickClaimButton() {
    document.getElementsByClassName("claimable-bonus__icon")[0].click();
}

function isRewardClaimable() {
    return document.getElementsByClassName("claimable-bonus__icon") !== undefined && document.getElementsByClassName("claimable-bonus__icon").length > 0;
}

function claimChannelPoints() {
    if (isRewardClaimable()) {
        clickClaimButton();
    }
}

const minInMillis = 60 * 1000;
setInterval(claimChannelPoints, minInMillis);
