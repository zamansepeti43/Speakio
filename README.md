# Speakio 🗣️

Speakio, **konuşarak dil öğrenme** üzerine kurulmuş mobil-first bir İngilizce öğrenme uygulamasıdır. Mevcut sürüm A1 çekirdek öğrenme döngüsünü çalışır halde sunar: ders → alıştırma → tekrar → dinleme → konuşma → ilerleme.

## Mevcut sürüm

- Ana sayfa, günlük hedef, XP ve streak
- İngilizce A1 kurs haritası
- **12 A1 ünite / 48 egzersiz**
- Çoktan seçmeli, çeviri ve cümle kurma egzersizleri
- Ders sonucu ve ustalık yüzdesi
- Tamamlanmış derslerde replay XP/günlük hedef koruması
- Dinleme alıştırmaları ve gerçek ekrandaki seçeneklerle doğrulama
- Kelime hafızası ve kayıtlı kelimeler
- Dilbilgisi özeti
- AI Speak: tarayıcı mikrofonu + konuşma metni + **0–100 yerel skor**
- Kural tabanlı konuşma koçu
- İsteğe bağlı OpenAI-compatible `/api/coach` AI Coach katmanı
- Yanlış cevaplar için zamanlanmış tekrar: **10 dk → 1 → 3 → 7 → 14 → 30 gün**
- Günlük mini görevler ve yerel tarih bazlı streak
- Başarımlar ve profil
- İlerlemeyi JSON olarak dışa/içe aktarma
- LocalStorage ile cihaz içi kalıcı ilerleme
- Responsive mobil/masaüstü arayüz
- PWA manifest + offline Service Worker
- Local premium entitlement altyapısı
- Otomatik GitHub Actions QA

## İçerik mimarisi

A1 müfredatının tek kaynak dosyası **`content/a1-curriculum.json`**'dır. Her ünite:

- öğrenme hedefi
- kelime listesi
- grammar odağı
- hedef cümleler + Türkçe anlamları
- diyalog
- listening cümleleri
- speaking görevleri
- 2 MCQ + 1 translation + 1 sentence-building egzersizi

A1 üniteleri:

1. Selamlaşma ve Tanışma
2. Kendini Tanıtma
3. Sayılar, Saat ve Yaş
4. Aile ve İnsanlar
5. Yiyecek ve İçecek
6. Ev ve Eşyalar
7. Günlük Rutin
8. İş ve Meslek
9. Şehir ve Yönler
10. Alışveriş
11. Seyahat ve Otel
12. Geçmiş Zaman ve Tekrar

## Teknik yapı

```text
index.html                 UI ve responsive tasarım
app.js                     uygulama akışı
content/a1-curriculum.json A1 kaynak içerik
content/content-loader.js  içerik yükleme katmanı
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

Statik uygulama bir web sunucusunda veya Vercel/GitHub Pages benzeri statik hosting üzerinde çalışabilir. Temel öğrenme deneyimi için API anahtarı gerekmez.

### Opsiyonel AI Coach

`/api/coach` OpenAI-compatible bir endpoint'e bağlanabilir. Ortam değişkenleri:

- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL` (varsayılan: `gpt-4o-mini`)

Bu değişkenler yoksa endpoint sessizce devre dışı kalır ve yerel konuşma koçu çalışmaya devam eder.

## Harici içerik / lisans

Tatoeba, yalnızca lisansı kayıt bazında doğrulanmış örnek cümleler için potansiyel dış kaynak olarak tanımlanmıştır. Üretim içeriğine aktarımda kaynak ID'si, dil, lisans ve atıf metadata'sı korunmalıdır. Ses kayıtlarının lisansı ayrıca doğrulanmalıdır. Ayrıntılı politika `content/attribution.md` dosyasındadır.

## Durum

**A1 çekirdek MVP tamamlandı.** Bundan sonraki ürün katmanları A2–C1 müfredat genişlemesi, gerçek hesap/senkronizasyon, gelişmiş telaffuz değerlendirmesi, gerçek ödeme/premium entegrasyonu ve mobil mağaza paketlemesidir. Bunlar mevcut ücretsiz A1 öğrenme döngüsünü bozmayacak şekilde katmanlanmalıdır.
