import { Subject } from '../types';

export interface LGSQuestion {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const LGS_2026_QUESTIONS: LGSQuestion[] = [
  // TÜRKÇE (10)
  {
    id: "turkce-1",
    subject: "Türkçe",
    topic: "Sözcükte Anlam",
    question: "Aşağıdaki cümlelerin hangisinde 'kırmak' sözcüğü 'gücünü, etkisini azaltmak' anlamında kullanılmıştır?",
    options: [
      "A) Odunları kırıp sobaya attı.",
      "B) Soğuk rüzgar fırtınanın hızını kırdı.",
      "C) Söylediği ağır sözlerle kalbimi kırdı.",
      "D) Bardağı elinden düşürüp kırdı."
    ],
    correctAnswer: 1,
    explanation: "'Kırmak' sözcüğü B seçeneğinde rüzgarın hızını, etkisini azaltmak mecaz anlamında kullanılmıştır."
  },
  {
    id: "turkce-2",
    subject: "Türkçe",
    topic: "Cümlede Anlam",
    question: "Aşağıdaki cümlelerin hangisinde neden-sonuç ilişkisi vardır?",
    options: [
      "A) Sınavı kazanmak için çok çalışıyor.",
      "B) Yağmur yağdığı için maç iptal oldu.",
      "C) Yarın hava güzel olursa pikniğe gideriz.",
      "D) Kitap okumayı her şeyden çok severim."
    ],
    correctAnswer: 1,
    explanation: "B seçeneğinde maçın iptal olmasının nedeni yağmurun yağmasıdır (neden-sonuç). A seçeneği amaç-sonuç, C seçeneği koşul-sonuç cümlesidir."
  },
  {
    id: "turkce-3",
    subject: "Türkçe",
    topic: "Paragrafta Anlam",
    question: "Kitaplar, sessiz öğretmenlerdir. Bize bilmediğimiz dünyaların kapılarını aralar, farklı hayatları tecrübe etmemizi sağlarlar. Bir roman okurken kendimizi kahramanın yerine koyar, onunla ağlar onunla güleriz. Bu sayede empati yeteneğimiz gelişir.\n\nBu paragrafın ana düşüncesi aşağıdakilerden hangisidir?",
    options: [
      "A) Kitap okumak boş zamanları değerlendirmenin en iyi yoludur.",
      "B) Sadece roman okumak insanın hayal gücünü geliştirir.",
      "C) Kitaplar insanı geliştirir ve başkalarını anlama becerisi kazandırır.",
      "D) Öğretmenler kitaplardan daha faydalıdır."
    ],
    correctAnswer: 2,
    explanation: "Paragrafta kitapların bize yeni dünyalar açtığı ve empati yeteneğimizi geliştirdiği vurgulanmaktadır. Bu nedenle ana düşünce C seçeneğidir."
  },
  {
    id: "turkce-4",
    subject: "Türkçe",
    topic: "Fiilimsiler",
    question: "'Koşarak gelen çocuk, elindeki paketi masaya bırakıp hızla uzaklaştı.'\n\nBu cümlede yer alan fiilimsilerin türleri sırasıyla aşağıdakilerin hangisinde doğru verilmiştir?",
    options: [
      "A) Zarf-fiil / Sıfat-fiil / Zarf-fiil",
      "B) İsim-fiil / Sıfat-fiil / Zarf-fiil",
      "C) Zarf-fiil / İsim-fiil / Sıfat-fiil",
      "D) Sıfat-fiil / Zarf-fiil / İsim-fiil"
    ],
    correctAnswer: 0,
    explanation: "'Koşarak' (zarf-fiil: -arak), 'gelen' (sıfat-fiil: -en), 'bırakıp' (zarf-fiil: -ıp). Doğru sıralama Zarf-fiil, Sıfat-fiil, Zarf-fiil şeklindedir."
  },
  {
    id: "turkce-5",
    subject: "Türkçe",
    topic: "Cümlenin Ögeleri",
    question: "'Güneş, sabahın erken saatlerinde odamı aydınlattı.'\n\nBu cümlenin öge dizilişi aşağıdakilerden hangisidir?",
    options: [
      "A) Özne - Belirtili Nesne - Zarf Tümleci - Yüklem",
      "B) Özne - Zarf Tümleci - Belirtili Nesne - Yüklem",
      "C) Belirtisiz Nesne - Zarf Tümleci - Özne - Yüklem",
      "D) Zarf Tümleci - Özne - Belirtili Nesne - Yüklem"
    ],
    correctAnswer: 1,
    explanation: "Aydınlattı (Yüklem). Aydınlatan ne? Güneş (Özne). Ne zaman aydınlattı? Sabahın erken saatlerinde (Zarf Tümleci). Nereyi aydınlattı? Odamı (Belirtili Nesne)."
  },
  {
    id: "turkce-6",
    subject: "Türkçe",
    topic: "Yazım Kuralları",
    question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
    options: [
      "A) Türk Dil Kurumunun yeni sözlüğü yayımlandı.",
      "B) 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı coşkuyla kutlandı.",
      "C) Kedimiz Minnoş bütün gün uyudu.",
      "D) Yarınki toplantıya Ahmet Bey'de katılacakmış."
    ],
    correctAnswer: 3,
    explanation: "D seçeneğinde 'Ahmet Bey'de' ifadesindeki 'de' bağlaçtır ve ayrı yazılmalıdır ('Ahmet Bey de'). Kurum adlarına gelen ekler kesme işaretiyle ayrılmaz (A şıkkı doğrudur)."
  },
  {
    id: "turkce-7",
    subject: "Türkçe",
    topic: "Noktalama İşaretleri",
    question: "Pazardan elma( ) armut( ) muz ve çilek aldım( )\n\nBu cümlede yay ayraçla belirtilen yerlere sırasıyla hangi noktalama işaretleri getirilmelidir?",
    options: [
      "A) (,) (;) (.)",
      "B) (,) (,) (.)",
      "C) (;) (,) (!)",
      "D) (,) (,) (...)"
    ],
    correctAnswer: 1,
    explanation: "Eş görevli kelimeleri ayırmak için virgül (,) kullanılır. Cümlenin sonuna ise nokta (.) konur. Doğru sıralama: (,) (,) (.)"
  },
  {
    id: "turkce-8",
    subject: "Türkçe",
    topic: "Metin Türleri",
    question: "Yazarın herhangi bir konudaki kişisel görüşlerini, kesin kurallara varmadan, samimi bir dille okuyucuyla dertleşiyormuş gibi anlattığı yazı türüne ne ad verilir?",
    options: [
      "A) Makale",
      "B) Deneme",
      "C) Fıkra",
      "D) Eleştiri"
    ],
    correctAnswer: 1,
    explanation: "Kişisel görüşlerin samimi bir dille, kanıtlama amacı güdülmeden yazıldığı yazı türü 'Deneme'dir."
  },
  {
    id: "turkce-9",
    subject: "Türkçe",
    topic: "Söz Sanatları",
    question: "'Köyün yaşlı çınarı, rüzgarda hüzünlü hüzünlü fısıldıyordu.'\n\nBu cümlede aşağıdaki söz sanatlarından hangisi kullanılmıştır?",
    options: [
      "A) Benzetme (Teşbih)",
      "B) Abartma (Mübalağa)",
      "C) Kişileştirme (Teşhis)",
      "D) Karşıtlık (Tezat)"
    ],
    correctAnswer: 2,
    explanation: "Çınar ağacına insana ait olan 'hüzünlü fısıldama' özelliği verilerek kişileştirme (teşhis) sanatı yapılmıştır."
  },
  {
    id: "turkce-10",
    subject: "Türkçe",
    topic: "Sözel Mantık",
    question: "Ali, Burak, Can, Deniz ve Emre bir yarışta ilk 5 sırayı paylaşmıştır.\n- Ali yarışı Can'dan hemen önce bitirmiştir.\n- Deniz yarışı 3. sırada tamamlamıştır.\n- Emre yarışı sonuncu bitirmemiştir.\n\nBuna göre yarışı 1. sırada bitiren kişi aşağıdakilerden hangisi olabilir?",
    options: [
      "A) Ali",
      "B) Can",
      "C) Deniz",
      "D) Emre"
    ],
    correctAnswer: 3,
    explanation: "Deniz 3. sırada. Ali ve Can peş peşe (Ali, Can). Emre sonuncu değil. Sıralama Emre(1), Ali(2), Can(3-Olamaz çünkü Deniz 3), demek ki Ali(4), Can(5). Emre 1. veya 2. olabilir. Şıklarda Emre 1. olabilir."
  },

  // MATEMATİK (10)
  {
    id: "mat-1",
    subject: "Matematik",
    topic: "Çarpanlar ve Katlar",
    question: "Bir hastanedeki iki doktordan biri 15 günde bir, diğeri 20 günde bir nöbet tutmaktadır. İkisi birlikte aynı gün nöbet tuttuktan en az kaç gün sonra tekrar birlikte nöbet tutarlar?",
    options: ["A) 30", "B) 45", "C) 60", "D) 120"],
    correctAnswer: 2,
    explanation: "Bu bir EKOK problemidir. 15 ve 20'nin en küçük ortak katı (EKOK) 60'tır."
  },
  {
    id: "mat-2",
    subject: "Matematik",
    topic: "Üslü İfadeler",
    question: "2⁵ × 4³ işleminin sonucu aşağıdakilerden hangisine eşittir?",
    options: ["A) 2⁸", "B) 2¹¹", "C) 8⁸", "D) 8¹⁵"],
    correctAnswer: 1,
    explanation: "4³ = (2²)³ = 2⁶. İşlem 2⁵ × 2⁶ haline gelir. Tabanlar aynıyken üsler toplanır: 5 + 6 = 11. Sonuç 2¹¹."
  },
  {
    id: "mat-3",
    subject: "Matematik",
    topic: "Kareköklü İfadeler",
    question: "√48 + √27 - √12 işleminin sonucu aşağıdakilerden hangisidir?",
    options: ["A) 3√3", "B) 4√3", "C) 5√3", "D) 6√3"],
    correctAnswer: 2,
    explanation: "√48 = 4√3, √27 = 3√3, √12 = 2√3. İşlem: 4√3 + 3√3 - 2√3 = 5√3."
  },
  {
    id: "mat-4",
    subject: "Matematik",
    topic: "Veri Analizi",
    question: "Bir okuldaki 360 öğrencinin sevdiği meyvelere göre dağılımı daire grafiğinde gösterilmiştir. Elma seven öğrencilerin diliminin merkez açısı 120° olduğuna göre, bu okulda elma seven kaç öğrenci vardır?",
    options: ["A) 80", "B) 100", "C) 120", "D) 150"],
    correctAnswer: 2,
    explanation: "360°'lik daire grafiği 360 öğrenciyi temsil ediyorsa, 1° = 1 öğrenci demektir. 120° = 120 öğrenci."
  },
  {
    id: "mat-5",
    subject: "Matematik",
    topic: "Olasılık",
    question: "İçinde renkleri dışında özdeş 3 kırmızı, 4 mavi ve 5 yeşil top bulunan bir torbadan rastgele çekilen bir topun mavi olma olasılığı kaçtır?",
    options: ["A) 1/4", "B) 1/3", "C) 5/12", "D) 1/2"],
    correctAnswer: 1,
    explanation: "Toplam top sayısı = 3 + 4 + 5 = 12. Mavi top sayısı = 4. Olasılık = İstenen Durum / Tüm Durumlar = 4 / 12 = 1 / 3."
  },
  {
    id: "mat-6",
    subject: "Matematik",
    topic: "Cebirsel İfadeler",
    question: "(2x - 3)² ifadesinin özdeşi aşağıdakilerden hangisidir?",
    options: [
      "A) 4x² - 9",
      "B) 4x² + 9",
      "C) 4x² - 6x + 9",
      "D) 4x² - 12x + 9"
    ],
    correctAnswer: 3,
    explanation: "Tam kare açılımı: (a - b)² = a² - 2ab + b². (2x)² - 2(2x)(3) + 3² = 4x² - 12x + 9."
  },
  {
    id: "mat-7",
    subject: "Matematik",
    topic: "Doğrusal Denklemler",
    question: "2x - 3y = 12 doğrusunun x eksenini kestiği noktanın koordinatları aşağıdakilerden hangisidir?",
    options: ["A) (0, -4)", "B) (6, 0)", "C) (-4, 0)", "D) (0, 6)"],
    correctAnswer: 1,
    explanation: "Bir doğrunun x eksenini kestiği noktayı bulmak için y = 0 verilir. 2x - 3(0) = 12 => 2x = 12 => x = 6. Nokta (6, 0)'dır."
  },
  {
    id: "mat-8",
    subject: "Matematik",
    topic: "Eşitsizlikler",
    question: "3x - 5 ≤ 10 eşitsizliğini sağlayan en büyük x tam sayısı kaçtır?",
    options: ["A) 3", "B) 4", "C) 5", "D) 6"],
    correctAnswer: 2,
    explanation: "3x - 5 ≤ 10 => 3x ≤ 15 => x ≤ 5. x'in alabileceği en büyük tam sayı değeri 5'tir."
  },
  {
    id: "mat-9",
    subject: "Matematik",
    topic: "Üçgenler",
    question: "Dik kenar uzunlukları 6 cm ve 8 cm olan bir dik üçgenin hipotenüs uzunluğu kaç cm'dir?",
    options: ["A) 10", "B) 12", "C) 14", "D) 100"],
    correctAnswer: 0,
    explanation: "Pisagor bağıntısına göre: a² + b² = c². 6² + 8² = c² => 36 + 64 = 100 => c² = 100 => c = 10 cm."
  },
  {
    id: "mat-10",
    subject: "Matematik",
    topic: "Dönüşüm Geometrisi",
    question: "Koordinat sisteminde A(2, 5) noktasının x eksenine göre yansıması olan noktanın koordinatları aşağıdakilerden hangisidir?",
    options: ["A) (-2, 5)", "B) (2, -5)", "C) (-2, -5)", "D) (5, 2)"],
    correctAnswer: 1,
    explanation: "Bir noktanın x eksenine göre yansıması alındığında apsisi (x) değişmez, ordinatının (y) işareti değişir. A(2, 5) -> A'(2, -5)."
  },

  // FEN BİLİMLERİ (10)
  {
    id: "fen-1",
    subject: "Fen Bilimleri",
    topic: "Mevsimler ve İklim",
    question: "Dünya'nın Güneş etrafındaki dolanımı ve eksen eğikliği sonucunda aşağıdakilerden hangisi gerçekleşmez?",
    options: [
      "A) Mevsimlerin oluşması",
      "B) Gece ve gündüz sürelerinin değişmesi",
      "C) Güneş ışınlarının geliş açısının değişmesi",
      "D) Gece ve gündüzün ardalanması (birbirini takip etmesi)"
    ],
    correctAnswer: 3,
    explanation: "Gece ve gündüzün ardalanması Dünya'nın kendi ekseni etrafında dönmesinin sonucudur, eksen eğikliğinin değil."
  },
  {
    id: "fen-2",
    subject: "Fen Bilimleri",
    topic: "DNA ve Genetik Kod",
    question: "Sağlıklı bir DNA molekülünde aşağıda verilen eşitliklerden hangisi her zaman doğru değildir?",
    options: [
      "A) Adenin sayısı = Timin sayısı",
      "B) Guanin sayısı = Sitozin sayısı",
      "C) Toplam Şeker sayısı = Toplam Fosfat sayısı",
      "D) Adenin sayısı = Guanin sayısı"
    ],
    correctAnswer: 3,
    explanation: "DNA'da Adenin daima Timin ile, Guanin daima Sitozin ile eşleşir. Ancak Adenin sayısının Guanin sayısına eşit olma zorunluluğu yoktur."
  },
  {
    id: "fen-3",
    subject: "Fen Bilimleri",
    topic: "Basınç",
    question: "Özdeş tuğlalar kullanılarak yapılan deneyde, tuğlanın yatay ve dikey konulmasıyla zemine yapılan basınçlar ölçülüyor. Bu deneyin bağımsız değişkeni aşağıdakilerden hangisidir?",
    options: [
      "A) Cismin ağırlığı",
      "B) Yüzey alanı",
      "C) Zemine yapılan basınç",
      "D) Tuğlanın cinsi"
    ],
    correctAnswer: 1,
    explanation: "Deneyi yapan kişinin bilerek değiştirdiği değişkene bağımsız değişken denir. Burada tuğlanın konumu değiştirilerek yüzey alanı değiştirilmiştir."
  },
  {
    id: "fen-4",
    subject: "Fen Bilimleri",
    topic: "Madde ve Endüstri",
    question: "Aşağıdakilerden hangisi kimyasal bir değişime örnektir?",
    options: [
      "A) Suyun buharlaşması",
      "B) Camın kırılması",
      "C) Demirin paslanması",
      "D) Şekerin suda çözünmesi"
    ],
    correctAnswer: 2,
    explanation: "Demirin paslanması (oksitlenme) maddenin iç yapısını değiştiren kimyasal bir olaydır. Diğerleri fiziksel değişimdir."
  },
  {
    id: "fen-5",
    subject: "Fen Bilimleri",
    topic: "Asitler ve Bazlar",
    question: "pH değeri 2 olan bir çözelti ile ilgili aşağıdakilerden hangisi yanlıştır?",
    options: [
      "A) Kuvvetli bir asittir.",
      "B) Mavi turnusol kağıdını kırmızıya çevirir.",
      "C) Sulu çözeltilerine OH- (hidroksit) iyonu verir.",
      "D) Tatları ekşidir."
    ],
    correctAnswer: 2,
    explanation: "pH değeri 7'den küçük olanlar asittir. Asitler sulu çözeltilerine H+ (hidrojen) iyonu verirler. OH- iyonu verenler bazlardır."
  },
  {
    id: "fen-6",
    subject: "Fen Bilimleri",
    topic: "Basit Makineler",
    question: "Sabit makaralarla ilgili aşağıda verilen bilgilerden hangisi doğrudur?",
    options: [
      "A) Kuvvetten kazanç sağlar.",
      "B) Yoldan kazanç sağlar.",
      "C) Sadece kuvvetin yönünü değiştirerek iş kolaylığı sağlar.",
      "D) İşten kazanç sağlar."
    ],
    correctAnswer: 2,
    explanation: "Sabit makaralarda kuvvetten veya yoldan kazanç yoktur. Sadece kuvvetin yönünü değiştirerek iş yapma kolaylığı sağlarlar. Hiçbir basit makine işten kazanç sağlamaz."
  },
  {
    id: "fen-7",
    subject: "Fen Bilimleri",
    topic: "Enerji Dönüşümleri",
    question: "Fotosentez olayı ile ilgili aşağıdakilerden hangisi yanlıştır?",
    options: [
      "A) Sadece ışıklı ortamda gerçekleşir.",
      "B) Karbondioksit ve su kullanılır.",
      "C) Oksijen ve besin üretilir.",
      "D) Tüm canlılar tarafından gerçekleştirilir."
    ],
    correctAnswer: 3,
    explanation: "Fotosentezi sadece klorofil taşıyan canlılar (üreticiler; bitkiler, siyanobakteriler, bazı algler) gerçekleştirebilir. Tüm canlılar yapamaz."
  },
  {
    id: "fen-8",
    subject: "Fen Bilimleri",
    topic: "Madde Döngüleri",
    question: "Havadaki serbest azot gazını (N2) toprağa bağlayarak bitkilerin kullanabileceği hale getiren canlı grubu aşağıdakilerden hangisidir?",
    options: [
      "A) Ayrıştırıcı mantarlar",
      "B) Azot bağlayıcı bakteriler",
      "C) Otçul hayvanlar",
      "D) Yeşil bitkiler"
    ],
    correctAnswer: 1,
    explanation: "Havadaki serbest azotu toprağa bağlama işlevini baklagillerin köklerinde yaşayan azot bağlayıcı bakteriler ve şimşek/yıldırım olayları gerçekleştirir."
  },
  {
    id: "fen-9",
    subject: "Fen Bilimleri",
    topic: "Sıvı Basıncı",
    question: "Sıvı basıncı aşağıdakilerden hangisine bağlı değildir?",
    options: [
      "A) Sıvının derinliğine",
      "B) Sıvının yoğunluğuna",
      "C) Kabın şekline",
      "D) Yer çekimi ivmesine"
    ],
    correctAnswer: 2,
    explanation: "Sıvı basıncı derinlik (h), yoğunluk (d) ve yer çekimi ivmesine (g) bağlıdır (P=h.d.g). Kabın şekline veya sıvı miktarına bağlı değildir."
  },
  {
    id: "fen-10",
    subject: "Fen Bilimleri",
    topic: "Periyodik Sistem",
    question: "Periyodik sistemde 8A grubunda yer alan elementlere ne ad verilir?",
    options: [
      "A) Alkali metaller",
      "B) Toprak alkali metaller",
      "C) Halojenler",
      "D) Soygazlar (Asalgazlar)"
    ],
    correctAnswer: 3,
    explanation: "Periyodik tablonun en sağında bulunan 8A grubu elementlerine soygazlar (asalgazlar) denir. Kararlı yapıdadırlar."
  },

  // İNKILAP TARİHİ (10)
  {
    id: "inkilap-1",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Bir Kahraman Doğuyor",
    question: "Mustafa Kemal'in fikir hayatının gelişmesinde ve milliyetçilik duygularının pekişmesinde etkili olan, lise eğitimini aldığı şehir aşağıdakilerden hangisidir?",
    options: ["A) Selanik", "B) Manastır", "C) İstanbul", "D) Sofya"],
    correctAnswer: 1,
    explanation: "Mustafa Kemal, Manastır Askeri İdadisi'nde okurken Namık Kemal, Mehmet Emin Yurdakul gibi şairlerden etkilenmiş ve milliyetçilik duyguları gelişmiştir."
  },
  {
    id: "inkilap-2",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "I. Dünya Savaşı",
    question: "Osmanlı Devleti'nin I. Dünya Savaşı'nda kendi toprakları dışında müttefiklerine yardım etmek amacıyla savaştığı cepheler aşağıdakilerden hangisinde doğru verilmiştir?",
    options: [
      "A) Çanakkale - Suriye - Irak",
      "B) Kafkas - Kanal",
      "C) Galiçya - Romanya - Makedonya",
      "D) Hicaz - Yemen"
    ],
    correctAnswer: 2,
    explanation: "Osmanlı Devleti'nin sınırları dışında müttefiklerine (Almanya, Avusturya-Macaristan) yardım ettiği cepheler Galiçya, Romanya ve Makedonya cepheleridir."
  },
  {
    id: "inkilap-3",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Milli Uyanış",
    question: "Milli Mücadele döneminde tüm yararlı cemiyetlerin 'Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti' adı altında birleştirildiği kongre aşağıdakilerden hangisidir?",
    options: ["A) Erzurum Kongresi", "B) Sivas Kongresi", "C) Amasya Genelgesi", "D) Havza Genelgesi"],
    correctAnswer: 1,
    explanation: "Milli birliği sağlamak ve mücadeleyi tek merkezden yönetmek amacıyla tüm cemiyetler Sivas Kongresi'nde birleştirilmiştir."
  },
  {
    id: "inkilap-4",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Milli Bir Destan",
    question: "Kurtuluş Savaşı'nın askeri safhasını sona erdiren ve diplomatik safhasını başlatan antlaşma aşağıdakilerden hangisidir?",
    options: ["A) Sevr Antlaşması", "B) Gümrü Antlaşması", "C) Mudanya Ateşkes Antlaşması", "D) Lozan Barış Antlaşması"],
    correctAnswer: 2,
    explanation: "Büyük Taarruz'un başarıyla sonuçlanmasının ardından imzalanan Mudanya Ateşkes Antlaşması ile sıcak savaş dönemi bitmiş, diplomatik dönem başlamıştır."
  },
  {
    id: "inkilap-5",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Atatürkçülük",
    question: "'Egemenlik kayıtsız şartsız milletindir.' sözü Atatürk'ün hangi ilkesiyle doğrudan ilişkilidir?",
    options: ["A) Cumhuriyetçilik", "B) Milliyetçilik", "C) Devletçilik", "D) Laiklik"],
    correctAnswer: 0,
    explanation: "Milli egemenlik, halkın kendi kendini yönetmesi kavramları doğrudan Cumhuriyetçilik ilkesinin temelini oluşturur."
  },
  {
    id: "inkilap-6",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Atatürk İlkeleri",
    question: "Eğitim ve öğretimde birliğin sağlanması, medreselerin kapatılarak tüm okulların Milli Eğitim Bakanlığı'na bağlanması hangi kanun ile gerçekleşmiştir?",
    options: ["A) Teşkilat-ı Esasiye", "B) Tevhid-i Tedrisat", "C) Takrir-i Sükun", "D) Kabotaj Kanunu"],
    correctAnswer: 1,
    explanation: "3 Mart 1924'te kabul edilen Tevhid-i Tedrisat (Öğretim Birliği) Kanunu ile eğitimde birlik sağlanmıştır."
  },
  {
    id: "inkilap-7",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Dış Politika",
    question: "Türkiye'nin Boğazlar üzerindeki tam egemenliğini sağlayan ve Boğazlar Komisyonu'nu kaldıran uluslararası antlaşma aşağıdakilerden hangisidir?",
    options: ["A) Lozan Barış Antlaşması", "B) Ankara Antlaşması", "C) Montrö Boğazlar Sözleşmesi", "D) Sadabat Paktı"],
    correctAnswer: 2,
    explanation: "1936 yılında imzalanan Montrö Boğazlar Sözleşmesi ile Boğazlar Komisyonu kaldırılmış ve savunma hakkı tamamen Türkiye'ye geçmiştir."
  },
  {
    id: "inkilap-8",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Demokratikleşme",
    question: "Türkiye Cumhuriyeti'nde çok partili hayata geçiş denemeleri kapsamında kurulan ilk muhalefet partisi aşağıdakilerden hangisidir?",
    options: ["A) Cumhuriyet Halk Fırkası", "B) Terakkiperver Cumhuriyet Fırkası", "C) Serbest Cumhuriyet Fırkası", "D) Demokrat Parti"],
    correctAnswer: 1,
    explanation: "Kazım Karabekir ve arkadaşları tarafından kurulan Terakkiperver Cumhuriyet Fırkası, Türkiye'nin ilk muhalefet partisidir."
  },
  {
    id: "inkilap-9",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Milli Mücadele",
    question: "Amasya Genelgesi'nde yer alan 'Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır.' maddesi Milli Mücadele'nin hangi özelliğini belirtir?",
    options: ["A) Gerekçesini", "B) Amacını ve Yöntemini", "C) Sonucunu", "D) Başlangıcını"],
    correctAnswer: 1,
    explanation: "Bu madde ile Kurtuluş Savaşı'nın amacı (milletin bağımsızlığını kurtarmak) ve yöntemi (milletin azim ve kararı ile) açıkça belirtilmiştir."
  },
  {
    id: "inkilap-10",
    subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
    topic: "Ekonomi",
    question: "1923 yılında toplanan İzmir İktisat Kongresi'nde alınan kararların genel adı aşağıdakilerden hangisidir?",
    options: ["A) Misak-ı Milli", "B) Misak-ı İktisadi", "C) Teşvik-i Sanayi", "D) Aşar Vergisi"],
    correctAnswer: 1,
    explanation: "İzmir İktisat Kongresi'nde milli ekonominin temellerini atmak için alınan kararlara Misak-ı İktisadi (Ekonomi Andı) denir."
  },

  // DİN KÜLTÜRÜ (10)
  {
    id: "din-1",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Kader İnancı",
    question: "İnsanın kendi özgür iradesiyle seçtiği, sorumlu olduğu davranış alanına ne ad verilir?",
    options: ["A) Külli İrade", "B) Tevekkül", "C) Cüzi İrade", "D) Rızık"],
    correctAnswer: 2,
    explanation: "Allah'ın sınırsız iradesine Külli İrade, insana verilen sınırlı ve seçme hakkı tanıyan iradeye ise Cüzi İrade denir."
  },
  {
    id: "din-2",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Zekat ve Sadaka",
    question: "İslam dinine göre aşağıdakilerden hangisine zekat verilemez?",
    options: ["A) Yoksullara", "B) Borçlulara", "C) Yolda kalmışlara", "D) Anne ve babaya"],
    correctAnswer: 3,
    explanation: "Kişi bakmakla yükümlü olduğu kişilere (anne, baba, eş, çocuk, torun) zekat veremez."
  },
  {
    id: "din-3",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Evrendeki Yasalar",
    question: "Suyun 100 derecede kaynaması, yer çekimi kanunu ve gezegenlerin yörüngelerindeki hareketi evrendeki hangi yasalar kapsamındadır?",
    options: ["A) Biyolojik Yasalar", "B) Toplumsal Yasalar", "C) Fiziksel Yasalar", "D) Kimyasal Yasalar"],
    correctAnswer: 2,
    explanation: "Madde ve enerjinin oluşumu, değişimi ve hareketi ile ilgili yasalara fiziksel yasalar denir."
  },
  {
    id: "din-4",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Peygamberler",
    question: "Peygamberlerin akıllı, zeki ve uyanık olmalarını ifade eden sıfat aşağıdakilerden hangisidir?",
    options: ["A) Sıdk", "B) Emanet", "C) Fetanet", "D) İsmet"],
    correctAnswer: 2,
    explanation: "Sıdk: Doğruluk, Emanet: Güvenilirlik, İsmet: Günahsızlık, Fetanet: Akıllı ve zeki olmak demektir."
  },
  {
    id: "din-5",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Kur'an-ı Kerim",
    question: "Kur'an-ı Kerim'in ilk inen ayetleri 'Oku!' emriyle başlar. Bu ayetler hangi surede yer almaktadır?",
    options: ["A) Fatiha", "B) Bakara", "C) Yasin", "D) Alak"],
    correctAnswer: 3,
    explanation: "Kur'an'ın ilk inen ayetleri Alak Suresi'nin ilk 5 ayetidir."
  },
  {
    id: "din-6",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Zekat ve Sadaka",
    question: "Sadece Allah rızası için yapılan maddi ve manevi her türlü iyiliğe ne ad verilir?",
    options: ["A) Zekat", "B) Sadaka", "C) Fitre", "D) Fidye"],
    correctAnswer: 1,
    explanation: "Sadaka, zekat gibi sadece maddi değil, gülümsemek, yardım etmek gibi manevi iyilikleri de kapsayan geniş bir kavramdır."
  },
  {
    id: "din-7",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Hz. Muhammed'in Örnekliği",
    question: "Hz. Muhammed'e (s.a.v.) peygamberlik verilmeden önce Mekkeliler tarafından dürüstlüğü ve güvenilirliği sebebiyle verilen lakap aşağıdakilerden hangisidir?",
    options: ["A) Hatemü'l-Enbiya", "B) Muhammed'ül Emin", "C) Resulullah", "D) Habibullah"],
    correctAnswer: 1,
    explanation: "Mekkeliler, dürüstlüğü ve emanetleri koruması nedeniyle ona 'Güvenilir Muhammed' anlamında Muhammed'ül Emin demişlerdir."
  },
  {
    id: "din-8",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Din ve Hayat",
    question: "İslam dininin korunmasını emrettiği beş temel esas (Zarurat-ı Diniyye) vardır. Alkol ve uyuşturucu gibi zararlı maddelerin yasaklanması bu esaslardan hangisinin korunmasıyla doğrudan ilgilidir?",
    options: ["A) Canın korunması", "B) Malın korunması", "C) Aklın korunması", "D) Neslin korunması"],
    correctAnswer: 2,
    explanation: "Alkol ve uyuşturucu insanın düşünme ve karar verme yetisini (aklını) bozduğu için 'aklın korunması' ilkesi gereği yasaklanmıştır."
  },
  {
    id: "din-9",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Sureler",
    question: "Yetimi itip kakan, yoksulu doyurmaya teşvik etmeyen ve namazlarında riya (gösteriş) yapanları kınayan sure aşağıdakilerden hangisidir?",
    options: ["A) İhlas Suresi", "B) Kevser Suresi", "C) Maun Suresi", "D) Asr Suresi"],
    correctAnswer: 2,
    explanation: "Maun Suresi, dini yalanlayanları, yetime kötü davrananları ve ibadetlerinde gösteriş yapanları anlatır."
  },
  {
    id: "din-10",
    subject: "Din Kültürü ve Ahlak Bilgisi",
    topic: "Kader İnancı",
    question: "Bir işi yaparken elden gelen tüm gayreti gösterip gerekli tedbirleri aldıktan sonra sonucu Allah'a bırakmaya ve O'na güvenmeye ne denir?",
    options: ["A) Tevekkül", "B) Şükür", "C) Sabır", "D) Kaza"],
    correctAnswer: 0,
    explanation: "Tevekkül, elinden geleni yaptıktan sonra Allah'a dayanıp güvenmek demektir."
  },

  // YABANCI DİL (10)
  {
    id: "ing-1",
    subject: "Yabancı Dil",
    topic: "Friendship",
    question: "Tom: Would you like to come to my birthday party on Sunday?\nJerry: ________. I have to study for my math exam.\n\nBoşluğa aşağıdakilerden hangisi gelmelidir?",
    options: [
      "A) That sounds great",
      "B) I'd love to, but I can't",
      "C) Sure, what time is it?",
      "D) Yes, I will be there"
    ],
    correctAnswer: 1,
    explanation: "Jerry'nin mazereti var ('I have to study...'). Bu yüzden teklifi kibarca reddetmesi gerekir: 'I'd love to, but I can't' (İsterdim ama yapamam)."
  },
  {
    id: "ing-2",
    subject: "Yabancı Dil",
    topic: "Teen Life",
    question: "I prefer reading books to watching TV.\n\nBu cümleye göre kişi için aşağıdakilerden hangisi doğrudur?",
    options: [
      "A) He hates reading books.",
      "B) He likes watching TV more than reading.",
      "C) He likes reading books more than watching TV.",
      "D) He never watches TV."
    ],
    correctAnswer: 2,
    explanation: "'Prefer X to Y' kalıbı X'i Y'ye tercih etmek demektir. Yani kitap okumayı televizyon izlemeye tercih ediyor."
  },
  {
    id: "ing-3",
    subject: "Yabancı Dil",
    topic: "In the Kitchen",
    question: "First, crack the eggs into a bowl. Second, whisk them. ________, pour the mixture into a hot pan.\n\nBoşluğa sıralama bildiren kelimelerden hangisi gelmelidir?",
    options: ["A) Finally", "B) After that", "C) Before", "D) Then"],
    correctAnswer: 3,
    explanation: "Sıralama kelimeleri: First, Second, Then / Next / After that, Finally. 'Second'dan sonra süreci devam ettiren 'Then' (Sonra) gelmesi uygundur."
  },
  {
    id: "ing-4",
    subject: "Yabancı Dil",
    topic: "On the Phone",
    question: "Secretary: Hello, Mr. Smith's office.\nCaller: Hello. Could you put me through to Mr. Smith, please?\nSecretary: ________. I'll connect you.\n\nBoşluğa hangisi gelmelidir?",
    options: [
      "A) Hang up the phone, please.",
      "B) Hold the line, please.",
      "C) He is not available right now.",
      "D) Can I take a message?"
    ],
    correctAnswer: 1,
    explanation: "Sekreter 'I'll connect you' (Sizi bağlıyorum) dediğine göre, öncesinde hatta beklemesini istemelidir: 'Hold the line, please'."
  },
  {
    id: "ing-5",
    subject: "Yabancı Dil",
    topic: "The Internet",
    question: "What does 'download' mean?",
    options: [
      "A) Transferring files from the internet to your computer.",
      "B) Sending an email to a friend.",
      "C) Transferring files from your computer to the internet.",
      "D) Creating a new password."
    ],
    correctAnswer: 0,
    explanation: "Download (İndirmek), internetten bilgisayara dosya aktarmak demektir. Bilgisayardan internete aktarmaya ise 'upload' denir."
  },
  {
    id: "ing-6",
    subject: "Yabancı Dil",
    topic: "Adventures",
    question: "Which of the following is a water sport?",
    options: ["A) Skydiving", "B) Scuba diving", "C) Rock climbing", "D) Bungee jumping"],
    correctAnswer: 1,
    explanation: "Scuba diving (tüplü dalış) bir su sporudur. Diğerleri hava veya doğa sporlarıdır."
  },
  {
    id: "ing-7",
    subject: "Yabancı Dil",
    topic: "Tourism",
    question: "If you stay at an 'all-inclusive' resort, it means ________.",
    options: [
      "A) you have to pay extra for food and drinks.",
      "B) only breakfast is included in the price.",
      "C) food, drinks, and activities are included in the price.",
      "D) you sleep in a tent."
    ],
    correctAnswer: 2,
    explanation: "'All-inclusive' her şey dahil demektir. Yiyecek, içecek ve aktivitelerin fiyata dahil olduğunu belirtir."
  },
  {
    id: "ing-8",
    subject: "Yabancı Dil",
    topic: "Chores",
    question: "Mother: Who is responsible for taking out the garbage?\nSon: It's my task, mom.\n\nAltı çizili ifadenin ('responsible for') anlamı nedir?",
    options: ["A) in charge of", "B) afraid of", "C) interested in", "D) good at"],
    correctAnswer: 0,
    explanation: "'Responsible for' bir şeyden sorumlu olmak demektir. Eş anlamlısı 'in charge of' ifadesidir."
  },
  {
    id: "ing-9",
    subject: "Yabancı Dil",
    topic: "Science",
    question: "Alexander Fleming ________ penicillin in 1928.",
    options: ["A) invented", "B) discovered", "C) explored", "D) designed"],
    correctAnswer: 1,
    explanation: "Penisilin doğada var olan bir şey olduğu için 'icat edilmez' (invent), 'keşfedilir' (discover). Bu yüzden 'discovered' kullanılmalıdır."
  },
  {
    id: "ing-10",
    subject: "Yabancı Dil",
    topic: "Natural Forces",
    question: "A sudden shaking of the ground is called an ________.",
    options: ["A) avalanche", "B) earthquake", "C) flood", "D) hurricane"],
    correctAnswer: 1,
    explanation: "Yerin aniden sarsılmasına deprem (earthquake) denir. Avalanche: Çığ, Flood: Sel, Hurricane: Kasırga."
  }
];
