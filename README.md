# Dizi Takip Uygulaması

Bu uygulama, Mücahit ve Beyza'nın birlikte izledikleri dizileri takip etmek için geliştirilmiş bir web uygulamasıdır.

## Özellikler

- Dizi ekleme ve düzenleme
- Sezon ve bölüm takibi
- İzlenen bölümleri işaretleme
- Birlikte veya ayrı izleme durumunu belirtme
- Modern ve kullanıcı dostu arayüz

## Kurulum

1. Projeyi klonlayın
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Firebase yapılandırmasını ayarlayın:
   - Firebase Console'dan yeni bir proje oluşturun
   - Firestore veritabanını etkinleştirin
   - `src/firebase.js` dosyasındaki yapılandırma bilgilerini güncelleyin

4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## Teknolojiler

- React
- Firebase (Firestore)
- Tailwind CSS
- React Router 