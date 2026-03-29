import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumPaywall from '../components/PremiumPaywall';

const SUMMARIES = [
  {
    subject: "Matematik",
    topics: [
      {
        title: "Çarpanlar ve Katlar",
        content: "Bir pozitif tam sayıyı kalansız bölen pozitif tam sayılara o sayının çarpanları (bölenleri) denir. EBOB (En Büyük Ortak Bölen) ve EKOK (En Küçük Ortak Kat) problemleri LGS'de sıkça çıkar. EBOB genellikle 'bölme, parçalama, eşit aralıklarla ağaç dikme' sorularında; EKOK ise 'birleşme, beraber nöbet tutma, fayans kaplama' sorularında kullanılır."
      },
      {
        title: "Üslü İfadeler",
        content: "Tabanları aynı olan üslü ifadeler çarpılırken üsler toplanır, bölünürken üsler çıkarılır. Üssün üssü alınırken üsler çarpılır. Negatif üs, sayının çarpma işlemine göre tersini ifade eder. Çok büyük ve çok küçük sayılar bilimsel gösterimle (a x 10^n, 1 ≤ |a| < 10) ifade edilir."
      }
    ]
  },
  {
    subject: "Fen Bilimleri",
    topics: [
      {
        title: "Mevsimler ve İklim",
        content: "Mevsimlerin oluşmasının iki temel nedeni vardır: Dünya'nın Güneş etrafında dolanması ve Dünya'nın dönme ekseninin eğik olması (23° 27'). Eksen eğikliği olmasaydı, Güneş ışınlarının bir noktaya düşme açısı yıl boyunca değişmezdi ve mevsimler oluşmazdı."
      },
      {
        title: "DNA ve Genetik Kod",
        content: "DNA'nın yapı birimi nükleotiddir. Bir nükleotid; fosfat, deoksiriboz şekeri ve organik bazdan (Adenin, Timin, Guanin, Sitozin) oluşur. A ile T, G ile C eşleşir. Mutasyon genin yapısındaki, modifikasyon ise işleyişindeki (çevre etkisiyle) değişimdir."
      }
    ]
  },
  {
    subject: "Türkçe",
    topics: [
      {
        title: "Fiilimsiler (Eylemsiler)",
        content: "Fiil kök veya gövdelerine getirilen belirli eklerle türetilen; cümlede isim, sıfat veya zarf görevinde kullanılan kelimelerdir. Üçe ayrılır: İsim-fiil (-ma, -ış, -mak), Sıfat-fiil (-an, -ası, -mez, -ar, -dik, -ecek, -miş), Zarf-fiil (-ken, -alı, -asiye, -e, -meden, -ip, -erek, -dıkça, -meksizin, -dığında)."
      }
    ]
  }
];

export default function MiniSummaries() {
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === 'admin' || 
                  profile?.email?.toLowerCase() === 'selim388028@gmail.com' ||
                  user?.email?.toLowerCase() === 'selim388028@gmail.com';
  const [openSubject, setOpenSubject] = useState<string | null>("Matematik");
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  if (!profile?.isPremium && !isAdmin) {
    return <PremiumPaywall featureName="Mini Özetler" />;
  }

  const toggleSubject = (subject: string) => {
    if (openSubject === subject) {
      setOpenSubject(null);
    } else {
      setOpenSubject(subject);
      setOpenTopic(null);
    }
  };

  const toggleTopic = (topic: string) => {
    setOpenTopic(openTopic === topic ? null : topic);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mini Özetler</h1>
        <p className="text-slate-500">Hızlı tekrarlar için hap bilgiler.</p>
      </div>

      <div className="space-y-4">
        {SUMMARIES.map((subjectGroup) => (
          <div key={subjectGroup.subject} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleSubject(subjectGroup.subject)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">{subjectGroup.subject}</h2>
              </div>
              {openSubject === subjectGroup.subject ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {openSubject === subjectGroup.subject && (
              <div className="p-4 space-y-3">
                {subjectGroup.topics.map((topic) => (
                  <div key={topic.title} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleTopic(topic.title)}
                      className="w-full px-5 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-700">{topic.title}</span>
                      {openTopic === topic.title ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    
                    {openTopic === topic.title && (
                      <div className="px-5 py-4 bg-slate-50 text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                        {topic.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
