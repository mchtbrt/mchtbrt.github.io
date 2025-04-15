import React, { useState, useEffect, useRef } from 'react';

function SeriesAIChatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Merhaba! Size dizi önerilerinde bulunabilirim. Hangi tür diziler ilginizi çekiyor? (Aksiyon, Drama, Komedi, Bilim Kurgu, Gerilim)'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Dizi türlerine göre öneriler
    const recommendations = {
      aksiyon: [
        'The Boys - Süper kahramanların karanlık yüzünü gösteren etkileyici bir dizi.',
        'Jack Ryan - Tom Clancy\'nin eserlerinden uyarlanan aksiyon dolu bir seri.',
        'The Witcher - Fantastik dünyada geçen, aksiyon dolu bir macera.',
        'Peaky Blinders - Birmingham\'ın suç dünyasında geçen etkileyici bir dizi.',
        'Vikings - Viking çağının destansı hikayesi.'
      ],
      drama: [
        'Breaking Bad - Walter White\'ın dönüşümünü anlatan muhteşem bir drama.',
        'The Crown - İngiliz kraliyet ailesinin hikayesi.',
        'This Is Us - Duygusal ve sürükleyici bir aile draması.',
        'The Handmaid\'s Tale - Distopik bir dünyada geçen güçlü bir drama.',
        'Better Call Saul - Breaking Bad evreninde geçen etkileyici bir spin-off.'
      ],
      komedi: [
        'The Office - Ofis hayatının absürt komedisi.',
        'Brooklyn Nine-Nine - Polis departmanında geçen eğlenceli bir komedi.',
        'The Good Place - Ölüm sonrası hayatı konu alan zekice bir komedi.',
        'Parks and Recreation - Belediye çalışanlarının eğlenceli hikayesi.',
        'Schitt\'s Creek - Zengin bir ailenin başına gelenlerin komik hikayesi.'
      ],
      'bilim kurgu': [
        'Black Mirror - Teknolojinin karanlık yüzünü gösteren düşündürücü bir dizi.',
        'The Expanse - Uzayda geçen epik bir bilim kurgu serisi.',
        'Westworld - Yapay zeka ve insanlık üzerine düşündüren bir dizi.',
        'Altered Carbon - Gelecekte geçen, etkileyici bir bilim kurgu.',
        'The Mandalorian - Star Wars evreninde geçen heyecan verici bir seri.'
      ],
      gerilim: [
        'Mindhunter - FBI\'ın seri katilleri anlama çabasını konu alan etkileyici bir dizi.',
        'True Detective - Her sezonu farklı bir cinayet vakasını ele alan güçlü bir dizi.',
        'Ozark - Para aklama ve suç dünyasında geçen sürükleyici bir gerilim.',
        'The Sinner - Her sezonu farklı bir cinayet vakasını ele alan etkileyici bir dizi.',
        'Dark - Zaman yolculuğu ve gizem dolu Alman yapımı bir dizi.'
      ]
    };

    // Kullanıcının girdisine göre en uygun kategoriyi bul
    let bestMatch = '';
    let maxMatches = 0;
    
    Object.keys(recommendations).forEach(category => {
      const matches = category.split(' ').filter(word => 
        input.includes(word)
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = category;
      }
    });

    // Eğer bir eşleşme bulunduysa, o kategoriden rastgele bir öneri seç
    if (bestMatch && recommendations[bestMatch]) {
      const randomIndex = Math.floor(Math.random() * recommendations[bestMatch].length);
      return recommendations[bestMatch][randomIndex];
    }

    // Eğer eşleşme bulunamazsa, genel öneriler
    const generalRecommendations = [
      'Size özel dizi önerileri için lütfen ilgilendiğiniz türü belirtin (Aksiyon, Drama, Komedi, Bilim Kurgu, Gerilim).',
      'Hangi tür dizileri izlemeyi seviyorsunuz? Size ona göre önerilerde bulunabilirim.',
      'Dizi önerileri için tercih ettiğiniz türü söylerseniz size yardımcı olabilirim.'
    ];
    
    return generalRecommendations[Math.floor(Math.random() * generalRecommendations.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    // Yapay bir gecikme ekleyerek daha doğal bir deneyim sağlayalım
    setTimeout(() => {
      const botResponse = generateResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-purple-600">Dizi Öneri Asistanı</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
              Düşünüyorum...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Dizi önerisi isteyin..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

export default SeriesAIChatbot; 