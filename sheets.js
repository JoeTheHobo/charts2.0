let keyAccessCharts = decodeAccess(`Key Access Chart																																														
x	BM	SM	SC	SCM	HC	FHC	B1	C1	A1	R1	B2	C2	A2	R2	B3	C3	A3	R3	B4	C4	A4	R4	GU	MC	FONT	SPORT	AV	MECH	SNOW	TRASH	CA	CB	CC	CD	CE	CF	CG	CH	CI	CJ	CK	For These Buildings				
SM	x	x																																								2	19	41	59	83
SC	x	x	x	x																																						3	20	42	60	84
HC	x	x	x		x																																					4	21	43	61	96
FHC	x	x				x																																				5	22	44	62	97
B1	x	x					x																																			6	23	45	63	98
C1	x	x		x			x	x																																		7	24	46	64	99
A1	x	x					x		x																																	8	25	47	66	214
R1	x	x					x			x																																9	26	48	68	216
B2	x	x									x																															10	27	49	69	221
C2	x	x		x							x	x																														11	28	51	71	225
A2	x	x									x		x																													12	29	52	72	234
R2	x	x									x			x																												13	30	53	73	
B3	x	x													x																											14	34	54	74	
C3	x	x		x											x	x																										15	35	55	76	
A3	x	x													x		x																									16	36	56	78	
R3	x	x													x			x																								17	38	57	80	
B4	x	x																	x																							18	40	58	82	
C4	x	x		x															x	x																										
A4	x	x																	x		x																									
R4	x	x																	x			x																								
GU	x	x					x	x			x	x			x	x			x	x			x																							
MC	x	x					x				x				x				x					x																						
FONT	x	x																							x																					
SPORT	x	x																								x																				
AV	x	x		x																							x																			
MECH	x	x																										x																		
SNOW	x	x					x				x				x				x										x																	
TRASH	x	x																												x																
CA	x	x																													x															
CB	x	x																														x														
CC	x	x																															x													
CD	x	x																																x												
CE	x	x																																	x											
CF	x	x																																		x										
CG	x	x																																			x									
CH	x	x																																				x								
CI	x	x																																					x							
CJ	x	x																																						x						
CK	x	x																																							x					`);
let pinningMatrix = decodeMatrix(`NFM	0	1	6	5	8	9		Mac	7							
Stake	Wards			Building											
Stake																
Key Way	C145	C145	C145	C145	C124	C124	C124	C124	C123	C123	C123	C123	C135	C135	C135	C135
Cut	2	4	6	8	2	4	6	8	2	4	6	8	2	4	6	8
Buldings	2	5	8	12	16	23	29	44	51	53	57	62	42	82		
x	3	6	9	13	17	24	30	46	52	54	58	63	43	83		
x	4	7	10	14	18	25	35	47	45	55	59	64	69	84		
x	22	48	11	15	19	26	36	49		56	60	66	70	96		
x	34	72	74	78	20	27	38	99			61	68	73	97		
x	71		76	214	21	28	40					65		98		
x	234				216	80	41									
x					221	225	39									
                                                            
Cuts 2.3	/4		1	3	7	9			Cuts	5/6'	1	3	5	7		
x	3	0	GU		R1				x	2	A	B	C	D		
x	3	2			R2	FONT			x	4	E	F	G	H		
x	3	4	MECH		R3				x	6	I	J	K	L		
x	3	8			R4	SNOW										
x	5	0	FHC		MC											
x	5	2			SC	TRASH										
x	5	4				SPORT										
x	5	8			HC	AV										
x	7	0	A1	B1	C1											
x	7	2	A2	B2	C2											
x	7	4	A3	B3	C3											
x	7	8		B4	C4	A4										
x	9	0	CA	CB	CC	CD										
x	9	2	CE	CF	CG	CH										
x	9	8		CI	CJ	CK										`);
let buildings = decodeBuildings(`Building #	Address	Letter	Stake
2	65 E 100 N, Mona	A	Nephi Utah North Stake
3	345 E 500 N, Nephi	F	Nephi Utah North Stake
4	65 W 800 S, Mona	K	Nephi Utah North Stake
34	1125 N 400 E, Nephi	I	Nephi Utah North Stake
22	773 N 800 E, Nephi	D	Nephi Utah North Stake
5	351 N 100 W, Nephi	E	Nephi Utah Stake
6	222 S 100 E, Nephi	J	Nephi Utah Stake
7	25 N 100 E, Nephi	K	Nephi Utah Stake
48	773 N 800 E, Nephi	B	Nephi Utah Stake
8	151 S 200 W, Fountain Green	C	Moroni Utah Stake
9	82 N Center Street, Moroni	H	Moroni Utah Stake
11	95 S 200 W, Wales	I	Moroni Utah Stake
76	233 N Center, Moroni	L	Moroni Utah Stake
12	164 S Main Street, Spring City	A	Mount Pleasant Utah Stake
13	7655 E 15000 N, Spring City	K	Mount Pleasant Utah Stake
14	295 S State Street , Mt. Pleasant	E	Mount Pleasant Utah Stake
15	49 S State Street, Mt. Pleasant	D	Mount Pleasant Utah Stake
16	461 N 300 W, Mt. Pleasant	B	Mount Pleasant Utah North Stake
17	280 E 700 S, Mt. Pleasant	G	Mount Pleasant Utah North Stake
19	122 S State Street, Fairview	L	Mount Pleasant Utah North Stake
20	131 E 100 N, Fairview	E	Mount Pleasant Utah North Stake
21	8060 E 36500 N, Indianola	J	Mount Pleasant Utah North Stake
23	90 S Center Street, Lemmington	C	Delta Utah Stake
24	35 E Center, Oak City	H	Delta Utah Stake
25	125 White Sage Avenue, Delta	E	Delta Utah Stake
26	197 S 300 W, Delta	J	Delta Utah Stake
28	65 W 300 N, Delta	B	Delta Utah Stake
29	11840 N Riverbottom Rd, Delta	A	Delta Utah West Stake
30	225 W 200 N, Delta	F	Delta Utah West Stake
36	3423 W 4500 S, Delta	K	Delta Utah West Stake
38	188 N Main Street, Hinkly	C	Delta Utah West Stake
39	3120 W 2600 N, Delta	H	Delta Utah West Stake
41	1590 S Snake Valley Road, Trout Creek	G	Delta Utah West Stake
46	90 S 200 E, Santaquin	E	
47	591 Summit Ridge Parkway, Santaquin	J	
49	50 S 500 W, Santaquin	B	
51	260 S 580 E, Santaquin	C	
52	548 S 400 E, Santaquin	H	
53	345 W 100 N, Santaquin	A	
55	545 N 200 E, Santaquin	F	
56	860 N 350 W, Santaquin	K	
57	482 W 1400 S, Payson	D	
58	12625 S Spring Lake Road, Payson	G	
60	1080 S 930 W, Payson	J	
61	952 S 1580 S, Payson	B	
65	12800 W 16300 S, Elberta	A	
66	50 N Main Street, Genola	J	
67	75 S Center Street, Goshen	C	
68	70 E Main, Eureka	L	`);


