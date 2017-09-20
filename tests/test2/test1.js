function changeBanner(bannerID) {
    clearTimeout(changeTimer);
    // changeTimer = setTimeout(changeBanner, 5000);
    
    prefix = "banner_";
    currBannerElem = document.getElementById(prefix + currentBannerID);
    bannerToChange = document.getElementById(prefix + bannerID);
    currBannerElem.removeClassName("active");
    bannerToChange.addClassName("active");
    currentBannerID = bannerID;
}
currentBannerID = 1;
changeTimer = setTimeout(changeBanner, 5000);
