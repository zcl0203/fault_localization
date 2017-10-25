J$.iids = {"9":[2,5,2,6],"17":[2,5,2,6],"25":[2,1,2,7],"33":[3,5,3,6],"41":[3,5,3,6],"49":[3,1,3,7],"57":[4,5,4,9],"65":[4,5,4,9],"73":[4,1,4,10],"81":[5,5,5,6],"89":[5,5,5,6],"97":[5,1,5,7],"105":[6,5,6,6],"113":[6,5,6,6],"121":[6,1,6,7],"129":[7,1,7,2],"137":[7,1,7,4],"145":[7,1,7,5],"153":[8,1,8,2],"161":[8,1,8,4],"169":[8,1,8,5],"177":[1,1,14,1],"185":[1,1,14,1],"193":[1,1,14,1],"201":[1,1,14,1],"209":[1,1,14,1],"217":[1,1,14,1],"nBranches":0,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1_jalangi_.js","code":"var a,b,c;\na = 1;\nb = a;\nc = null;\nb = c;\na = b;\nb.f;\na.f;\n\n// var a, b;\n// a = null;\n// b = a;\n// b.f;\n"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(177, '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1.js');
            J$.N(185, 'a', a, 0);
            J$.N(193, 'b', b, 0);
            J$.N(201, 'c', c, 0);
            var a, b, c;
            J$.X1(25, a = J$.W(17, 'a', J$.T(9, 1, 22, false), a, 2));
            J$.X1(49, b = J$.W(41, 'b', J$.R(33, 'a', a, 1), b, 2));
            J$.X1(73, c = J$.W(65, 'c', J$.T(57, null, 25, false), c, 2));
            J$.X1(97, b = J$.W(89, 'b', J$.R(81, 'c', c, 1), b, 2));
            J$.X1(121, a = J$.W(113, 'a', J$.R(105, 'b', b, 1), a, 2));
            J$.X1(145, J$.G(137, J$.R(129, 'b', b, 1), 'f', 0));
            J$.X1(169, J$.G(161, J$.R(153, 'a', a, 1), 'f', 0));
        } catch (J$e) {
            J$.Ex(209, J$e);
        } finally {
            if (J$.Sr(217)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
