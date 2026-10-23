# 🌸 Ayşe'ye Özel 23:59 Geri Sayım & Sürpriz Web Sitesi (Lego Stitch Temalı)

Bu proje, Ayşe'nin doğum gününü diğer herkesten farklı kılmak için tasarlandı. Herkes sabahın ilk saatinde yarışırken, bu site günün son dakikasına (**23:59**) kadar kilitli kalır ve tam o an açılan çok özel, duygusal bir sürpriz kutlamaya dönüşür.

---

## ✨ Öne Çıkan Özellikler

1. **23:59:00 Canlı Geri Sayım:**
   - Günün 00:00 - 23:59 ilerlemesini gösteren sevimli pembe ilerleme çubuğu.
   - Lego blokları ve stud kapaklarıyla tasarlanmış 3D dijital saat.
2. **Lego Stitch Karakteri:**
   - **Geri Sayım Modunda:** Kalpli pembe Lego bloğunu tutan, nefes alıp salınan ve tıklandığında eğlenceli sözler söyleyen Lego Stitch.
   - **Kutlama Modunda (23:59):** Doğum günü şapkası takmış, pastalı ve konfetili kutlama yapan neşeli Lego Stitch.
3. **23:59 Sürpriz Kilit Açılışı:**
   - Saat tam 23:59:00 olduğunda otomatik patlayan konfeti yağmuru (`canvas-confetti`).
   - "İlk değil, en son kutlayan olmak istedim" konseptli el yazısı duygusal doğum günü mektubu.
4. **İnteraktif Doğum Günü Pastası & Mum:**
   - Ayşe dilek tutup Lego pastanın üzerindeki muma tıkladığında mum söner, duman efekti çıkar ve altın yıldız havai fişekleri patlar!
5. **Dahili Müzik Kutusu Melodisi (Web Audio API):**
   - Herhangi bir MP3 veya dış ses dosyasına ihtiyaç duymadan, tarayıcının kendi ses sentezleyicisiyle çalan tatlı ve yumuşak "İyi ki Doğdun" müzik kutusu melodisi.
6. **Ekrana Dokununca Uçuşan Kalpler:**
   - Ekrana veya "Ayşe'ye Kalp Gönder" butonuna tıklandığında uçuşan sevimli kalpler ve tatlı ses efektleri.
7. **Test & Önizleme Çubuğu:**
   - Sayfanın altında Ayşe'ye göndermeden önce her iki ekranı da test edebileceğin ufak bir "23:59 Sonrasını Test Et" butonu yer alır (dilersen yanındaki ✕ butonuyla anında kapatabilirsin).

---

## 🚀 Vercel'e Nasıl Dağıtılır? (1 Dakikada Canlıya Alma)

Site tamamen statik ve modern web standartlarında (`HTML + CSS + JS`) hazırlandığı için Vercel üzerinde **0 ayar ile saniyeler içinde** çalışır.

### Yöntem 1: Vercel CLI ile Doğrudan Yükleme (En Hızlı)
Terminalde bu klasördeyken (`/Users/mac/Downloads/ayşe`):

```bash
# Vercel CLI yoksa: npm i -g vercel
npx vercel
```
- Sorulan sorulara `Enter` basarak devam et. Birkaç saniyede sana `https://ayse-....vercel.app` şeklinde ücretsiz canlı linkini verecektir!

---

### Yöntem 2: GitHub Üzerinden Vercel'e Bağlama
1. Bu klasörü GitHub hesabında yeni bir repoya yükle (`git init`, `git add .`, `git commit -m "init"`, `git push`).
2. [vercel.com](https://vercel.com) adresine gir, **Add New Project** de.
3. GitHub reponu seç ve **Deploy** butonuna bas.
4. Anında siten hazır!

---

## 💌 Mektubu veya Metinleri Düzenlemek İstersen

- **Mektup Metni:** `index.html` dosyası içinde `<div class="letter-body">` altındaki paragrafları dilediğin gibi kendi kişisel cümlelerinle değiştirebilirsin.
- **Karakter Sözleri:** `script.js` içerisindeki `stitchQuotes` listesinden Stitch'in konuşma balonundaki sözleri düzenleyebilirsin.
- **Doğrudan Kutlama Ekranını Görme (Test):** Tarayıcıda adrese `?preview=1` ekleyerek (örn: `https://seninsiten.vercel.app/?preview=1`) veya alttaki test butonuna basarak kutlama ekranını açabilirsin.
