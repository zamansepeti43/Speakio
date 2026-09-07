# Speakio 🗣️

Speakio, **konuşarak dil öğrenme** üzerine kurulmuş mobil-first bir İngilizce öğrenme uygulamasıdır. Öğrenme döngüsü: ders → alıştırma → hata öğretimi → tekrar → dinleme → konuşma → ilerleme.

## Mevcut sürüm

- Ana sayfa, günlük hedef, XP ve streak
- A1 + A2 + B1 kurs katmanları
- **12 ünite / seviye**
- **Her ünite 10 etkin egzersiz**; kaynak JSON'da 4 çekirdek egzersiz, runtime loader bunları 10'a tamamlar
- Şu an A1+A2+B1 için **360 etkin egzersiz**
- Çoktan seçmeli, çeviri ve cümle kurma egzersizleri
- Yanlış cevapta doğru cevabı hemen gösterip öğretme; ders sonunda yanlışları tekrar etme
- Tamamlanmış derslerde replay XP/günlük hedef koruması
- Ünite bazlı ilerleme kilidi ve A1→A2→B1→B2→C1 seviye kilidi
- Dinleme alıştırmaları ve gerçek ekrandaki seçeneklerle doğrulama
- Kelime hafızası ve kayıtlı kelimeler
- Dilbilgisi özeti
- AI Speak: tarayıcı mikrofonu + konuşma metni + **0–100 yerel skor**
- Kural tabanlı konuşma koçu + opsiyonel OpenAI-compatible AI Coach
- Yanlış cevaplar için zamanlanmış tekrar: **10 dk → 1 → 3 → 7 → 14 → 30 gün**
- Günlük mini görevler ve yerel tarih bazlı streak
- Başarımlar, profil ve analytics
- İlerlemeyi JSON olarak dışa/içe aktarma
- LocalStorage ile cihaz içi kalıcı ilerleme
- Responsive mobil/masaüstü arayüz
- PWA manifest + offline Service Worker
- Local premium entitlement altyapısı
- Otomatik GitHub Actions QA

## Müfredat mimarisi

Her seviye aynı içerik sözleşmesini kullanır:

- 12 ünite
- öğrenme hedefi
- kelime listesi
- grammar odağı
- hedef cümleler + Türkçe anlamları
- diyalog
- listening cümleleri
- speaking görevleri
- 4 çekirdek egzersiz + runtime'da 10 egzersiz hedefi

Mevcut kaynaklar:

- `content/a1-curriculum.json`
- `content/a2-curriculum.json`
- `content/b1-curriculum.json`

B2 ve C1 için kurs altyapısı hazır; içerik üretimi sıradaki müfredat adımıdır.

## İlerleme sistemi

- Ünite 1 başlangıçta açıktır.
- Ünite N, Ünite N-1 tamamlanmadan başlatılamaz.
- Tamamlanmış üniteler tekrar edilebilir; tekrar yapmak ilerleme kilidini geriye götürmez.
- A2, A1 %100 tamamlanmadan; B1, A2 %100 tamamlanmadan; sonraki seviyeler de aynı zincirle açılır.
- Her seviyenin ilerlemesi ayrı tutulur.

## Teknik yapı

```text
index.html                 UI ve responsive tasarım
app.js                     uygulama akışı
content/a1-curriculum.json A1 kaynak içerik
content/a2-curriculum.json A2 kaynak içerik
content/b1-curriculum.json B1 kaynak içerik
content/content-loader.js  içerik yükleme + 10 egzersiz runtime genişletme
course-system.js           seviye/ünite ilerleme ve kilit sistemi
runtime-fixes.js           öğrenme döngüsü ve veri hardening
build-fix.js               sentence-building UI uyumluluğu
premium.js                 entitlement katmanı
api/coach.js               opsiyonel AI Coach endpoint'i
sw.js                      offline/PWA cache
qa.mjs                     içerik + syntax + PWA/API QA
.github/workflows/qa.yml   otomatik CI
```

## Çalıştırma

Node.js 20+ ile:

```bash
npm run qa
```

Temel öğrenme deneyimi için API anahtarı gerekmez. Uygulama statik hosting üzerinde çalışabilecek şekilde tasarlanmıştır.

### Opsiyonel AI Coach

`/api/coach` OpenAI-compatible bir endpoint'e bağlanabilir. Ortam değişkenleri:

- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL`

Değişkenler yoksa yerel konuşma koçu çalışmaya devam eder.

## Ürün sırası

1. B1 içerik katmanı ✅
2. B2 içerik katmanı
3. C1 içerik katmanı
4. Tekrar motorunun davranış QA'sı
5. Konuşma değerlendirmesinin derinleştirilmesi
6. Hesap + bulut senkronizasyonu
7. Gerçek premium/ödeme altyapısı
8. Offline/PWA ve erişilebilirlik son QA
9. Android/iOS mağaza paketleme

## Durum

**A1, A2 ve B1 içerik katmanı hazır.** Kurs/ünite ilerleme kilitleri, 10 etkin egzersiz hedefi, replay koruması, SRS, PWA, yerel konuşma skoru, AI Coach sözleşmesi ve premium entitlement temeli projeye dahil edilmiştir. B2 ve C1 içerikleri ile üretim hesap/ödeme katmanı sonraki büyük bloklardır.