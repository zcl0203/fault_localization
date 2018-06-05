J$.iids = {"9":[1,9,1,13],"17":[1,9,1,13],"25":[1,9,1,13],"33":[2,12,2,13],"41":[2,12,2,13],"49":[2,12,2,13],"57":[3,5,3,6],"65":[3,5,3,6],"73":[3,1,3,7],"81":[4,1,4,2],"89":[4,1,4,4],"97":[4,1,4,5],"105":[1,1,5,1],"113":[1,1,5,1],"121":[1,1,5,1],"129":[1,1,5,1],"137":[1,1,5,1],"145":[1,1,5,1],"nBranches":0,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test2.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test2_jalangi_.js","code":"var c = null;\nvar b, a = c;\nb = a;\nb.f;\n"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(105, '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test2_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test2.js');
            J$.N(113, 'c', c, 0);
            J$.N(121, 'b', b, 0);
            J$.N(129, 'a', a, 0);
            var c = J$.X1(25, J$.W(17, 'c', J$.T(9, null, 25, false), c, 3));
            var b, a = J$.X1(49, J$.W(41, 'a', J$.R(33, 'c', c, 1), a, 3));
            J$.X1(73, b = J$.W(65, 'b', J$.R(57, 'a', a, 1), b, 2));
            J$.X1(97, J$.G(89, J$.R(81, 'b', b, 1), 'f', 0));
        } catch (J$e) {
            J$.Ex(137, J$e);
        } finally {
            if (J$.Sr(145)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
