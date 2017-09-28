J$.iids = {"9":[4,5,4,9],"17":[4,5,4,9],"25":[4,1,4,10],"33":[5,5,5,6],"41":[5,5,5,6],"49":[5,1,5,7],"57":[6,1,6,2],"65":[6,1,6,4],"73":[6,1,6,5],"81":[1,1,6,5],"89":[1,1,6,5],"97":[1,1,6,5],"105":[1,1,6,5],"113":[1,1,6,5],"nBranches":0,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1_jalangi_.js","code":"//b = null; b.f;\n\nvar a, b;\na = null;\nb = a;\nb.f;"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(81, '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test1.js');
            J$.N(89, 'a', a, 0);
            J$.N(97, 'b', b, 0);
            var a, b;
            J$.X1(25, a = J$.W(17, 'a', J$.T(9, null, 25, false), a, 2));
            J$.X1(49, b = J$.W(41, 'b', J$.R(33, 'a', a, 1), b, 2));
            J$.X1(73, J$.G(65, J$.R(57, 'b', b, 1), 'f', 0));
        } catch (J$e) {
            J$.Ex(105, J$e);
        } finally {
            if (J$.Sr(113)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