let order = decodeOrder(`SCM	1	Stake Keys
SC	1	Stake Keys
HC	1	Stake Keys
FHC	1	Stake Keys
B1	2	Bishop Keys
B2	2	Bishop Keys
B3	2	Bishop Keys
B4	2	Bishop Keys
C1	3	Clerk Keys
C2	3	Clerk Keys
C3	3	Clerk Keys
C4	3	Clerk Keys
A1	4	Auxilary Keys
A2	4	Auxilary Keys
A3	4	Auxilary Keys
A4	4	Auxilary Keys
R1	5	Relief Society Keys
R2	5	Relief Society Keys
R3	5	Relief Society Keys
R4	5	Relief Society Keys
GU	6	Miscellaneous Keys
MC	6	Miscellaneous Keys
FONT	6	Miscellaneous Keys
SPORT	6	Miscellaneous Keys
AV	6	Miscellaneous Keys
MECH	6	Miscellaneous Keys
SNOW	6	Miscellaneous Keys
TRASH	6	Miscellaneous Keys
CA	7	Closet Keys
CB	7	Closet Keys
CC	7	Closet Keys
CD	7	Closet Keys
CE	7	Closet Keys
CF	7	Closet Keys
CG	7	Closet Keys
CH	7	Closet Keys
CI	7	Closet Keys
CJ	7	Closet Keys
CK	7	Closet Keys`)