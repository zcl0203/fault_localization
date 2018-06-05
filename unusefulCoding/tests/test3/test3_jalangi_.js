J$.iids = {"9":[3,6,3,10],"17":[3,6,3,10],"25":[3,2,3,11],"33":[4,6,4,7],"41":[4,6,4,7],"49":[4,2,4,8],"57":[5,6,5,7],"65":[5,6,5,7],"73":[5,2,5,8],"81":[6,6,6,7],"89":[6,6,6,7],"97":[6,2,6,8],"105":[7,6,7,7],"113":[7,6,7,7],"121":[7,2,7,8],"129":[9,9,9,10],"137":[9,9,9,10],"145":[9,2,9,11],"153":[1,1,10,2],"161":[1,1,10,2],"169":[1,1,10,2],"177":[1,1,10,2],"185":[1,1,10,2],"193":[13,5,13,9],"201":[13,5,13,9],"209":[13,1,13,10],"217":[14,5,14,15],"225":[14,5,14,17],"233":[14,5,14,17],"241":[14,1,14,18],"249":[15,5,15,6],"257":[15,5,15,6],"265":[15,1,15,7],"273":[16,1,16,2],"281":[16,1,16,6],"283":[16,1,16,4],"289":[16,1,16,7],"297":[1,1,17,1],"305":[1,1,10,2],"313":[1,1,17,1],"321":[1,1,17,1],"329":[1,1,17,1],"337":[1,1,17,1],"345":[1,1,10,2],"353":[1,1,10,2],"361":[1,1,17,1],"369":[1,1,17,1],"nBranches":0,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test3.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test3_jalangi_.js","code":"function createNull() {\n\tvar a, b, c;\n\ta = null;\n\tb = a;\n\ta = 1;\n\tc = a;\n\tc = b;\n\n\treturn c;\n}\n\nvar x, y, z;\nx = null;\nz = createNull();\ny = x;\nz.f();\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(297, '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test3_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/fault_localization/tests/test3/test3.js');
            function createNull() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(153, arguments.callee, this, arguments);
                            arguments = J$.N(161, 'arguments', arguments, 4);
                            J$.N(169, 'a', a, 0);
                            J$.N(177, 'b', b, 0);
                            J$.N(185, 'c', c, 0);
                            var a, b, c;
                            J$.X1(25, a = J$.W(17, 'a', J$.T(9, null, 25, false), a, 0));
                            J$.X1(49, b = J$.W(41, 'b', J$.R(33, 'a', a, 0), b, 0));
                            J$.X1(73, a = J$.W(65, 'a', J$.T(57, 1, 22, false), a, 0));
                            J$.X1(97, c = J$.W(89, 'c', J$.R(81, 'a', a, 0), c, 0));
                            J$.X1(121, c = J$.W(113, 'c', J$.R(105, 'b', b, 0), c, 0));
                            return J$.X1(145, J$.Rt(137, J$.R(129, 'c', c, 0)));
                        } catch (J$e) {
                            J$.Ex(345, J$e);
                        } finally {
                            if (J$.Fr(353))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            createNull = J$.N(313, 'createNull', J$.T(305, createNull, 12, false, 153), 0);
            J$.N(321, 'x', x, 0);
            J$.N(329, 'y', y, 0);
            J$.N(337, 'z', z, 0);
            var x, y, z;
            J$.X1(209, x = J$.W(201, 'x', J$.T(193, null, 25, false), x, 2));
            J$.X1(241, z = J$.W(233, 'z', J$.F(225, J$.R(217, 'createNull', createNull, 1), 0)(), z, 2));
            J$.X1(265, y = J$.W(257, 'y', J$.R(249, 'x', x, 1), y, 2));
            J$.X1(289, J$.M(281, J$.R(273, 'z', z, 1), 'f', 0)());
        } catch (J$e) {
            J$.Ex(361, J$e);
        } finally {
            if (J$.Sr(369)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
