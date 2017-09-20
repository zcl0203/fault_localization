J$.iids = {"8":[3,9,3,14],"9":[2,13,2,14],"10":[3,9,3,14],"17":[2,13,2,14],"18":[6,16,6,18],"25":[2,13,2,14],"33":[3,9,3,10],"41":[3,13,3,14],"49":[4,16,4,17],"57":[4,16,4,17],"65":[4,9,4,18],"73":[6,17,6,18],"81":[6,16,6,18],"89":[6,9,6,19],"97":[1,1,8,2],"105":[1,1,8,2],"113":[1,1,8,2],"121":[1,1,8,2],"129":[10,1,10,4],"137":[10,1,10,6],"145":[10,1,10,7],"153":[11,9,11,10],"161":[11,9,11,10],"169":[11,9,11,10],"177":[12,5,12,6],"185":[12,5,12,6],"193":[12,1,12,7],"201":[13,5,13,6],"209":[13,5,13,6],"217":[13,1,13,7],"225":[1,1,15,1],"233":[1,1,8,2],"241":[1,1,15,1],"249":[1,1,15,1],"257":[3,5,7,6],"265":[1,1,8,2],"273":[1,1,8,2],"281":[1,1,15,1],"289":[1,1,15,1],"nBranches":2,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test2/arbitrary1.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test2/arbitrary1_jalangi_.js","code":"function foo(x) {\n    var a = 0;\n    if (x > 0) {\n        return 1;\n    } else {\n        return -1;\n    }\n}\n\nfoo();\nvar a = 0;\nb = 0;\na = 3;\n\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(225, '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test2/arbitrary1_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test2/arbitrary1.js');
            function foo(x) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(97, arguments.callee, this, arguments);
                            arguments = J$.N(105, 'arguments', arguments, 4);
                            x = J$.N(113, 'x', x, 4);
                            J$.N(121, 'a', a, 0);
                            var a = J$.X1(25, J$.W(17, 'a', J$.T(9, 0, 22, false), a, 1));
                            if (J$.X1(257, J$.C(8, J$.B(10, '>', J$.R(33, 'x', x, 0), J$.T(41, 0, 22, false), 0)))) {
                                return J$.X1(65, J$.Rt(57, J$.T(49, 1, 22, false)));
                            } else {
                                return J$.X1(89, J$.Rt(81, J$.U(18, '-', J$.T(73, 1, 22, false))));
                            }
                        } catch (J$e) {
                            J$.Ex(265, J$e);
                        } finally {
                            if (J$.Fr(273))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            foo = J$.N(241, 'foo', J$.T(233, foo, 12, false, 97), 0);
            J$.N(249, 'a', a, 0);
            J$.X1(145, J$.F(137, J$.R(129, 'foo', foo, 1), 0)());
            var a = J$.X1(169, J$.W(161, 'a', J$.T(153, 0, 22, false), a, 3));
            J$.X1(193, b = J$.W(185, 'b', J$.T(177, 0, 22, false), J$.I(typeof b === 'undefined' ? undefined : b), 4));
            J$.X1(217, a = J$.W(209, 'a', J$.T(201, 3, 22, false), a, 2));
        } catch (J$e) {
            J$.Ex(281, J$e);
        } finally {
            if (J$.Sr(289)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
