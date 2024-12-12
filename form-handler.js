document.addEventListener('DOMContentLoaded', function() {
  const ratingButtons = document.querySelectorAll('.rating-button');
  
  // Об'єкт для зберігання голосувань
  window.formVotes = {};

  ratingButtons.forEach(button => {
    button.addEventListener('click', function() {
      const trackRatingContainer = this.closest('.track-rating');
      const trackName = trackRatingContainer.dataset.track; 
      const ratingValue = this.dataset.rating;

      // Оновлюємо об'єкт голосувань
      window.formVotes[trackName] = ratingValue;

      // Встановлюємо клас selected для вибраної кнопки та видаляємо з інших
      const siblings = trackRatingContainer.querySelectorAll('.rating-button');
      siblings.forEach(sib => sib.classList.remove('selected'));

      this.classList.add('selected');
      trackRatingContainer.classList.add('option-chosen');
    });
  });

  // Обробка форми через AJAX
  document.getElementById('luxury-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const jsonData = {
      name: formData.get('name'),
      event_date: formData.get('event_date'),
      votes: window.formVotes || {}
    };

    // Показати індикатор завантаження
    document.getElementById('loading-indicator').style.display = 'block';

    // Встановіть ваш URL веб-додатку Google Apps Script тут
    const url = 'https://script.google.com/macros/s/AKfycbzSBY-rUcmJORj1b05DpgaskjBuEZ-kzDCncMpyLGD8Az2tfUJCJZxKZzaEM8udBMnXYQ/exec';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
      // Сховати індикатор завантаження
      document.getElementById('loading-indicator').style.display = 'none';
      
      if(data.result === 'success') {
        form.style.display = 'none';
        document.querySelector('.luxury-successbox').style.display = 'block';
      } else {
        alert('Сталася помилка при відправці форми: ' + data.error);
      }
    })
    .catch(error => {
      // Сховати індикатор завантаження
      document.getElementById('loading-indicator').style.display = 'none';
      
      console.error('Error:', error);
      alert('Сталася помилка при відправці форми.');
    });
  });
});
