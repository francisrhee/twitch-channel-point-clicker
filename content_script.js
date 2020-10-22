console.log("loaded twitch autoclicker");


function clickClaimButton() {
    document.getElementsByClassName("claimable-bonus__icon")[0].click();
}

function isRewardClaimable() {
    return document.getElementsByClassName("claimable-bonus__icon") !== undefined && document.getElementsByClassName("claimable-bonus__icon").length > 0;
}

function claimChannelPoints() {
    console.log("attempting to claim channel points");
    if (isRewardClaimable()) {
        clickClaimButton();
        console.log("channel points claimed!");
    }
}

const minInMillis = 60 * 1000;
setInterval(claimChannelPoints, minInMillis);
