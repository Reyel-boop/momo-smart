/**
 * Tama o Mali, the Araling Panlipunan game: statement cards about the
 * unit's issues, swiped right for Tama or left for Mali. Each card explains
 * the answer. One round of ten cards per unit of AP 10.
 *
 * Scoring lives here so the server can score a round from the answers.
 */

export type TamaCard = {
  id: string;
  text: string;
  tama: boolean;
  /** Shown after answering. */
  why: string;
};

export type TamaLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  cards: TamaCard[];
};

/** Right answers out of ten for 1, 2 and 3 stars. */
export const TAMA_STARS = [5, 7, 9] as const;

const cards = (id: string, rows: [string, boolean, string][]): TamaCard[] =>
  rows.map(([text, tama, why], i) => ({ id: `${id}.${i}`, text, tama, why }));

export const TAMA_LEVELS: TamaLevel[] = [
  {
    id: "tama-1",
    unit: 1,
    unitTitle: "Mga Suliraning Pangkapaligiran",
    title: "Kalikasan Check",
    cards: cards("tama-1", [
      [
        "Ang RA 9003 ay ang Ecological Solid Waste Management Act.",
        true,
        "Ang RA 9003 (2000) ang batas sa wastong pamamahala ng basura.",
      ],
      [
        "Nakatutulong ang deforestation upang maiwasan ang pagbaha.",
        false,
        "Kabaligtaran: dahil sa pagkakalbo ng kagubatan, mas madalas ang baha at pagguho ng lupa.",
      ],
      [
        "Ang 3R ay nangangahulugang Reduce, Reuse, Recycle.",
        true,
        "Bawasan, gamitin muli at i-recycle ang basura.",
      ],
      [
        "Mabuting paraan ng pagtatapon ang pagsusunog ng basura.",
        false,
        "Nagdudulot ito ng polusyon sa hangin at ipinagbabawal ng Clean Air Act.",
      ],
      [
        "Ang Clean Air Act ay ang RA 8749.",
        true,
        "Ang RA 8749 (1999) ay tungkol sa kalidad ng hangin.",
      ],
      [
        "Pinalalala ng greenhouse gases tulad ng carbon dioxide ang climate change.",
        true,
        "Kinukulong nila ang init sa atmospera.",
      ],
      [
        "Ligtas at legal na paraan ng pangingisda ang dynamite fishing.",
        false,
        "Sinisira nito ang mga bahura at ipinagbabawal ito ng batas.",
      ],
      [
        "Ang Clean Water Act ay ang RA 9275.",
        true,
        "Ang RA 9275 (2004) ay para sa malinis na tubig.",
      ],
      [
        "Hindi nabubulok ang biodegradable na basura.",
        false,
        "Ang biodegradable ay nabubulok, gaya ng balat ng prutas at dahon.",
      ],
      [
        "Nakababawas sa pagguho ng lupa ang pagtatanim ng puno.",
        true,
        "Hinahawakan ng mga ugat ang lupa.",
      ],
    ]),
  },
  {
    id: "tama-2",
    unit: 2,
    unitTitle: "Disaster Risk Reduction and Management",
    title: "Handa Ka Ba?",
    cards: cards("tama-2", [
      [
        "Ang RA 10121 ay ang Philippine Disaster Risk Reduction and Management Act of 2010.",
        true,
        "Ito ang batas na nagtatag ng NDRRMC at ng sistema ng DRRM.",
      ],
      [
        "Ang hazard ay banta na maaaring magdulot ng pinsala, gaya ng bagyo o lindol.",
        true,
        "Ang hazard ang panganib mismo.",
      ],
      [
        "Ang vulnerability ay ang kakayahan ng komunidad na harapin ang kalamidad.",
        false,
        "Iyon ang capacity. Ang vulnerability ay ang kahinaan o pagiging lantad sa pinsala.",
      ],
      [
        "Kapag may lindol, gawin ang Duck, Cover and Hold.",
        true,
        "Yumuko, sumilong at kumapit hanggang tumigil ang pagyanig.",
      ],
      [
        "Ang PAGASA ang nagbabantay ng bagyo at panahon.",
        true,
        "Naglalabas ang PAGASA ng mga babala sa bagyo at ulan.",
      ],
      [
        "Ang PAGASA ang nagbabantay ng mga bulkan at lindol.",
        false,
        "Ang PHIVOLCS ang nagbabantay ng bulkan at lindol. Ang PAGASA ay para sa panahon at bagyo.",
      ],
      [
        "Ang storm surge ay biglang pagtaas ng tubig-dagat dahil sa malakas na bagyo.",
        true,
        "Itinutulak ng hangin ng bagyo ang dagat papunta sa pampang.",
      ],
      [
        "Mas mabuting magplano pagkatapos dumating ang kalamidad.",
        false,
        "Dapat maghanda bago pa ang kalamidad. Iyan ang disaster preparedness.",
      ],
      [
        "Sa Community-Based DRRM, pamahalaang nasyonal lamang ang kumikilos.",
        false,
        "Aktibong kasali ang mismong komunidad sa pagpaplano at pagtugon.",
      ],
      [
        "Naglalaman ang go bag ng tubig, pagkain, flashlight at gamot para sa paglikas.",
        true,
        "Nakahanda ito para madaling madala sa paglikas.",
      ],
    ]),
  },
  {
    id: "tama-3",
    unit: 3,
    unitTitle: "Globalisasyon",
    title: "Mundo sa Isang Click",
    cards: cards("tama-3", [
      [
        "Ang globalisasyon ay mabilis na palitan ng produkto, serbisyo, ideya at tao sa buong mundo.",
        true,
        "Iyan ang malawak na kahulugan ng globalisasyon.",
      ],
      [
        "Bahagi ng globalisasyon ang mga multinational at transnational company.",
        true,
        "Nagnenegosyo sila sa maraming bansa.",
      ],
      [
        "Ang mga call center sa Pilipinas ay halimbawa ng outsourcing.",
        true,
        "Kumukuha ang mga dayuhang kompanya ng serbisyo mula sa mga kompanya rito.",
      ],
      [
        "Walang epekto ang globalisasyon sa kultura ng isang bansa.",
        false,
        "Malaki ang epekto nito, gaya ng pagpasok ng dayuhang pagkain, musika at pananamit.",
      ],
      [
        "Ang guarded globalization ay pagprotekta ng pamahalaan sa mga lokal na negosyo.",
        true,
        "Halimbawa nito ang taripa at mga subsidiya.",
      ],
      [
        "Layunin ng fair trade na bigyan ng makatarungang presyo ang maliliit na prodyuser.",
        true,
        "Pinoprotektahan nito ang mga magsasaka at manggagawa.",
      ],
      [
        "Pinabagal ng internet at social media ang globalisasyon.",
        false,
        "Mas pinabilis pa nila ang palitan ng impormasyon.",
      ],
      [
        "Samahan ng mga bansa sa Timog Amerika ang ASEAN.",
        false,
        "Ang ASEAN ay samahan ng mga bansa sa Timog-Silangang Asya.",
      ],
      [
        "Ang taripa ay buwis sa mga produktong iniluluwas ng isang bansa.",
        false,
        "Ang taripa ay buwis sa mga inaangkat (imported) na produkto, upang protektahan ang lokal na produkto.",
      ],
      [
        "Ang WTO ay ang World Trade Organization.",
        true,
        "Pinangangasiwaan nito ang mga patakaran sa kalakalan ng mga bansa.",
      ],
    ]),
  },
  {
    id: "tama-4",
    unit: 4,
    unitTitle: "Paggawa at Migrasyon",
    title: "Trabaho at Paglipat",
    cards: cards("tama-4", [
      [
        "Ang OFW ay Overseas Filipino Worker.",
        true,
        "Mga Pilipinong nagtatrabaho sa ibang bansa.",
      ],
      [
        "Ang brain drain ay pag-alis ng mga propesyonal at bihasang manggagawa patungo sa ibang bansa.",
        true,
        "Nawawalan ang bansa ng mahuhusay na manggagawa.",
      ],
      [
        "Nagbibigay ng permanenteng trabaho ang kontraktuwalisasyon (endo).",
        false,
        "Panandalian ang trabaho sa endo, kaya walang seguridad sa trabaho.",
      ],
      [
        "Ang migrasyon ay paglipat ng tao mula sa isang lugar patungo sa iba.",
        true,
        "Maaari itong panloob (sa loob ng bansa) o panlabas.",
      ],
      [
        "Ang mas mataas na sahod sa ibang bansa ay halimbawa ng pull factor.",
        true,
        "Hinihila nito ang tao papunta sa lugar na iyon.",
      ],
      [
        "Ang kahirapan at kawalan ng trabaho ay halimbawa ng pull factor.",
        false,
        "Push factor ang mga iyan, dahil itinutulak nila ang tao paalis.",
      ],
      [
        "Ang underemployment ay may trabaho ngunit kulang ang oras o hindi tugma sa pinag-aralan.",
        true,
        "Iba ito sa unemployment, kung saan walang trabaho.",
      ],
      [
        "Ang DepEd ang ahensiyang nangangalaga sa kapakanan ng mga manggagawa.",
        false,
        "Ang DOLE (Department of Labor and Employment) ang nangangalaga sa mga manggagawa. Ang DepEd ay para sa edukasyon.",
      ],
      [
        "Ang remittance ay perang ipinadadala ng OFW sa kanilang pamilya.",
        true,
        "Malaking tulong ito sa ekonomiya ng bansa.",
      ],
      [
        "Walang karapatang bumuo ng unyon ang mga manggagawang Pilipino.",
        false,
        "Kinikilala ng Saligang Batas ang karapatang mag-organisa at bumuo ng unyon.",
      ],
    ]),
  },
  {
    id: "tama-5",
    unit: 5,
    unitTitle: "Mga Isyu sa Kasarian",
    title: "Pantay-pantay",
    cards: cards("tama-5", [
      [
        "Ang sex ay biyolohikal na katangian; ang gender ay mga gampaning hinubog ng lipunan.",
        true,
        "Magkaiba ang dalawang konseptong ito.",
      ],
      [
        "Ang Magna Carta of Women ay ang RA 9710.",
        true,
        "Pinagtibay ito noong 2009.",
      ],
      [
        "Ang RA 9262 ay batas laban sa karahasan sa kababaihan at sa kanilang mga anak.",
        true,
        "Kilala ito bilang Anti-VAWC Act.",
      ],
      [
        "Ang gender equality ay pagbibigay ng mas maraming karapatan sa mga lalaki.",
        false,
        "Ito ay pantay na karapatan at oportunidad para sa lahat ng kasarian.",
      ],
      [
        "Walang karapatang pantao ang mga miyembro ng LGBTQIA+.",
        false,
        "Pantay ang karapatang pantao ng lahat ng tao.",
      ],
      [
        "Ang Safe Spaces Act (RA 11313) ay laban sa gender-based sexual harassment.",
        true,
        "Saklaw nito ang kalye, online, trabaho at paaralan.",
      ],
      [
        "Para sa mga babae lamang ang gawaing-bahay.",
        false,
        "Stereotype ito. Gawain ito ng lahat ng kasapi ng tahanan.",
      ],
      [
        "Ang diskriminasyon ay hindi patas na pagtrato dahil sa kasarian o iba pang katangian.",
        true,
        "Labag ito sa karapatang pantao.",
      ],
      [
        "Ang foot binding sa sinaunang Tsina ay halimbawa ng karahasan sa kababaihan.",
        true,
        "Pinahirapan nito ang mga babae dahil sa pamantayan ng kagandahan.",
      ],
      [
        "Ang sexual orientation ay tumutukoy sa biyolohikal na katangian ng katawan.",
        false,
        "Iyon ay sex. Ang sexual orientation ay kung kanino naaakit ang isang tao.",
      ],
    ]),
  },
  {
    id: "tama-6",
    unit: 6,
    unitTitle: "Karapatang Pantao",
    title: "Karapatan Ko",
    cards: cards("tama-6", [
      [
        "Pinagtibay ng United Nations ang Universal Declaration of Human Rights noong 1948.",
        true,
        "Pinagtibay ito noong Disyembre 10, 1948.",
      ],
      [
        "Maaaring bawiin ng pamahalaan ang karapatang pantao anumang oras.",
        false,
        "Likas ang karapatang pantao at hindi basta-basta maaaring alisin.",
      ],
      [
        "Iniimbestigahan ng Commission on Human Rights ang mga paglabag sa karapatang pantao.",
        true,
        "Malayang komisyon ang CHR.",
      ],
      [
        "Nasa Artikulo III ng Saligang Batas ng 1987 ang Bill of Rights.",
        true,
        "Nakalista roon ang mga karapatan ng mamamayan.",
      ],
      [
        "Ang karapatang bumoto ay isang karapatang pangkultura.",
        false,
        "Ito ay karapatang pampulitika, kasama ng karapatang tumakbo sa halalan.",
      ],
      [
        "Walang sariling karapatan ang mga bata.",
        false,
        "May UN Convention on the Rights of the Child para sa kanila.",
      ],
      [
        "Ang karapatan sa edukasyon ay karapatang panlipunan at pangkultura.",
        true,
        "Kasama nito ang karapatan sa kalusugan at kultura.",
      ],
      [
        "Pinahihintulutan ang torture kung suspek sa krimen ang isang tao.",
        false,
        "Ipinagbabawal ang torture sa lahat ng pagkakataon (RA 9745).",
      ],
      [
        "Isa ang Magna Carta (1215) ng Inglatera sa mga unang dokumentong naglimita sa kapangyarihan ng hari.",
        true,
        "Isa ito sa pinagmulan ng ideya ng karapatan.",
      ],
      [
        "May kasamang tungkuling igalang ang karapatan ng iba ang bawat karapatan.",
        true,
        "Magkaugnay ang karapatan at tungkulin.",
      ],
    ]),
  },
  {
    id: "tama-7",
    unit: 7,
    unitTitle: "Pagkamamamayan",
    title: "Mamamayang Pilipino",
    cards: cards("tama-7", [
      [
        "Mamamayang Pilipino ang mga anak ng amang o inang Pilipino.",
        true,
        "Ayon ito sa Artikulo IV ng Saligang Batas.",
      ],
      [
        "Ang jus soli ay pagkamamamayang batay sa lugar ng kapanganakan.",
        true,
        "Soli ay lupa: kung saan ka ipinanganak.",
      ],
      [
        "Jus soli ang sinusunod ng Pilipinas.",
        false,
        "Jus sanguinis (dugo o magulang) ang sinusunod ng Pilipinas.",
      ],
      [
        "Ang naturalisasyon ay paraan para maging mamamayan ang isang dayuhan.",
        true,
        "Dumadaan ito sa proseso ng batas.",
      ],
      [
        "Maaaring mawala ang pagkamamamayan kapag nanumpa ng katapatan sa ibang bansa.",
        true,
        "Isa ito sa mga paraan ng pagkawala ng pagkamamamayan.",
      ],
      [
        "Pinapayagan ng RA 9225 ang dual citizenship.",
        true,
        "Ang Citizenship Retention and Re-acquisition Act of 2003.",
      ],
      [
        "Tungkulin ng mamamayan ang pagbabayad ng buwis.",
        true,
        "Pinopondohan ng buwis ang mga serbisyo ng pamahalaan.",
      ],
      [
        "Walang pakialam sa mga isyu ng komunidad ang aktibong mamamayan.",
        false,
        "Nakikilahok at may malasakit sa komunidad ang aktibong mamamayan.",
      ],
      [
        "Ang mga Pilipinong 15 taong gulang pataas ay maaaring bumoto sa pambansang halalan.",
        false,
        "Dapat 18 taong gulang pataas ang botante sa pambansang halalan.",
      ],
      [
        "Tungkol lamang sa karapatan ang pagkamamamayan at walang tungkulin.",
        false,
        "May kasamang mga tungkulin ang pagkamamamayan.",
      ],
    ]),
  },
  {
    id: "tama-8",
    unit: 8,
    unitTitle: "Pakikilahok at Mabuting Pamamahala",
    title: "Mabuting Pamamahala",
    cards: cards("tama-8", [
      [
        "May transparency, accountability at pakikilahok ng mamamayan ang good governance.",
        true,
        "Ito ang mga haligi ng mabuting pamamahala.",
      ],
      [
        "Nakatutulong sa mabuting pamamahala ang korapsiyon.",
        false,
        "Sinisira ng korapsiyon ang tiwala at ang pondo ng bayan.",
      ],
      [
        "Ang civil society ay mga ahensiya ng pamahalaan.",
        false,
        "Ang civil society ay mga samahang hindi bahagi ng pamahalaan, gaya ng mga NGO at people's organization.",
      ],
      [
        "Isang paraan ng pakikilahok sa politika ang eleksiyon.",
        true,
        "Sa pagboto, pumipili ang mamamayan ng mga pinuno.",
      ],
      [
        "Binibigyan ng Sangguniang Kabataan ng boses ang kabataan sa pamahalaang lokal.",
        true,
        "Ang SK ang kinatawan ng kabataan sa barangay.",
      ],
      [
        "Layunin ng Freedom of Information na itago ang impormasyon ng pamahalaan.",
        false,
        "Layunin nito na buksan ang impormasyon sa publiko.",
      ],
      [
        "Inaanyayahan ng participatory governance ang mamamayan sa pagpapasya.",
        true,
        "Kasali ang mamamayan sa pagbuo ng mga patakaran.",
      ],
      [
        "Iniimbestigahan ng Ombudsman ang katiwalian ng mga opisyal ng pamahalaan.",
        true,
        "Ang Ombudsman ang tagapagbantay laban sa katiwalian.",
      ],
      [
        "Isang tamang paraan ng pakikilahok ang pagbebenta ng boto.",
        false,
        "Labag ito sa batas at sinisira nito ang demokrasya.",
      ],
      [
        "Halimbawa ng pakikilahok ng mamamayan ang People Power sa EDSA noong 1986.",
        true,
        "Mapayapang nagkaisa ang mamamayan para sa pagbabago.",
      ],
    ]),
  },
];

export function tamaStars(right: number) {
  return TAMA_STARS.filter((needed) => right >= needed).length;
}

/** Scores a round: Tama or Mali for every card. Null when cards are missing. */
export function scoreTama(
  level: TamaLevel,
  answers: { id: string; tama: boolean }[],
) {
  const picked = new Map(answers.map((a) => [a.id, a.tama]));
  if (level.cards.some((c) => !picked.has(c.id))) return null;
  const right = level.cards.filter((c) => picked.get(c.id) === c.tama).length;
  return { right, total: level.cards.length, stars: tamaStars(right) };
}
