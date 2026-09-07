# Speakio Content System

Speakio'nun öğrenme içeriği tek bir UI dosyasına gömülmek yerine `content/` altında sürümlenmiş veri olarak tutulur.

## A1 kaynağı

`a1-curriculum.json` mevcut A1 kursunun kaynak dosyasıdır. Her ünite şu pedagojik katmanları içerir:

- hedef ve CEFR seviyesi
- grammar odağı
- hedef kelimeler
- hedef cümleler ve Türkçe anlamları
- günlük diyalog
- listening cümleleri
- speaking görevleri
- çoktan seçmeli sorular
- çeviri soruları
- kelime sıralama / sentence-building görevleri

## Kaynak kullanımı

Tatoeba, örnek cümle verisi için dış kaynak olarak kullanılabilir. Tatoeba'nın toplu veri dosyaları CC BY 2.0 FR altında yayımlanır; veri setinin bir bölümü CC0 1.0'dır. Uygulamaya alınan her dış kaynak cümlesi için kaynak/lisans bilgisi korunmalıdır. Ses kayıtlarının lisansı ayrıca kayıt bazında kontrol edilmelidir.

Speakio'nun pedagojik açıklamaları, görevleri, sıra/tekrar mantığı ve ürün içi akışları Speakio'ya aittir.

## Üretim kuralı

1. Önce seviye ve öğrenme hedefi belirlenir.
2. Kelime ve grammar hedefleri seçilir.
3. Cümleler günlük iletişim bağlamında filtrelenir.
4. Her hedef için en az bir alıştırma oluşturulur.
5. Listening ve speaking görevleri hedef cümlelerle eşleştirilir.
6. Ünite sonunda mastery/review tekrarları oluşturulur.
7. Dış kaynak kullanılan içerikte kaynak metadata'sı korunur.

## Yol haritası

- A1: çekirdek kurs
- A2: temel iletişim genişletme
- B1: bağımsız iletişim
- B2: akıcı ve bağlama duyarlı iletişim
- C1: ileri düzey ifade ve nüans

İçerik motoru tamamlanmadan AI öğretmen, premium ve backend katmanları ürünün ana odağı yapılmayacaktır.
