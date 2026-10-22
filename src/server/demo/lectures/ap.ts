import type { DemoLecture } from "./types";

/** Araling Panlipunan 10 lectures, keyed by lesson title (see grade10.ts). */
export const AP_LECTURES: Record<string, DemoLecture> = {
  "Climate Change": {
    videoId: "wB779oYCUA0",
    lecture: `## Ano ang climate change?
Ang **climate change** ay ang **pangmatagalang pagbabago** ng temperatura at ng mga padron ng panahon sa mundo. Iba ito sa *weather*, na pang-araw-araw na kalagayan ng atmospera.

## Sanhi: ang greenhouse effect
- Ang mga **greenhouse gas** — **carbon dioxide (CO₂), methane at nitrous oxide** — ay kumukulong ng init sa atmospera.
- Natural ito at kailangan, ngunit dumami ang mga gas na ito dahil sa gawain ng tao:
  - **Pagsusunog ng fossil fuels** (uling, langis, gas) sa mga planta, sasakyan at pabrika
  - **Pagputol ng mga puno** (deforestation)
  - **Agrikultura** at mga tambakan ng basura na naglalabas ng methane

## Epekto sa Pilipinas
- **Mas malalakas na bagyo** — tulad ng **Yolanda (Haiyan)** noong 2013
- **Pagtaas ng lebel ng dagat** na nagbabanta sa mga baybaying pamayanan
- **Matinding init at El Niño** na nagdudulot ng tagtuyot at pinsala sa ani
- **Pagkasira ng coral reefs** at pagbaba ng huli ng mga mangingisda
- Paglaganap ng sakit tulad ng **dengue**

## Mga tugon
- **Mitigation** — pagbabawas ng greenhouse gases: renewable energy (solar, hangin, geothermal), pagtatanim ng puno, pagtitipid sa kuryente
- **Adaptation** — pag-angkop: matitibay na gusali, early warning system, climate-resilient na pananim
- **Climate Change Act of 2009 (RA 9729)** at ang pakikilahok ng bansa sa **Paris Agreement**

## Tandaan
Kahit maliit ang ambag ng Pilipinas sa greenhouse gases, isa ito sa **pinakananganganib** na bansa sa epekto ng climate change.`,
  },

  "Suliranin sa Solid Waste": {
    videoId: "dnzaCaM0XnA",
    lecture: `## Ano ang solid waste?
Ang **solid waste** ay mga **basurang nagmumula sa tahanan, paaralan, pamilihan, opisina at industriya** — papel, plastik, tira-tirang pagkain, bote at iba pa. Ayon sa mga pag-aaral, mahigit **kalahati** ng basura sa bansa ay nagmumula sa mga **tahanan**.

## Mga suliranin
- **Pagbaha** — nababarahan ng plastik ang mga kanal at estero
- **Polusyon** sa lupa, tubig at hangin, lalo na kapag sinusunog ang basura
- **Sakit** — dumarami ang daga, langaw at lamok
- **Plastik sa dagat** — ang Pilipinas ay isa sa mga bansang may pinakamaraming plastik na napupunta sa karagatan
- Nangyari ang **trahedya sa Payatas** noong 2000, nang gumuho ang bundok ng basura at maraming nasawi

## Ecological Solid Waste Management Act (RA 9003)
Ipinasa noong **2000**. Itinatakda nito ang:
- **Paghihiwalay ng basura** sa pinagmulan: nabubulok, di-nabubulok, recyclable at special waste
- Pagkakaroon ng **Materials Recovery Facility (MRF)** sa bawat barangay
- **Pagbabawal sa open dumpsite** at sa pagsusunog ng basura
- Paglipat sa **sanitary landfill**

## Ang 3Rs
- **Reduce** — bawasan ang paggamit ng mga bagay na nagiging basura
- **Reuse** — gamitin muli ang mga bagay
- **Recycle** — gawing bagong produkto ang lumang materyales

## Tandaan
Nagsisimula ang solusyon sa **bawat tahanan**: magdala ng eco-bag, iwasan ang single-use plastic at ihiwalay ang basura.`,
  },

  "Mga Uri ng Kalamidad": {
    videoId: "r2dEWEhiiAw",
    lecture: `## Mahahalagang konsepto
- **Hazard** — banta na maaaring magdulot ng pinsala (bagyo, lindol)
- **Disaster o kalamidad** — pangyayaring nagdudulot ng malawakang pinsala sa buhay at ari-arian
- **Vulnerability** — kahinaan ng tao o pamayanan na harapin ang hazard
- **Capacity** — kakayahan ng pamayanan na makaiwas at makabangon
- **Risk** — posibilidad na magdulot ng pinsala ang hazard

## Bakit madalas tamaan ang Pilipinas?
- Nasa **Pacific Ring of Fire** — madalas ang lindol at pagputok ng bulkan
- Nasa **typhoon belt** — mga **20 bagyo** ang pumapasok taon-taon
- Isang **kapuluan** — maraming baybaying madaling tamaan ng storm surge at tsunami

## Uri ng kalamidad
**Likas (natural)**
- Bagyo, storm surge at baha
- Lindol at tsunami
- Pagputok ng bulkan (Mayon, Taal, Pinatubo)
- Landslide
- El Niño (tagtuyot) at La Niña (labis na ulan)

**Gawa ng tao (human-induced)**
- Sunog
- Polusyon at oil spill
- Pagkasira ng kagubatan na nagpapalala ng baha at landslide

## Mga ahensiyang tumutulong
- **PAGASA** — bagyo at panahon
- **PHIVOLCS** — lindol at bulkan
- **NDRRMC** — pangunahing tagapag-ugnay sa pagtugon sa kalamidad

## Tandaan
Hindi mapipigilan ang hazard, ngunit maiiwasan na ito ay maging **kalamidad** kung handa ang pamayanan.`,
  },

  "Community-Based DRRM": {
    videoId: "Bgu1cCsQ0wo",
    lecture: `## RA 10121
Ang **Philippine Disaster Risk Reduction and Management Act of 2010 (RA 10121)** ay naglipat ng pokus mula sa **pagtugon pagkatapos** ng kalamidad tungo sa **paghahanda at pagbabawas ng panganib bago** ito mangyari. Itinatag nito ang **NDRRMC** at ang mga DRRM office sa bawat lalawigan, lungsod, bayan at barangay.

## Ano ang CBDRRM?
Ang **Community-Based Disaster Risk Reduction and Management** ay paraan kung saan ang **mamamayan mismo** ang aktibong kasangkot sa pagtukoy, pagsusuri at paglutas ng mga panganib sa kanilang pamayanan. Sila ang **unang tumutugon** at pinakakilala ang kanilang lugar.

## Apat na yugto ng DRRM plan
**1. Disaster Prevention and Mitigation**
- **Hazard assessment** — anong banta ang maaaring tumama
- **Vulnerability at capacity assessment** — sino ang mahina, ano ang kakayahan
- **Hazard mapping** — pagmamarka ng mapanganib at ligtas na lugar

**2. Disaster Preparedness**
- **Early warning system**
- **Evacuation plan** at mga drill
- Paghahanda ng **emergency go-bag**: tubig, pagkain, gamot, flashlight, radyo, mahahalagang dokumento

**3. Disaster Response**
- Paglikas, paghahanap at pagsagip (search and rescue)
- Pamamahagi ng relief goods at pangunang lunas

**4. Disaster Rehabilitation and Recovery**
- Pagsasaayos ng mga bahay, kalsada at serbisyo
- Pagbabalik ng kabuhayan — **"build back better"**

## Tandaan
Bilang mag-aaral, makilahok sa mga **earthquake at fire drill**, alamin ang evacuation route ng paaralan at ng barangay, at sundin ang babala ng PAGASA at PHIVOLCS.`,
  },

  "Konsepto ng Globalisasyon": {
    videoId: "lSk-AH5_gd0",
    lecture: `## Ano ang globalisasyon?
Ang **globalisasyon** ay ang proseso ng **mabilis na pagdaloy o paggalaw** ng **tao, produkto, serbisyo, impormasyon, ideya at kapital** sa iba't ibang bahagi ng daigdig. Dahil dito, nagiging magkakaugnay at magkakadepende ang mga bansa.

## Mga dahilan ng globalisasyon
- **Teknolohiya at komunikasyon** — internet, cellphone at social media
- **Transportasyon** — mabilis na eroplano at malalaking barkong pangkargamento
- **Kalakalan** — mga kasunduang tulad ng **World Trade Organization (WTO)** at **ASEAN Free Trade Area**
- **Multinational at transnational corporations** — mga kompanyang may operasyon sa maraming bansa

## Mga dimensyon ng globalisasyon
- **Ekonomiko** — kalakalan, pamumuhunan, outsourcing (hal. mga BPO o call center sa Pilipinas)
- **Teknolohikal** — mabilis na pagkalat ng gadget at impormasyon
- **Sosyo-kultural** — pagkalat ng musika, pelikula, pagkain at fashion (K-pop, Hollywood, fast food)
- **Politikal** — ugnayan ng mga bansa sa mga samahang tulad ng **United Nations** at **ASEAN**

## Iba't ibang pananaw sa pinagmulan nito
May nagsasabing ito ay **likas** sa tao (ang pagnanais na makipagkalakalan), may nagsasabing nagsimula ito sa **paglalayag at kolonyalismo**, at may nagsasabing ito ay produkto ng **makabagong teknolohiya** pagkatapos ng Ikalawang Digmaang Pandaigdig.

## Tandaan
Halos lahat ng gamit natin araw-araw — cellphone, damit, pagkain — ay may bahaging galing sa ibang bansa. Iyan ang globalisasyon.`,
  },

  "Epekto ng Globalisasyon": {
    videoId: "BCkoRoIFA4g",
    lecture: `## Mabuting epekto
- **Mas maraming trabaho** — lalo na sa **BPO o call center** industry, isa sa pinakamalaking pinagkakakitaan ng bansa
- **Mas maraming produkto** at mas abot-kayang presyo dahil sa kompetisyon
- **Pagpasok ng dayuhang pamumuhunan** (foreign investment)
- **Mabilis na access sa impormasyon** at edukasyon (online learning)
- **Pagpapalitan ng kultura** at mas malawak na pananaw

## Di-mabuting epekto
- **Kompetisyon sa lokal na industriya** — nahihirapan ang maliliit na negosyo at magsasaka laban sa murang imported na produkto
- **Kontraktuwalisasyon** at mababang pasahod sa ilang kompanya
- **Brain drain** — pag-alis ng mga propesyonal patungong ibang bansa
- **Pagkawala o paghina ng sariling kultura**
- **Pagkasira ng kapaligiran** dahil sa labis na produksiyon at konsumo
- **Paglaki ng agwat** ng mayaman at mahirap

## Mga tugon sa hamon ng globalisasyon
- **Guarded globalization** — pagprotekta ng pamahalaan sa lokal na industriya sa pamamagitan ng taripa at subsidiya
- **Fair trade** — makatarungang presyo para sa mga magsasaka at manggagawa
- **Pagtangkilik sa sariling produkto** — "Buy Local"
- Pagpapalakas ng **edukasyon at kasanayan** upang makipagsabayan

## Tandaan
Ang globalisasyon ay may **dalawang mukha**. Ang hamon ay kung paano makikinabang ang bansa habang pinoprotektahan ang mga manggagawa, kultura at kapaligiran.`,
  },

  "Mga Isyu sa Paggawa": {
    videoId: "2bLKUwP5T3w",
    lecture: `## Ang manggagawang Pilipino
Ang mga manggagawa ang **nagpapatakbo ng ekonomiya**. Gayunman, maraming isyu ang kinakaharap nila, lalo na sa panahon ng globalisasyon.

## Mga pangunahing isyu
**Kontraktuwalisasyon ("endo")**
- Pagkuha ng manggagawa sa loob lamang ng **limang buwan** upang hindi sila maging regular
- Walang **seguridad sa trabaho** at kulang ang benepisyo (SSS, PhilHealth, Pag-IBIG)

**Mababang pasahod**
- Maraming sahod ang **hindi sapat** para sa pang-araw-araw na pangangailangan ng pamilya

**Unemployment at underemployment**
- **Unemployment** — walang trabaho kahit naghahanap
- **Underemployment** — may trabaho ngunit kulang ang oras o hindi tugma sa natapos na kurso
- **Job mismatch** — ang kurso ng mga nagtapos ay hindi tugma sa trabahong kailangan

**Mapanganib na kalagayan sa trabaho**
- Kawalan ng kaligtasan sa pabrika, konstruksiyon at minahan

**Child labor**
- Mga batang nagtatrabaho sa halip na nag-aaral

## Mga batas at tugon
- **Labor Code of the Philippines** — nagtatakda ng karapatan ng manggagawa
- **Karapatang mag-organisa ng unyon** at makipagkasundo sa employer
- **DOLE** — ahensiyang nangangalaga sa kapakanan ng mga manggagawa
- **TESDA** — nagbibigay ng technical-vocational na pagsasanay

## Tandaan
Ang **disenteng trabaho** ay may sapat na sahod, kaligtasan, seguridad at paggalang sa karapatan ng manggagawa.`,
  },

  Migrasyon: {
    videoId: "uy4hSAZUDgI",
    lecture: `## Ano ang migrasyon?
Ang **migrasyon** ay ang **paglipat ng tao** mula sa isang lugar patungo sa iba upang doon manirahan nang pansamantala o permanente.
- **Internal migration** — sa loob ng bansa (hal. mula probinsya patungong Maynila)
- **International migration** — patungo sa ibang bansa

## Bakit nangingibang-bansa ang mga Pilipino?
**Push factors** (nagtutulak palabas)
- Kakulangan ng trabaho at mababang sahod
- Kahirapan
- Kalamidad at kaguluhan

**Pull factors** (humihila papunta)
- Mas mataas na sahod
- Mas magandang oportunidad at kalagayan ng pamumuhay
- Pagsama sa pamilyang nasa ibang bansa

## Mga OFW
Milyon-milyong **Overseas Filipino Workers (OFW)** ang nagtatrabaho sa Middle East, Asya, Europa at Amerika bilang nars, seaman, engineer, caregiver at iba pa. Tinatawag silang **"bagong bayani."**

## Mabuting epekto
- **Remittances** — malaking tulong sa ekonomiya at sa pamilya
- Paglago ng kasanayan at karanasan

## Di-mabuting epekto
- **Brain drain** — pag-alis ng mga mahuhusay na propesyonal, lalo na ng mga nars at doktor
- **Pagkakawatak-watak ng pamilya** — epekto sa mga anak na lumalaki nang malayo sa magulang
- **Pang-aabuso** at illegal recruitment sa ibang bansa

## Proteksiyon ng pamahalaan
- **Department of Migrant Workers (DMW)** at **OWWA**
- **Migrant Workers Act (RA 8042)**

## Tandaan
Ang migrasyon ay may kapalit — ang hamon ay lumikha ng sapat na oportunidad dito sa bansa.`,
  },

  "Kasarian at Sekswalidad": {
    videoId: "5x_8jvZNmuY",
    lecture: `## Sex at gender
- **Sex** — tumutukoy sa **biyolohikal** na katangian ng tao (babae o lalaki), tulad ng reproductive organs at hormones.
- **Gender** — tumutukoy sa mga **papel, gawain at katangiang itinakda ng lipunan** para sa babae at lalaki. Ito ay **natututuhan** at maaaring magbago ayon sa kultura at panahon.

## Gender roles
Ang **gender roles** ay mga inaasahang gawain ng lipunan. Halimbawa, noong unang panahon inaasahang nasa bahay ang babae at naghahanapbuhay ang lalaki. Ngayon, nagbabago na ito — may mga babaeng pinuno at mga lalaking nag-aalaga ng anak.

## SOGIE
- **Sexual Orientation** — kung kanino nakararamdam ng atraksiyon ang isang tao
- **Gender Identity** — ang malalim na pakiramdam ng tao tungkol sa sariling kasarian
- **Gender Expression** — paraan ng pagpapakita ng kasarian sa pananamit, kilos at pananalita

Lahat ng tao ay may SOGIE.

## Kasaysayan ng gender roles sa Pilipinas
- **Bago dumating ang Espanyol** — mataas ang pagtingin sa kababaihan; may mga **babaylan** na pinuno sa relihiyon.
- **Panahon ng Espanyol** — limitado ang papel ng babae sa tahanan at simbahan.
- **Panahon ng Amerikano** — nagkaroon ng edukasyon ang kababaihan; nakaboto sila noong **1937**.
- **Kasalukuyan** — may mga babaeng naging pangulo at mataas na opisyal.

## Tandaan
Ang pag-unawa sa kasarian ay daan sa **paggalang** sa bawat tao, anuman ang kaniyang kasarian.`,
  },

  "Diskriminasyon at Karahasan": {
    videoId: "tHDMQQA7-9E",
    lecture: `## Diskriminasyon
Ang **diskriminasyon** ay ang **di-pantay na pagtrato** sa tao dahil sa kaniyang kasarian, edad, lahi, relihiyon o iba pang katangian. Halimbawa: hindi pagtanggap sa trabaho dahil babae, o pambu-bully dahil sa SOGIE.

## Karahasan
Maaaring maranasan ng **kababaihan, kalalakihan at LGBTQIA+** ang karahasan:
- **Pisikal** — pananakit
- **Sekswal** — panggagahasa, panliligalig
- **Sikolohikal o emosyonal** — pananakot, pang-iinsulto
- **Ekonomiko** — pagkontrol sa pera o pagbabawal magtrabaho

Ilang halimbawa sa mundo: **foot binding** sa sinaunang China, **breast ironing** sa Africa, at **female genital mutilation**.

## Mga batas sa Pilipinas
- **Magna Carta of Women (RA 9710)** — nagtatanggol sa karapatan ng kababaihan laban sa diskriminasyon
- **Anti-Violence Against Women and Their Children Act (RA 9262)**
- **Safe Spaces Act (RA 11313)** o "Bawal Bastos Law" — laban sa panliligalig sa kalsada, pampublikong lugar, online at sa trabaho o paaralan
- **Anti-Sexual Harassment Act (RA 7877)**
- Ilang lungsod ang may **anti-discrimination ordinance** para sa LGBTQIA+

## Pandaigdigang tugon
- **CEDAW** — kasunduan ng United Nations laban sa diskriminasyon sa kababaihan
- **Yogyakarta Principles** — karapatang pantao kaugnay ng SOGIE

## Tandaan
Kung makaranas o makasaksi ng karahasan, **magsumbong** sa magulang, guro, guidance counselor, barangay o **PNP Women and Children Protection Desk**.`,
  },

  "Ang Universal Declaration of Human Rights": {
    videoId: "WF822eDVwaM",
    lecture: `## Ano ang karapatang pantao?
Ang **karapatang pantao** ay mga karapatang taglay ng **bawat tao dahil siya ay tao** — anuman ang lahi, kasarian, relihiyon o katayuan sa buhay. Ang mga ito ay **likas, hindi maaaring alisin at pantay-pantay** para sa lahat.

## Kasaysayan
- **Cyrus Cylinder** (539 BCE) — itinuturing na unang tala ng karapatang pantao; pinalaya ni Cyrus the Great ang mga alipin
- **Magna Carta** (1215, England) — nilimitahan ang kapangyarihan ng hari
- **Declaration of the Rights of Man** (1789, France)
- Pagkatapos ng **Ikalawang Digmaang Pandaigdig**, itinatag ang **United Nations**

## Ang UDHR
Pinagtibay ng UN General Assembly noong **Disyembre 10, 1948** — kaya ito ang **Human Rights Day**. Pinamunuan ni **Eleanor Roosevelt** ang komisyong bumuo nito. May **30 artikulo**.

## Uri ng karapatan
- **Karapatang sibil** — buhay, kalayaan, pantay na pagtrato sa batas, kalayaan sa pagkaalipin at tortyur
- **Karapatang pulitikal** — bumoto at makilahok sa pamahalaan
- **Karapatang panlipunan, pang-ekonomiya at pangkultura** — **edukasyon**, trabaho, sapat na pamumuhay, kalusugan at pakikilahok sa kultura

## Kaugnayan sa Pilipinas
- Kasapi ang Pilipinas sa UN at lumagda sa UDHR.
- Ang **Commission on Human Rights (CHR)** ang nagbabantay sa paggalang sa mga karapatang ito.

## Tandaan
Kasama ng karapatan ang **tungkulin** — igalang ang karapatan ng iba.`,
  },

  "Bill of Rights": {
    videoId: "GYKMKsPKkYo",
    lecture: `## Ano ang Bill of Rights?
Ang **Bill of Rights** ay ang **Artikulo III** ng **Saligang Batas ng 1987**. Binubuo ito ng **22 seksiyon** na nagtatanggol sa mga mamamayan laban sa **pang-aabuso ng pamahalaan**.

## Mahahalagang seksiyon
- **Seksiyon 1** — Walang tao ang aalisan ng **buhay, kalayaan o ari-arian** nang walang **due process**, at walang ipagkakait na **pantay na proteksiyon ng batas**.
- **Seksiyon 2** — Proteksiyon laban sa **di-makatwirang paghahalughog at pagdakip**; kailangan ng **warrant** na inilabas ng hukom.
- **Seksiyon 3** — **Privacy** ng komunikasyon at sulat.
- **Seksiyon 4** — **Kalayaan sa pananalita, pamamahayag** at mapayapang pagtitipon.
- **Seksiyon 5** — **Kalayaan sa relihiyon**.
- **Seksiyon 6** — Kalayaan sa **paninirahan at paglalakbay**.
- **Seksiyon 7** — Karapatan sa **impormasyon** tungkol sa gawain ng pamahalaan.
- **Seksiyon 8** — Karapatang bumuo ng mga **samahan at unyon**.
- **Seksiyon 12** — **Miranda rights**: karapatang **manahimik** at magkaroon ng **abogado** kapag inimbestigahan.
- **Seksiyon 14** — Ang akusado ay **itinuturing na walang sala hangga't hindi napapatunayan**.
- **Seksiyon 19** — Bawal ang **malupit at di-makataong parusa**.
- **Seksiyon 21** — Walang **double jeopardy**: hindi maaaring litisin nang dalawang beses sa iisang kaso.

## Uri ng karapatan sa Saligang Batas
- **Natural** — likas sa tao (mabuhay, magmahal)
- **Constitutional** — nakasaad sa Saligang Batas
- **Statutory** — ibinigay ng batas na ipinasa ng Kongreso (hal. minimum wage)

## Tandaan
Ang pagkilala sa sariling karapatan ay unang hakbang sa pagtatanggol nito.`,
  },

  "Konsepto ng Pagkamamamayan": {
    videoId: "WmzpSv1shQg",
    lecture: `## Ano ang pagkamamamayan?
Ang **pagkamamamayan** (citizenship) ay ang **katayuan ng isang tao bilang kasapi ng isang estado**, na may kaakibat na **karapatan at tungkulin**. Nagmula ang konsepto sa sinaunang **Greece**, kung saan ang mamamayan ay kasapi ng **polis** (lungsod-estado).

## Sino ang mamamayang Pilipino? (Artikulo IV, Saligang Batas 1987)
- Mga mamamayan na noong pinagtibay ang Saligang Batas
- Mga **anak ng ama o ina na Pilipino**
- Mga isinilang bago Enero 17, 1973 sa inang Pilipino at pumili ng pagkamamamayang Pilipino pagdating sa hustong gulang
- Mga **naturalisado** ayon sa batas

## Mga prinsipyo ng pagkamamamayan
- **Jus sanguinis** ("karapatan ng dugo") — ang pagkamamamayan ay batay sa **magulang**. **Ito ang sinusunod ng Pilipinas.**
- **Jus soli** ("karapatan ng lupa") — batay sa **lugar ng kapanganakan**. Sinusunod ng Estados Unidos.

## Naturalisasyon
Proseso kung saan ang dayuhan ay nagiging mamamayan sa pamamagitan ng batas, kung natutugunan ang mga kuwalipikasyon (edad, tagal ng paninirahan, mabuting asal, pag-alam sa wika).

## Pagkawala at pagbawi ng pagkamamamayan
Maaaring mawala ang pagkamamamayan kapag **na-naturalisa sa ibang bansa**, tinalikuran ito, o naglingkod sa sandatahang lakas ng ibang bansa. Sa ilalim ng **RA 9225 (Dual Citizenship Act)**, maaari itong **mabawi** ng mga dating Pilipino.

## Tandaan
Ang pagkamamamayan ay hindi lamang legal na katayuan — ito ay **pakikilahok** sa ikabubuti ng bayan.`,
  },

  "Aktibong Mamamayan": {
    videoId: "bsZiIz8vNmQ",
    lecture: `## Dalawang pananaw sa pagkamamamayan
- **Legal** — ang mamamayan ay may karapatan at tungkuling itinakda ng batas.
- **Lumawak na pananaw** — ang mamamayan ay **aktibong nakikilahok** sa paglutas ng mga isyu ng lipunan at pamayanan.

## Katangian ng aktibong mamamayan
- **Makabayan** — nagmamahal at nagmamalasakit sa bayan
- **Makatao** — gumagalang sa karapatan ng kapwa
- **Produktibo** — nagtatrabaho at nag-aambag sa ekonomiya
- **Matatag at may pananagutan** — tumutupad sa tungkulin
- **Makadiyos** — may matibay na pagpapahalaga
- **Kritikal mag-isip** — sinusuri ang impormasyon bago maniwala
- **Nakikilahok** — hindi nananatiling tagamasid lamang

## Mga tungkulin ng mamamayan
- **Pagsunod sa batas**
- **Pagbabayad ng buwis**
- **Matalinong pagboto**
- **Paggalang sa watawat** at sa mga simbolo ng bansa
- **Pangangalaga sa kalikasan**
- **Pagtulong sa kapwa**, lalo na sa panahon ng kalamidad

## Halimbawa ng aktibong pakikilahok ng kabataan
- Pagsali sa **Sangguniang Kabataan (SK)**
- Pagboboluntaryo sa clean-up drive, tree planting at relief operations
- Responsableng paggamit ng **social media** — hindi pagpapakalat ng fake news
- Pakikilahok sa mga **konsultasyon** ng barangay

## Tandaan
Hindi kailangang maging pulitiko upang maging aktibong mamamayan — nagsisimula ito sa **maliliit na gawain sa sariling pamayanan**.`,
  },

  "Pakikilahok na Pulitikal": {
    videoId: "NOpXpC4y-rk",
    lecture: `## Ano ang pakikilahok na pulitikal?
Ito ang **mga gawain ng mamamayan na may kinalaman sa pamamahala** ng bansa. Sa isang **demokrasya**, ang kapangyarihan ay nagmumula sa **taumbayan** (Artikulo II, Seksiyon 1 ng Saligang Batas).

## Paraan ng pakikilahok
**1. Pagboto (suffrage)**
- Kuwalipikasyon (Artikulo V): **Pilipino**, hindi bababa sa **18 taong gulang**, nanirahan sa Pilipinas nang **isang taon** at sa lugar ng pagboboto nang **anim na buwan**, at **rehistrado**
- Ang SK ay bukas sa kabataang **15 hanggang 30** taong gulang

**2. Eleksiyon** — pagpili ng mga pinuno mula barangay hanggang pangulo

**3. Plebisito** — pagboto ng mamamayan upang **aprubahan o tanggihan** ang pagbabago sa Saligang Batas o ang paglikha ng bagong lalawigan o lungsod

**4. Referendum** — pagboto sa isang **batas o lokal na ordinansa**

**5. Initiative** — ang mamamayan mismo ang **nagmumungkahi ng batas** o pagbabago sa Saligang Batas (people's initiative)

**6. Recall** — pagtanggal sa puwesto ng opisyal na **nawalan ng tiwala** ng taumbayan

## Iba pang paraan
- Pagsali sa **civil society** at mga non-government organization
- **Pagbabantay** sa gawain ng pamahalaan
- **Mapayapang pagtitipon** at pagpapahayag ng opinyon
- Halimbawa: ang **EDSA People Power** noong 1986

## Tandaan
Ang **matalinong pagboto** ay pagpili batay sa **plataporma, kakayahan at katapatan** — hindi sa kasikatan o pera.`,
  },

  "Mabuting Pamamahala": {
    videoId: "uzVpBlbLFp4",
    lecture: `## Ano ang mabuting pamamahala?
Ang **mabuting pamamahala (good governance)** ay ang **tapat, mahusay at makatarungang** paggamit ng kapangyarihan ng pamahalaan para sa **kapakanan ng lahat**.

## Mga katangian (ayon sa United Nations)
- **Participation** — may boses ang mamamayan sa pagpapasya
- **Rule of law** — pantay ang pagpapatupad ng batas sa lahat
- **Transparency** — bukas sa publiko ang impormasyon at desisyon
- **Responsiveness** — mabilis tumugon sa pangangailangan ng tao
- **Consensus-oriented** — pinagkakasunduan ang interes ng iba't ibang sektor
- **Equity and inclusiveness** — walang naiiwan
- **Effectiveness and efficiency** — maayos na paggamit ng pondo at yaman
- **Accountability** — may pananagutan ang mga opisyal sa kanilang ginagawa

## Korapsyon
Ang **korapsyon** ay ang **pag-abuso sa kapangyarihan para sa pansariling interes**: pagnanakaw sa kaban ng bayan, suhol, nepotismo at pandaraya. Nagdudulot ito ng **kahirapan**, sirang kalsada, kulang na paaralan at ospital, at **kawalan ng tiwala** sa pamahalaan.

## Mga hakbang laban sa korapsyon
- **Ombudsman** at **Sandiganbayan** — nag-iimbestiga at lumilitis sa mga tiwaling opisyal
- **Commission on Audit (COA)** — sumusuri sa paggastos ng pondo
- **Freedom of Information (FOI)** — karapatan sa impormasyon
- **SALN** — pagdedeklara ng ari-arian ng mga opisyal

## Papel ng mamamayan
- Pagbabantay at **pag-uulat** ng katiwalian
- Pakikilahok sa **participatory governance** (hal. budget consultation sa barangay)
- **Matalinong pagboto**

## Tandaan
Ang mabuting pamamahala ay **pinagsasaluhang tungkulin** ng pamahalaan at ng mamamayan.`,
  },
};
