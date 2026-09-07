# Speakio 🗣️

Speakio, konuşarak dil öğrenme fikri üzerine geliştirilen **mobil-first, çalışan dil öğrenme MVP'sidir**.

## Çalışan özellikler

- Ana sayfa, günlük hedef, XP ve streak
- İngilizce A1 kurs haritası
- 12 ders / temel cümleler
- Ders içi çoktan seçmeli alıştırmalar
- Ders tamamlama ve XP kazanımı
- Ders sonuç ekranı
- AI Speak konuşma pratiği
- Tarayıcı Speech Recognition ile mikrofon girişi (destekleyen tarayıcılarda)
- Tarayıcı Speech Synthesis ile İngilizce seslendirme
- Kural tabanlı konuşma koçu geri bildirimi
- Kelime Hafızası ve kayıtlı kelimeler
- Dinleme alıştırmaları
- Dil bilgisi mini dersleri
- Gerçek hayat konuşma senaryoları
- Başarılar ve kilitli/açık rozetler
- Profil ve haftalık XP görünümü
- Ayarlar
- LocalStorage ile kalıcı cihaz içi ilerleme
- PWA manifesti ve temel offline service worker
- Responsive mobil tasarım

## İçerik sistemi

Speakio'nun A1 içerik kaynak dosyası **`content/a1-curriculum.json`** olarak eklendi. Dosya 12 üniteyi pedagojik bir şema ile tanımlar:

- öğrenme hedefi
- kelime listesi
- dil bilgisi konusu
- hedef cümleler ve Türkçe anlamları
- kısa diyalog
- dinleme cümleleri
- konuşma görevleri
- çoktan seçmeli sorular
- çeviri soruları
- cümle kurma soruları
- final tekrar ve mastery hedefi

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

### Harici açık veri politikası

Cümle veri kaynağı olarak **Tatoeba** seçildi. Tatoeba'nın indirme sayfasında genel cümle verileri **CC BY 2.0 FR**, uygun kayıtların bir bölümü ise **CC0 1.0** olarak yayımlanıyor. Bu nedenle Speakio'ya aktarılacak her harici cümle için kaynak kaydı, lisans ve gerekli atıf korunmalı; ses kayıtlarının lisansı ayrıca kontrol edilmelidir.

Kaynak: https://tatoeba.org/tr/downloads
API: https://api.tatoeba.org/

**Not:** `a1-curriculum.json` içindeki pedagojik çekirdek içerik Speakio'nun uygulama içeriğidir. Tatoeba'dan ileride içeriğe aktarılacak kayıtlar, kaynak ID'si ve lisans bilgisiyle ayrı bir import katmanında tutulmalıdır.

## Çalıştırma

Statik sürüm olduğu için `index.html` bir web sunucusunda veya GitHub Pages üzerinde doğrudan çalışabilir. Harici API anahtarı gerektirmeden temel öğrenme deneyimi çalışır.

## Sonraki ürün aşaması

- A1 içerik kaynağını uygulama ekranlarına tam bağlama
- Tatoeba'dan lisans kontrollü cümle import katmanı
- A2 → B1 → B2 → C1 kapsamlı müfredat
- Supabase kullanıcı hesabı ve bulut senkronizasyonu
- Sunucu tabanlı gerçek AI öğretmen
- Telaffuz puanlama motoru
- Spaced repetition kelime motoru
- Daha gelişmiş sesli konuşma değerlendirmesi
- Premium üyelik
- Android/iOS paketleme
