J$.iids = {"9":[20,10,20,17],"10":[22,13,22,25],"17":[20,18,20,22],"18":[23,13,23,29],"25":[20,10,20,23],"26":[24,13,24,28],"33":[20,10,20,23],"34":[27,17,27,32],"41":[20,10,20,23],"49":[22,1,22,8],"57":[22,13,22,20],"65":[22,21,22,25],"73":[22,1,22,26],"75":[22,1,22,12],"81":[22,1,22,27],"89":[23,1,23,8],"97":[23,13,23,22],"105":[23,23,23,29],"113":[23,1,23,30],"115":[23,1,23,12],"121":[23,1,23,31],"129":[24,1,24,8],"137":[24,13,24,17],"145":[24,22,24,28],"153":[24,1,24,29],"155":[24,1,24,12],"161":[24,1,24,30],"169":[27,5,27,12],"177":[27,17,27,28],"185":[27,29,27,32],"193":[27,5,27,33],"195":[27,5,27,16],"201":[27,5,27,34],"209":[29,5,29,8],"217":[29,9,29,15],"225":[29,19,29,23],"233":[29,5,29,23],"241":[29,5,29,24],"249":[30,5,30,8],"257":[30,9,30,15],"265":[30,5,30,16],"273":[30,17,30,23],"281":[30,27,30,28],"289":[30,5,30,28],"297":[30,5,30,29],"305":[31,5,31,12],"313":[31,17,31,20],"321":[31,21,31,27],"329":[31,17,31,28],"337":[31,29,31,35],"345":[31,17,31,36],"353":[31,5,31,37],"355":[31,5,31,16],"361":[31,5,31,38],"369":[26,1,32,2],"377":[26,1,32,2],"385":[26,1,32,2],"393":[35,5,35,8],"401":[35,9,35,13],"409":[35,5,35,14],"417":[35,5,35,15],"425":[34,1,36,2],"433":[34,1,36,2],"441":[37,9,37,10],"449":[37,9,37,10],"457":[37,9,37,10],"465":[38,5,38,6],"473":[38,5,38,6],"481":[38,1,38,7],"489":[41,1,41,4],"497":[41,1,41,6],"505":[41,1,41,7],"513":[42,9,42,10],"521":[42,9,42,10],"529":[42,9,42,10],"537":[1,1,43,1],"545":[1,1,43,1],"553":[26,1,32,2],"561":[1,1,43,1],"569":[34,1,36,2],"577":[1,1,43,1],"585":[1,1,43,1],"593":[1,1,43,1],"601":[26,1,32,2],"609":[26,1,32,2],"617":[34,1,36,2],"625":[34,1,36,2],"633":[1,1,43,1],"641":[1,1,43,1],"nBranches":0,"originalCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/flexp/addedbenchmark/a.js","instrumentedCodeFileName":"/home/aiyanxu/experiment/jalangi2-new/flexp/addedbenchmark/a_jalangi_.js","code":"/*\n * Copyright 2013 Samsung Information Systems America, Inc.\n * \n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n * \n *        http://www.apache.org/licenses/LICENSE-2.0\n * \n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n// Author: Koushik Sen\n\n\nvar fs = require('fs');\n\nconsole.log(\"this \"+this);\nconsole.log(\"global \"+global);\nconsole.log(this === global);\n\nfunction bar(val) {\n    console.log(\"val this \"+val);\n    // val[\"*J$*\"] = {};\n    val[\"*J$*\"] = null;\n    val[\"*J$*\"][\"*J$*\"] = 1;\n    console.log(val[\"*J$*\"][\"*J$*\"]);\n}\n\nfunction foo() {\n    bar(this);\n}\nvar x = 2;\ny = 3;\n\n\nfoo();\nvar w = 5;\n"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(537, '/home/aiyanxu/experiment/jalangi2-new/flexp/addedbenchmark/a_jalangi_.js', '/home/aiyanxu/experiment/jalangi2-new/flexp/addedbenchmark/a.js');
            function bar(val) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(369, arguments.callee, this, arguments);
                            arguments = J$.N(377, 'arguments', arguments, 4);
                            val = J$.N(385, 'val', val, 4);
                            J$.X1(201, J$.M(193, J$.R(169, 'console', console, 2), 'log', 0)(J$.B(34, '+', J$.T(177, 'val this ', 21, false), J$.R(185, 'val', val, 0), 0)));
                            J$.X1(241, J$.P(233, J$.R(209, 'val', val, 0), J$.T(217, '*J$*', 21, false), J$.T(225, null, 25, false), 2));
                            J$.X1(297, J$.P(289, J$.G(265, J$.R(249, 'val', val, 0), J$.T(257, '*J$*', 21, false), 4), J$.T(273, '*J$*', 21, false), J$.T(281, 1, 22, false), 2));
                            J$.X1(361, J$.M(353, J$.R(305, 'console', console, 2), 'log', 0)(J$.G(345, J$.G(329, J$.R(313, 'val', val, 0), J$.T(321, '*J$*', 21, false), 4), J$.T(337, '*J$*', 21, false), 4)));
                        } catch (J$e) {
                            J$.Ex(601, J$e);
                        } finally {
                            if (J$.Fr(609))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function foo() {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(425, arguments.callee, this, arguments);
                            arguments = J$.N(433, 'arguments', arguments, 4);
                            J$.X1(417, J$.F(409, J$.R(393, 'bar', bar, 1), 0)(J$.R(401, 'this', this, 0)));
                        } catch (J$e) {
                            J$.Ex(617, J$e);
                        } finally {
                            if (J$.Fr(625))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(545, 'fs', fs, 0);
            bar = J$.N(561, 'bar', J$.T(553, bar, 12, false, 369), 0);
            foo = J$.N(577, 'foo', J$.T(569, foo, 12, false, 425), 0);
            J$.N(585, 'x', x, 0);
            J$.N(593, 'w', w, 0);
            var fs = J$.X1(41, J$.W(33, 'fs', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, 'fs', 21, false)), fs, 3));
            J$.X1(81, J$.M(73, J$.R(49, 'console', console, 2), 'log', 0)(J$.B(10, '+', J$.T(57, 'this ', 21, false), J$.R(65, 'this', this, 0), 0)));
            J$.X1(121, J$.M(113, J$.R(89, 'console', console, 2), 'log', 0)(J$.B(18, '+', J$.T(97, 'global ', 21, false), J$.R(105, 'global', global, 2), 0)));
            J$.X1(161, J$.M(153, J$.R(129, 'console', console, 2), 'log', 0)(J$.B(26, '===', J$.R(137, 'this', this, 0), J$.R(145, 'global', global, 2), 0)));
            var x = J$.X1(457, J$.W(449, 'x', J$.T(441, 2, 22, false), x, 3));
            J$.X1(481, y = J$.W(473, 'y', J$.T(465, 3, 22, false), J$.I(typeof y === 'undefined' ? undefined : y), 4));
            J$.X1(505, J$.F(497, J$.R(489, 'foo', foo, 1), 0)());
            var w = J$.X1(529, J$.W(521, 'w', J$.T(513, 5, 22, false), w, 3));
        } catch (J$e) {
            J$.Ex(633, J$e);
        } finally {
            if (J$.Sr(641)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
