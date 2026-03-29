export interface ExamQuestion {
  id: number;
  subject: 'Türkçe' | 'T.C. İnkılap Tarihi' | 'Din Kültürü' | 'İngilizce';
  questionNumber: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const sozelDeneme: ExamQuestion[] = [
  // TÜRKÇE
  {
    id: 1, subject: 'Türkçe', questionNumber: 1,
    text: "Edebiyat eleştirmenlerinin sıklıkla düştüğü bir yanılgı vardır: Eseri, sadece yazarının biyografik gölgeleri üzerinden okumak. Elbette bir yazarın travmaları metne sızar; ancak edebi metin matbaadan çıktığı an yazarından bağımsızlaşır. Bir romanı yazarının hayatıyla sınırlandırmak, onun evrensel mesajını boğmaktır.\nBu parçada vurgulanmak istenen asıl düşünce aşağıdakilerden hangisidir?",
    options: {
      A: "Edebi eserlerin yazarlarından tamamen bağımsız şekilde kaleme alındığı",
      B: "Bir eserin değerinin yalnızca yazarının hayat hikâyesine hapsedilmemesi gerektiği",
      C: "Eleştirmenlerin, yazarların psikolojik durumlarını analiz etmekte yetersiz kaldığı",
      D: "Evrensel romanların her dönemde okunma potansiyeli taşıdığı"
    },
    correctAnswer: 'B'
  },
  {
    id: 2, subject: 'Türkçe', questionNumber: 2,
    text: "1. Metin: Mimari restorasyonlarda yapılan hata, tarihi yapıyı ilk günkü gibi kusursuz göstermeye çalışmaktır. Oysa o çatlaklar, zamanın imzasıdır.\n2. Metin: Antika toplayıcıları, bir objenin üzerindeki kullanım izlerini silip onu yepyeni yapmayı 'değer kaybı' sayar. Kıymet, yaşanmışlıktadır.\nBu iki metnin ortak temasını en doğru ifade eden yargı hangisidir?",
    options: {
      A: "Restorasyon süreçleri büyük bir uzmanlık gerektirir.",
      B: "Geçmişten gelen yapı ve nesnelerin değerini kusursuzlukları değil, yaşanmışlık izleri belirler.",
      C: "Modern çağda insanların eski eşyalara ilgisi artmaktadır.",
      D: "Zamanın yıkıcı etkisi nesnelerin orijinalliğini yok eder."
    },
    correctAnswer: 'B'
  },
  {
    id: 3, subject: 'Türkçe', questionNumber: 3,
    text: "Teknolojik determinizm, teknolojinin toplumu tek yönlü şekillendirdiğini savunur. Ancak sosyokültürel yapılandırmacı yaklaşım buna karşı çıkar. Onlara göre teknoloji bir fail değildir; toplumun ihtiyaçları ve kültürel kodları hangi teknolojinin üretileceğini belirler. Kılıç savaş aleti olarak icat edilmemiştir; savaşan toplum kılıcı icat etmeye mecbur kalmıştır.\nSosyokültürel yapılandırmacıların temel eleştirisi nedir?",
    options: {
      A: "Teknolojinin ahlaki çöküşe zemin hazırlaması",
      B: "Teknolojiyi tek belirleyici güç görüp toplumun yönlendirici rolünü yok sayması",
      C: "İcatların ekonomik çıkarlarca manipüle edilmesi",
      D: "Yeni teknolojilerin kültürel kodları hızla tahrip etmesi"
    },
    correctAnswer: 'B'
  },
  {
    id: 4, subject: 'Türkçe', questionNumber: 4,
    text: "'Sarmak' sözcüğü aşağıdakilerin hangisinde 'Zihni tamamen meşgul etmek, bir düşüncenin veya duygunun etkisine girmek' anlamındadır?",
    options: {
      A: "Annesinin ördüğü kalın atkıyı boynuna sıkıca sardı.",
      B: "Bu yeni fantastik roman beni o kadar sardı ki bir gecede bitirdim.",
      C: "Eski evin duvarlarını saran sarmaşıklar gizem katıyordu.",
      D: "Düşmanın beklenmedik anda şehrin etrafını sarması paniğe yol açtı."
    },
    correctAnswer: 'B'
  },
  {
    id: 5, subject: 'Türkçe', questionNumber: 5,
    text: "1: Okyanusların asitlenmesi, mercan resiflerinin kireç taşı iskeletleri oluşturmasını engeller.\n2: Bu durum, onlara sığınan deniz canlılarını da yok olma tehlikesiyle yüzleştirir.\nBu iki cümlenin doğru birleştirilmiş hâli hangisidir?",
    options: {
      A: "Okyanusların asitlenmesi mercanları yok ettiği için deniz canlıları da iskelet üretemez.",
      B: "Okyanus asitlenmesinin mercanların iskelet oluşturmasını engellemesi, hem mercanları hem de onlara sığınan canlıları yok olma riskiyle yüzleştirmektedir.",
      C: "Canlıların iskelet yapısını bozan asitlenme, deniz ekosisteminin çökmesine neden olur.",
      D: "Mercanları zorlayan asitlenme deniz canlılarının soyunu tüketir."
    },
    correctAnswer: 'B'
  },
  {
    id: 6, subject: 'Türkçe', questionNumber: 6,
    text: "Yan yana 1'den 6'ya kadar numaralanmış okuma kabinlerine Aslı, Berk, Cem, Deniz, Efe ve Funda yerleşecektir:\n- Berk ve Deniz'in kabinleri yan yanadır.\n- Efe uç kabinlerin birindedir ama numarası en büyük olanda değildir.\n- Cem, Aslı'nın hemen sağındadır.\n- Funda'nın kabin numarası çift sayıdır.\nBuna göre aşağıdakilerden hangisi kesinlikle yanlıştır?",
    options: {
      A: "Efe 1 numaralı kabindedir.",
      B: "Cem 1 numaralı kabindedir.",
      C: "Funda 6 numaralı kabindedir.",
      D: "Berk ve Deniz 4 ve 5'te olabilir."
    },
    correctAnswer: 'B'
  },
  {
    id: 7, subject: 'Türkçe', questionNumber: 7,
    text: "K: Bu su buharı zamanla yoğunlaşarak bulutları oluşturur.\nL: Ancak her katman eşit sıcaklıkta olmadığı için her zaman yağmur düşmez.\nM: Güneşin ısıtmasıyla sular buharlaşarak atmosfere yükselir.\nN: Soğuk havayla karşılaşırsa damlacıklar kar tanelerine dönüşür.\nO: Su damlacıkları ağırlaştığında yerçekimi etkisiyle yeryüzüne düşer.\nKurallı bir metin oluşturulduğunda baştan üçüncü cümle hangisi olur?",
    options: { A: "K", B: "L", C: "O", D: "N" },
    correctAnswer: 'C'
  },
  {
    id: 8, subject: 'Türkçe', questionNumber: 8,
    text: "Orman Yangın Nedenleri (2023)\nİhmal ve Dikkatsizlik: %45\nBilinmeyen: %25\nKasıtlı Çıkarma: %20\nDoğal Nedenler: %10\nNot: İnsan kaynaklı yangın sayısı (İhmal+Kasıt) son 10 yılda sürekli artış trendindedir.\nBu verilere göre aşağıdakilerden hangisine ulaşılamaz?",
    options: {
      A: "İnsan kaynaklı yangınlar, doğal yangınlardan yüksek orana sahiptir.",
      B: "En büyük pay insanların dikkatsiz davranışlarına aittir.",
      C: "Erken uyarı sistemlerinin eksikliği yangınları büyütmüştür.",
      D: "Çıkış nedenlerinin dörtte biri henüz tespit edilememiştir."
    },
    correctAnswer: 'C'
  },
  {
    id: 9, subject: 'Türkçe', questionNumber: 9,
    text: "(I) Güneş batarken ufukta beliren kızıllık muazzamdı. (II) Sahilde yürüyüş yapanlar adımlarını yavaşlattı. (III) Balıkçılar yanaşmış, balıkları parlayan kasalara diziyordu. (IV) Rüzgârın çıkmasıyla dalgalar çarparak dağılıyordu.\nNumaralanmış cümlelerin hangisinde fiilimsi eki almış sözcük kalıcı isim olmuştur?",
    options: { A: "I", B: "II", C: "III", D: "IV" },
    correctAnswer: 'B'
  },
  {
    id: 10, subject: 'Türkçe', questionNumber: 10,
    text: "Yapay zeka teknik metinleri hatasız çevirebilir. Ancak iş Orhan Veli'nin dizelerine geldiğinde, o balık kokusunu makinelerde aramak beyhudedir. Şiiri kelimesi kelimesine çevirmek, şiirin ruhunu katletmektir.\nYazarın yapay zeka çevirisine tutumu hangisiyle en iyi ifade edilir?",
    options: {
      A: "Tamamen reddedici ve teknoloji karşıtı",
      B: "Kısmen takdir edici ancak edebi derinlik açısından yetersiz bulucu",
      C: "Gelecekte her şeyi ele geçireceğinden endişe duyucu",
      D: "Edebi eserleri de yakında kusursuz çevireceğine inanan"
    },
    correctAnswer: 'B'
  },
  {
    id: 11, subject: 'Türkçe', questionNumber: 11,
    text: "Hangi cümlede eylemin gerçekleşmesi bir koşula bağlanmış ve koşulun gerçekleşmeme nedeni (neden-sonuç) verilmiştir?",
    options: {
      A: "Yağışlar yetersiz olursa üretimde kısıtlamaya gidilecek.",
      B: "Sera gazı arttığı için ısınmayı daha sert hissediyoruz.",
      C: "Bütçe ayrılmadığından projeler zamanında tamamlanamazsa enerji açığı büyüyecek.",
      D: "Batarya ömürleri uzatılırsa kirlilik azalacak ancak tahribat artacaktır."
    },
    correctAnswer: 'C'
  },
  {
    id: 12, subject: 'Türkçe', questionNumber: 12,
    text: "Mardin, taş evleriyle masaldan fırlamış gibidir. Dar sokaklara sızan ışık, kabartmaları canlandırır. Çarşıda telkâri ustalarının ocaklarından is ve kahve kokusu yükselir. İbn Haldun 'Coğrafya kaderdir.' derken bu dinginliği kastediyordu belki.\nBu parçanın anlatımıyla ilgili hangisi söylenemez?",
    options: {
      A: "Farklı duyulara seslenilmiştir.",
      B: "Tanık gösterme yapılmıştır.",
      C: "Betimleyici ögeler ağır basmaktadır.",
      D: "Olaylar oluş sırasına göre ve bir hareketlilik içinde verilmiştir."
    },
    correctAnswer: 'D'
  },
  {
    id: 13, subject: 'Türkçe', questionNumber: 13,
    text: "'Uluslararası bilim insanları, küresel ısınmanın yıkıcı etkilerini saatlerce tartıştılar.'\nBu cümlenin öge dizilişi sırasıyla hangisidir?",
    options: {
      A: "Özne / Zarf Tamlayıcısı / Belirtili Nesne / Yüklem",
      B: "Özne / Belirtili Nesne / Zarf Tamlayıcısı / Yüklem",
      C: "Dolaylı Tümleç / Özne / Belirtili Nesne / Yüklem",
      D: "Özne / Belirtisiz Nesne / Zarf Tamlayıcısı / Yüklem"
    },
    correctAnswer: 'B'
  },
  {
    id: 14, subject: 'Türkçe', questionNumber: 14,
    text: "Şifreleme Kuralı: 1) Her harf alfabede kendisinden iki sonraki harfle değiştirilir. 2) Yeni kelimenin içinde sesli harf varsa o seslinin yerine '*' konur. (Örn: A -> C)\nKurala göre 'KALE' kelimesinin şifrelenmiş hâli hangisidir?",
    options: { A: "M*NG", B: "MCNG", C: "LBMF", D: "M*PF" },
    correctAnswer: 'B'
  },
  {
    id: 15, subject: 'Türkçe', questionNumber: 15,
    text: "(I) Güneş enerjisi tükenmez bir kaynak olarak öne çıkıyor. (II) Karbon emisyonu sıfır olduğu için ısınmayla mücadelede önemlidir. (III) Güneş panellerinin üretiminde kullanılan metallerin madenciliği ise doğaya ciddi zarar verebiliyor. (IV) Kurulum maliyetleri düşse de verimlilik değişmektedir. (V) Ayrıca panellerin geri dönüşüm süreçleri henüz çözülmemiştir.\nBu parça iki paragrafa ayrılmak istense ikinci paragraf hangisiyle başlar?",
    options: { A: "II", B: "III", C: "IV", D: "V" },
    correctAnswer: 'B'
  },
  {
    id: 16, subject: 'Türkçe', questionNumber: 16,
    text: "Yazar: 'Ben karakterlerime yenilgiyi tattırmıyorum; sadece sokağa çıkıp insanları izliyor ve gördüğümü kâğıda döküyorum. Masallar uyumak içindir, romanlar uyanmak için.'\nYazarın sanat anlayışıyla ilgili en kesin yargı hangisidir?",
    options: {
      A: "Edebiyatın okuru sadece eğlendirmek gibi bir işlevi yoktur, gerçekleri yansıtmalıdır.",
      B: "Toplumun sadece acı çeken kesimlerini anlatmayı sanatsal görev sayar.",
      C: "Romanın masal türünden üstün olduğunu ispatlamaya çalışmaktadır.",
      D: "Gerçekliği estetik kaygılardan tamamen arındırarak yansıtmayı hedefler."
    },
    correctAnswer: 'A'
  },
  {
    id: 17, subject: 'Türkçe', questionNumber: 17,
    text: "Bir ekonomi grafiğinde 'E-ticaret Hacmi' eğrisi, 'Fiziksel Mağaza Satışları' eğrisini geçip aradaki farkı hızla açmıştır.\nBu durum aynı hızla devam ederse 2030 yılı için hangisinin gerçekleşmesi en az olasıdır?",
    options: {
      A: "Lojistik ve dijital güvenlik yatırımlarının artması",
      B: "Fiziksel mağazaların (AVM) tamamen yıkılması ve sıfıra inmesi",
      C: "Pazarlama stratejilerinin sosyal medya odaklı olması",
      D: "Tezgâhtarlık yerine yapay zekâ müşteri asistanlarının yaygınlaşması"
    },
    correctAnswer: 'B'
  },
  {
    id: 18, subject: 'Türkçe', questionNumber: 18,
    text: "Yeni müdür, deneyimli çalışanları kovup tecrübesizleri getirdi. Krizde yeni ekip projeyi batırdı. Ne demişler, (I) —. Müdür hatasını anlasa da (II) —.\nParçada boş bırakılan yerlere sırasıyla hangileri gelmelidir?",
    options: {
      A: "Eskiye rağbet olsa... / İş işten geçti",
      B: "Görünen köy kılavuz istemez / Dizini dövüyor",
      C: "Tarlada izi olmayanın... / Son pişmanlık fayda etmez",
      D: "Dimyat'a giderken... / Başı göğe erdi"
    },
    correctAnswer: 'C'
  },
  {
    id: 19, subject: 'Türkçe', questionNumber: 19,
    text: "Mikorizal mantar ağları ormandaki ağaçları birleştirir. Yaşlı ağaçlar fazla şekerini genç fidanlara aktarır. Hasta bir ağaç diğerlerine savunma sinyali gönderir. Doğa acımasız bir rekabet alanı değil, muazzam bir dayanışma ağıdır.\nBu parçadan çıkarılacak en kapsamlı sonuç hangisidir?",
    options: {
      A: "Mantarlar ekosistemin en zeki canlıları olarak kabul edilmelidir.",
      B: "Güçlü olanın zayıfı yok ettiği rekabet teorisi ormanlarda geçersizdir.",
      C: "Canlılar dünyası bencil güdülerden çok kolektif yardımlaşmayla sürer.",
      D: "Fotosentez, bitkilerin enerji elde etmesinde tek yöntem değildir."
    },
    correctAnswer: 'C'
  },
  {
    id: 20, subject: 'Türkçe', questionNumber: 20,
    text: "4 haneli şifre (A-B-C-D) sadece rakamlardan oluşur:\n- B hanesi, A hanesinin karesidir.\n- Tüm rakamlar farklıdır.\n- C ve D'nin toplamı 10'dur.\n- En büyük rakam D hanesindedir.\nBuna göre kasanın şifresi hangisidir?",
    options: { A: "2-4-3-7", B: "3-9-2-8", C: "2-4-5-5", D: "3-9-4-6" },
    correctAnswer: 'A'
  },

  // İNKILAP
  {
    id: 21, subject: 'T.C. İnkılap Tarihi', questionNumber: 1,
    text: "İtilaf Devletleri haritada gösterilen bu geniş çaplı işgalleri gerçekleştirebilmek ve dünya kamuoyundan gelebilecek tepkileri önlemek için Mondros Ateşkes Antlaşması'nın hangi maddesini kendilerine hukuki bir dayanak (kılıf) olarak kullanmışlardır?",
    options: {
      A: "Sınırların korunması ve iç güvenliğin sağlanması dışındaki Osmanlı ordusu terhis edilecektir.",
      B: "İtilaf Devletleri, güvenliklerini tehdit edecek bir durum ortaya çıkarsa herhangi bir stratejik noktayı işgal edebilecektir. (7. Madde)",
      C: "Doğudaki altı vilayette (Vilayat-ı Sitte) bir karışıklık çıkarsa buralar işgal edilebilecektir. (24. Madde)",
      D: "Tüm telsiz, telgraf ve haberleşme hatları İtilaf Devletleri'nin denetimine bırakılacaktır."
    },
    correctAnswer: 'B'
  },
  {
    id: 22, subject: 'T.C. İnkılap Tarihi', questionNumber: 2,
    text: "Mustafa Kemal, Trablusgarp Savaşı'nda İtalyanlara karşı yerel halkı örgütleyerek Derne ve Tobruk'ta başarılı savunmalar yapmıştır.\nBu durum Mustafa Kemal'in hangi kişilik özellikleriyle doğrudan ilgilidir?",
    options: {
      A: "Vatanseverlik - Teşkilatçılık",
      B: "İleri görüşlülük - İnkılapçılık",
      C: "Eğitimcilik - Açık sözlülük",
      D: "Çok yönlülük - Mantıklılık"
    },
    correctAnswer: 'A'
  },
  {
    id: 23, subject: 'T.C. İnkılap Tarihi', questionNumber: 3,
    text: "Erzurum Kongresi'nde alınan 'Milli sınırlar içinde vatan bir bütündür, parçalanamaz.' ve 'Manda ve himaye kabul olunamaz.' kararları Milli Mücadele'nin rotasını çizmiştir.\nBu iki karar birlikte değerlendirildiğinde aşağıdakilerden hangisinin hedeflendiği kesin olarak söylenebilir?",
    options: {
      A: "Saltanat makamının güçlendirilmesinin",
      B: "Ulusal egemenliğe dayalı yeni bir rejim kurulmasının",
      C: "Tam bağımsızlığın ve ülke bütünlüğünün sağlanmasının",
      D: "Sadece Doğu Anadolu'nun Ermenilerden kurtarılmasının"
    },
    correctAnswer: 'C'
  },
  {
    id: 24, subject: 'T.C. İnkılap Tarihi', questionNumber: 4,
    text: "Kütahya-Eskişehir Savaşları sonrasında ordunun acil ihtiyaçlarını karşılamak üzere Mustafa Kemal tarafından 'Tekâlif-i Milliye Emirleri' yayımlanmıştır. Halk, elindeki çorap, çarık, buğday gibi ürünlerin bir kısmını orduya vermiştir.\nBu durum Türk milletinin hangi özelliğini kanıtlar niteliktedir?",
    options: {
      A: "Yabancı devletlerin himayesine girmek istediğini",
      B: "Topyekûn bir seferberlik ve dayanışma içinde olduğunu",
      C: "Düzenli ordudan umudunu kesip Kuvâ-yı Milliye'ye döndüğünü",
      D: "Ekonomik alanda dışa bağımlılığının tamamen bittiğini"
    },
    correctAnswer: 'B'
  },
  {
    id: 25, subject: 'T.C. İnkılap Tarihi', questionNumber: 5,
    text: "Teşkilat-ı Esasiye Kanunu'nun (1921 Anayasası) ilk maddesi 'Egemenlik kayıtsız şartsız milletindir.' şeklindedir.\nBu madde, Atatürk'ün aşağıdaki ilkelerinden öncelikle hangisiyle doğrudan ilişkilidir?",
    options: {
      A: "Devletçilik",
      B: "Cumhuriyetçilik",
      C: "İnkılapçılık",
      D: "Laiklik"
    },
    correctAnswer: 'B'
  },
  {
    id: 26, subject: 'T.C. İnkılap Tarihi', questionNumber: 6,
    text: "Yeni kurulan Türk devletinde, siyasi bağımsızlığın ancak ekonomik bağımsızlıkla taçlandırılabileceği fikri benimsenmiştir.\nAşağıdaki gelişmelerden hangisi bu fikri destekleyen adımlardan biri değildir?",
    options: {
      A: "İzmir İktisat Kongresi'nin toplanması",
      B: "Kabotaj Kanunu'nun kabul edilmesi",
      C: "Kapitülasyonların kesin olarak kaldırılması",
      D: "Tekke, zaviye ve türbelerin kapatılması"
    },
    correctAnswer: 'D'
  },
  {
    id: 27, subject: 'T.C. İnkılap Tarihi', questionNumber: 7,
    text: "Kurtuluş Savaşı devam ederken değişen güney sınırımızı gösteren taslak bir harita verilmiştir (1921 Ankara Antlaşması Sınırı).\nBu harita ve 1921 Ankara Antlaşması'nın özellikleri düşünüldüğünde ulaşılabilecek en kapsamlı yargı hangisidir?",
    options: {
      A: "Askeri sahada kazanılan büyük başarılar, masada siyasi ve diplomatik zaferleri de beraberinde getirmiştir.",
      B: "Fransa, İtilaf Devletleri bloğundan tamamen ayrılarak savaşta TBMM'nin müttefiki olmuştur.",
      C: "Güney Cephesi'ndeki çatışmaların tamamı sadece düzenli ordu birlikleri tarafından yürütülmüştür.",
      D: "Misak-ı Milli sınırlarından hiçbir taviz verilmeden tüm hedeflere tam olarak ulaşılmıştır."
    },
    correctAnswer: 'A'
  },
  {
    id: 28, subject: 'T.C. İnkılap Tarihi', questionNumber: 8,
    text: "Atatürk Dönemi'nde çok partili hayata geçiş denemeleri yapılmış (Terakkiperver ve Serbest Cumhuriyet Fırkaları kurulmuş) ancak çıkan isyanlar ve rejim karşıtı hareketler sebebiyle bu partiler kapatılmak zorunda kalmıştır.\nBu durum aşağıdakilerden hangisinin göstergesidir?",
    options: {
      A: "Halkın tamamının çok partili hayatı desteklediğinin",
      B: "Ortamın henüz çok partili demokratik yaşama tam olarak hazır olmadığının",
      C: "Atatürk'ün tek parti yönetimini sonsuza dek sürdürmek istediğinin",
      D: "Siyasi partilerin ekonomik kalkınmayı engellediğinin"
    },
    correctAnswer: 'B'
  },
  {
    id: 29, subject: 'T.C. İnkılap Tarihi', questionNumber: 9,
    text: "Kütahya-Eskişehir Savaşları'nın en şiddetli günlerinde top sesleri Ankara'dan duyulurken Mustafa Kemal, Maarif (Eğitim) Kongresi'ni toplamış ve ertelemeyi reddetmiştir.\nBu olay, Mustafa Kemal'in aşağıdakilerden hangisine verdiği önemi gösterir?",
    options: {
      A: "Eğitime ve cehaletle savaşa",
      B: "Askeri taktiklerin halka öğretilmesine",
      C: "Ekonomik yatırımların artırılmasına",
      D: "Uluslararası diplomatik ilişkilere"
    },
    correctAnswer: 'A'
  },
  {
    id: 30, subject: 'T.C. İnkılap Tarihi', questionNumber: 10,
    text: "'Biz kimsenin düşmanı değiliz. Yalnız insanlığın düşmanı olanların düşmanıyız.' (M. Kemal Atatürk)\nAtatürk'ün bu sözü, Türk Dış Politikası'nın hangi temel ilkesiyle doğrudan örtüşmektedir?",
    options: {
      A: "Karşılıklılık (Mütekabiliyet)",
      B: "Yurtta sulh, cihanda sulh",
      C: "Tam bağımsızlık",
      D: "Gerçekçilik"
    },
    correctAnswer: 'B'
  },

  // DİN KÜLTÜRÜ
  {
    id: 31, subject: 'Din Kültürü', questionNumber: 1,
    text: "Evrendeki yasalar fiziksel, biyolojik ve toplumsal yasalar olmak üzere üçe ayrılır. Suyun kaldırma kuvveti fiziksel, balıkların solungaçla nefes alması biyolojik yasaya örnektir.\nBuna göre aşağıdakilerden hangisi 'toplumsal yasalara' bir örnektir?",
    options: {
      A: "Isınan metallerin genleşmesi",
      B: "Adaletin olmadığı toplumlarda barışın bozulması ve göçlerin yaşanması",
      C: "Kutup ayılarının soğuktan korunmak için kalın yağ tabakasına sahip olması",
      D: "Dünyanın kendi ekseni etrafında dönmesiyle gece ve gündüzün oluşması"
    },
    correctAnswer: 'B'
  },
  {
    id: 32, subject: 'Din Kültürü', questionNumber: 2,
    text: "'Tevekkül', bir iş için elinden gelen tüm gayreti (sebepleri) yerine getirdikten sonra sonucunu Allah'a bırakmak ve O'na güvenmektir.\nAşağıdaki davranışlardan hangisi doğru bir tevekkül anlayışına uymaz?",
    options: {
      A: "Çiftçinin tarlasını sürüp tohumu ektikten sonra bereket için dua etmesi",
      B: "Sınava hiç çalışmayan bir öğrencinin 'Kaderimde varsa geçerim.' demesi",
      C: "Hastalanan bir kişinin doktora gidip ilaçlarını aldıktan sonra şifayı Allah'tan beklemesi",
      D: "Emniyet kemerini takan bir sürücünün 'Allah kaza beladan korusun.' diyerek yola çıkması"
    },
    correctAnswer: 'B'
  },
  {
    id: 33, subject: 'Din Kültürü', questionNumber: 3,
    text: "İslam dini, toplumda sosyal adaleti sağlamak ve zengin ile yoksul arasındaki uçurumu kapatmak için zekât ve sadaka ibadetlerini emretmiştir.\nAşağıdaki kişilerden hangisine zekât verilebilir?",
    options: {
      A: "İhtiyaç sahibi yoksul komşuya",
      B: "Maddi durumu kötü olan öz anne ve babaya",
      C: "Evli ve zor durumda olan kendi öz çocuğuna",
      D: "Aynı evi paylaştığı eşine"
    },
    correctAnswer: 'A'
  },
  {
    id: 34, subject: 'Din Kültürü', questionNumber: 4,
    text: "Maun Suresi'nde 'Yazıklar olsun o namaz kılanlara ki, onlar namazlarını ciddiye almazlar. Onlar gösteriş yaparlar ve ufacık bir yardıma bile engel olurlar.' buyrulmaktadır.\nBu sureden çıkarılabilecek en kapsamlı mesaj aşağıdakilerden hangisidir?",
    options: {
      A: "Namazın sadece belirli vakitlerde kılınması gerektiği",
      B: "İbadetlerin gösterişten uzak (ihlasla) ve samimi yapılması, yardımlaşmanın engellenmemesi gerektiği",
      C: "Zekât vermenin namaz kılmaktan daha önemli bir ibadet olduğu",
      D: "Sadece maddi yardımın Allah katında kabul göreceği"
    },
    correctAnswer: 'B'
  },
  {
    id: 35, subject: 'Din Kültürü', questionNumber: 5,
    text: "Hz. Şuayb (a.s.), Medyen halkına gönderilmiş bir peygamberdir. Medyen halkı ticarette hile yapan, ölçü ve tartıda insanları kandıran bir topluluktu. Hz. Şuayb onları dürüst ticarete davet etmiş ancak onlar dinlememiş ve helak olmuşlardır.\nBu kıssadan günümüz insanı için çıkarılması gereken temel ders nedir?",
    options: {
      A: "Ekonomik hayatta dürüstlük, hak ve adalete riayet etmenin zorunluluğu",
      B: "Tarımsal üretimin ticaretten daha bereketli olduğu",
      C: "Sadece ibadet etmenin toplumların kurtuluşu için yeterli olduğu",
      D: "Yabancı ülkelerle ticaret yapmanın sakıncalı olduğu"
    },
    correctAnswer: 'A'
  },
  {
    id: 36, subject: 'Din Kültürü', questionNumber: 6,
    text: "İslam dini, insanın dünya ve ahiret mutluluğunu sağlamak için bazı temel değerlerin korunmasını emretmiştir. Bunlara 'Zarurat-ı Hamse' (Dinin, Canın, Aklın, Neslin ve Malın korunması) denir.\nİş sağlığı ve güvenliği kurallarına uymak, tehlikeli araçları kullanırken kask takmak bu temel değerlerden hangisinin korunmasıyla doğrudan ilgilidir?",
    options: {
      A: "Neslin korunması",
      B: "Dinin korunması",
      C: "Aklın korunması",
      D: "Canın korunması"
    },
    correctAnswer: 'D'
  },
  {
    id: 37, subject: 'Din Kültürü', questionNumber: 7,
    text: "Hz. Muhammed (s.a.v.), Hendek Savaşı'ndan önce şehrin savunulması konusunda sahabelerini toplamış ve onların fikirlerini almıştır. Selman-ı Farisi'nin 'Şehrin etrafına hendek kazalım.' fikri benimsenmiş ve uygulanmıştır.\nBu olay, Hz. Muhammed'in hangi özelliğini vurgulamaktadır?",
    options: {
      A: "Cesaretini ve kararlılığını",
      B: "Merhametli ve affedici oluşunu",
      C: "Danışarak (İstişare ile) iş yapmasını",
      D: "Adalete verdiği önemi"
    },
    correctAnswer: 'C'
  },
  {
    id: 38, subject: 'Din Kültürü', questionNumber: 8,
    text: "Mekkeliler, Hz. Muhammed'e peygamberlik gelmeden önce de ona değerli eşyalarını emanet eder ve ona yalan söylemediği için 'Muhammedü'l-Emin' (Güvenilir Muhammed) derlerdi.\nAşağıdaki ayetlerden hangisi Hz. Peygamber'in bu özelliğiyle doğrudan ilişkilidir?",
    options: {
      A: "'Emrolunduğun gibi dosdoğru ol.' (Hûd, 112)",
      B: "'Biz seni ancak âlemlere rahmet olarak gönderdik.' (Enbiya, 107)",
      C: "'Yaratan Rabbinin adıyla oku!' (Alak, 1)",
      D: "'Eğer kaba, katı yürekli olsaydın, onlar senin etrafından dağılıp giderlerdi.' (Âl-i İmrân, 159)"
    },
    correctAnswer: 'A'
  },
  {
    id: 39, subject: 'Din Kültürü', questionNumber: 9,
    text: "İslam'da insanın ölümünden sonra da ona sevap kazandırmaya devam eden, toplumun faydalandığı kalıcı hayır işlerine (okul, hastane, çeşme yaptırmak gibi) 'Sadaka-i Cariye' denir.\nAşağıdakilerden hangisi Sadaka-i Cariye kapsamında değerlendirilemez?",
    options: {
      A: "Öğrencilerin faydalanması için kütüphane inşa ettirmek",
      B: "Yolcuların su ihtiyacı için köye çeşme yaptırmak",
      C: "Bir fakirin bir aylık mutfak masrafını karşılamak",
      D: "Meyvesinden herkesin yiyebileceği fidanlar dikmek"
    },
    correctAnswer: 'C'
  },
  {
    id: 40, subject: 'Din Kültürü', questionNumber: 10,
    text: "'Allah'tan başka hiçbir ilah yoktur. O daima diridir (Hayy), bütün varlığın idaresini yürüten (Kayyum)'dir. Onu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa hepsi O'nundur...'\nMeali verilen ve Allah'ın yüce sıfatlarını anlatan bu ayet aşağıdakilerden hangisidir?",
    options: {
      A: "İhlas Suresi",
      B: "Ayet el-Kürsi",
      C: "Fatiha Suresi",
      D: "Asr Suresi"
    },
    correctAnswer: 'B'
  },

  // İNGİLİZCE
  {
    id: 41, subject: 'İngilizce', questionNumber: 1,
    text: "Jack: We are organizing a bowling tournament on Sunday afternoon. Would you like to join us?\nMark: I'd love to, but my cousins are coming to visit us that day.\nAccording to the dialogue, Mark _______.",
    options: {
      A: "accepts the invitation and asks for details",
      B: "refuses the offer without giving any reason",
      C: "apologizes and gives an excuse for not attending",
      D: "invites his cousins to the bowling tournament"
    },
    correctAnswer: 'C'
  },
  {
    id: 42, subject: 'İngilizce', questionNumber: 2,
    text: "Researchers asked 100 teens about their favourite communication methods. Here are the results:\nTexting: %45, Social Media: %35, Phone Calls: %15, Video Chats: %5\nAccording to the chart above, which of the following is CORRECT?",
    options: {
      A: "Half of the teens prefer making phone calls to texting.",
      B: "Texting messages is the most popular way of communication.",
      C: "Using social media is less popular than making video chats.",
      D: "Teens never use video chats to communicate."
    },
    correctAnswer: 'B'
  },
  {
    id: 43, subject: 'İngilizce', questionNumber: 3,
    text: "How to Make a Tasty Omelette:\nFirst, crack two eggs into a bowl and whisk them.\nSecond, put some butter into a pan and heat it.\nThen, pour the mixture into the pan and cook for 3 minutes.\nFinally, add some cheese and serve it hot.\nWhich step comes BEFORE cooking the mixture?",
    options: {
      A: "Adding some cheese on it",
      B: "Serving it hot on a plate",
      C: "Heating some butter in a pan",
      D: "Cracking the eggs into a bowl"
    },
    correctAnswer: 'C'
  },
  {
    id: 44, subject: 'İngilizce', questionNumber: 4,
    text: "Secretary: Hello, Mr. Green's office. How can I help you?\nMr. Smith: Hello. Could you put me through to Mr. Green, please?\nSecretary: Let me check... I'm sorry, _______. Would you like to leave a message?\nWhich of the following completes the dialogue appropriately?",
    options: {
      A: "his line is engaged at the moment",
      B: "I will connect you immediately",
      C: "he is waiting for your call",
      D: "hold the line, I'll get him"
    },
    correctAnswer: 'A'
  },
  {
    id: 45, subject: 'İngilizce', questionNumber: 5,
    text: "The Internet is very useful, but you must be careful about your safety. There are some rules you should follow:\nI. Create strong passwords.\nII. Share your personal information with online friends.\nIII. Don't click on strange links or pop-ups.\nIV. Refuse unknown people's friend requests.\nWhich rule above is DANGEROUS for internet safety?",
    options: { A: "I", B: "II", C: "III", D: "IV" },
    correctAnswer: 'B'
  },
  {
    id: 46, subject: 'İngilizce', questionNumber: 6,
    text: "David: I prefer extreme sports to indoor sports because I love adrenaline. Bungee jumping and skydiving are my favourites. I think they are fascinating.\nAccording to the text, David _______.",
    options: {
      A: "is an adventure seeker who likes taking risks",
      B: "thinks extreme sports are boring and ridiculous",
      C: "prefers safe and relaxing activities",
      D: "hates experiencing high-adrenaline sports"
    },
    correctAnswer: 'A'
  },
  {
    id: 47, subject: 'İngilizce', questionNumber: 7,
    text: "Mary: I like visiting ancient ruins and exploring historic architecture on my holidays. I don't enjoy lying on the beach or swimming.\nWhere should Mary go for her next holiday?",
    options: {
      A: "A seaside resort in Antalya",
      B: "Göbeklitepe archaeological site in Şanlıurfa",
      C: "A modern shopping mall in New York",
      D: "A skiing center in Erzurum"
    },
    correctAnswer: 'B'
  },
  {
    id: 48, subject: 'İngilizce', questionNumber: 8,
    text: "In the Taylor family, everybody shares the household chores. Mr. Taylor vacuums the floor, Mrs. Taylor cooks the meals. Their son, Tom, is responsible for taking out the garbage and loading the dishwasher.\nAccording to the text, whose responsibility is related to the kitchen?",
    options: {
      A: "Only Mr. Taylor",
      B: "Both Mrs. Taylor and Tom",
      C: "Only Tom",
      D: "Mr. and Mrs. Taylor"
    },
    correctAnswer: 'B'
  },
  {
    id: 49, subject: 'İngilizce', questionNumber: 9,
    text: "Marie Curie was a great scientist. She was born in 1867. She discovered radium and polonium. She won two Nobel Prizes in Physics and Chemistry. Her discoveries changed the medical world.\nWhich question DOES NOT have an answer in the text?",
    options: {
      A: "What were her scientific achievements?",
      B: "When was she born?",
      C: "How many prizes did she win?",
      D: "Where did she study university?"
    },
    correctAnswer: 'D'
  },
  {
    id: 50, subject: 'İngilizce', questionNumber: 10,
    text: "Reporter: What are the most threatening natural forces for our planet today?\nScientist: Global warming is the worst. It causes severe droughts, melting glaciers, and unexpected climate changes. We must reduce carbon emissions immediately.\nWhat is the scientist mainly talking about?",
    options: {
      A: "The benefits of using fossil fuels",
      B: "The negative effects of global warming",
      C: "How to survive during an earthquake",
      D: "The history of natural disasters"
    },
    correctAnswer: 'B'
  }
];
