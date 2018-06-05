J$.iids = {"9":[2,5,2,17],"10":[6,46,6,70],"17":[2,18,2,29],"18":[7,46,7,63],"25":[2,5,2,30],"33":[2,5,2,31],"41":[5,14,5,23],"49":[5,14,5,23],"57":[5,5,5,24],"65":[6,22,6,30],"73":[6,46,6,52],"81":[6,55,6,70],"89":[6,22,6,71],"91":[6,22,6,45],"97":[6,22,6,71],"105":[6,5,6,72],"113":[7,22,7,30],"121":[7,46,7,52],"129":[7,55,7,63],"137":[7,22,7,64],"139":[7,22,7,45],"145":[7,22,7,64],"153":[7,5,7,65],"161":[10,5,10,19],"169":[10,36,10,44],"177":[10,5,10,45],"179":[10,5,10,35],"185":[10,5,10,46],"193":[11,5,11,19],"201":[11,33,11,41],"209":[11,5,11,42],"211":[11,5,11,32],"217":[11,5,11,43],"225":[12,23,12,31],"233":[12,23,12,31],"241":[12,5,12,32],"249":[1,1,13,2],"257":[1,1,13,2],"265":[1,1,13,2],"273":[14,19,14,20],"281":[14,19,14,20],"289":[14,1,14,21],"297":[15,15,15,25],"305":[15,26,15,38],"313":[15,40,15,44],"321":[15,15,15,45],"329":[15,15,15,45],"337":[15,1,15,46],"345":[1,1,16,1],"353":[1,1,13,2],"361":[1,1,16,1],"369":[1,1,13,2],"377":[1,1,13,2],"385":[1,1,16,1],"393":[1,1,16,1],"nBranches":0,"originalCodeFileName":"tmp/test1/test1_orig_.js","instrumentedCodeFileName":"tmp/test1/test1.js","code":"function changeBanner(bannerID) {\n    clearTimeout(changeTimer);\n    // changeTimer = setTimeout(changeBanner, 5000);\n    \n    prefix = \"banner_\";\n    currBannerElem = document.getElementById(prefix + currentBannerID);\n    bannerToChange = document.getElementById(prefix + bannerID);\n    //var a;\n    //a.x(1);\n    currBannerElem.removeClassName(\"active\");\n    bannerToChange.addClassName(\"active\");\n    currentBannerID = bannerID;\n}\ncurrentBannerID = 1;\nchangeTimer = setTimeout(changeBanner, 1000);\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(345, 'tmp/test1/test1.js', 'tmp/test1/test1_orig_.js');
            function changeBanner(bannerID) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(249, arguments.callee, this, arguments);
                            arguments = J$.N(257, 'arguments', arguments, 4);
                            bannerID = J$.N(265, 'bannerID', bannerID, 4);
                            J$.X1(33, J$.F(25, J$.R(9, 'clearTimeout', clearTimeout, 2), 0)(J$.R(17, 'changeTimer', changeTimer, 2)));
                            J$.X1(57, prefix = J$.W(49, 'prefix', J$.T(41, 'banner_', 21, false), J$.I(typeof prefix === 'undefined' ? undefined : prefix), 4));
                            J$.X1(105, currBannerElem = J$.W(97, 'currBannerElem', J$.M(89, J$.R(65, 'document', document, 2), 'getElementById', 0)(J$.B(10, '+', J$.R(73, 'prefix', prefix, 2), J$.R(81, 'currentBannerID', currentBannerID, 2), 0)), J$.I(typeof currBannerElem === 'undefined' ? undefined : currBannerElem), 4));
                            J$.X1(153, bannerToChange = J$.W(145, 'bannerToChange', J$.M(137, J$.R(113, 'document', document, 2), 'getElementById', 0)(J$.B(18, '+', J$.R(121, 'prefix', prefix, 2), J$.R(129, 'bannerID', bannerID, 0), 0)), J$.I(typeof bannerToChange === 'undefined' ? undefined : bannerToChange), 4));
                            J$.X1(185, J$.M(177, J$.R(161, 'currBannerElem', currBannerElem, 2), 'removeClassName', 0)(J$.T(169, 'active', 21, false)));
                            J$.X1(217, J$.M(209, J$.R(193, 'bannerToChange', bannerToChange, 2), 'addClassName', 0)(J$.T(201, 'active', 21, false)));
                            J$.X1(241, currentBannerID = J$.W(233, 'currentBannerID', J$.R(225, 'bannerID', bannerID, 0), J$.I(typeof currentBannerID === 'undefined' ? undefined : currentBannerID), 4));
                        } catch (J$e) {
                            J$.Ex(369, J$e);
                        } finally {
                            if (J$.Fr(377))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            changeBanner = J$.N(361, 'changeBanner', J$.T(353, changeBanner, 12, false, 249), 0);
            J$.X1(289, currentBannerID = J$.W(281, 'currentBannerID', J$.T(273, 1, 22, false), J$.I(typeof currentBannerID === 'undefined' ? undefined : currentBannerID), 4));
            J$.X1(337, changeTimer = J$.W(329, 'changeTimer', J$.F(321, J$.R(297, 'setTimeout', setTimeout, 2), 0)(J$.R(305, 'changeBanner', changeBanner, 1), J$.T(313, 1000, 22, false)), J$.I(typeof changeTimer === 'undefined' ? undefined : changeTimer), 4));
        } catch (J$e) {
            J$.Ex(385, J$e);
        } finally {
            if (J$.Sr(393)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
