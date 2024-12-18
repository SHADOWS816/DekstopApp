// Sample photo data (replace with backend data later)
// const photos = [
//     { src: 'cat.jpeg', title: 'Cat 1', date: '2022-12-01' },
//     { src: 'b2.jpg', title: 'Cat 2', date: '2023-01-10' },
//     { src: 'b2.jpg', title: 'Cat 3', date: '2023-02-14' },
//     { src: 'b2.jpg', title: 'Cat 4', date: '2023-03-20' },
//   ];
  
  // Populate the gallery
  const gallery = document.getElementById('gallery');
  
  function loadPhotos() {
    gallery.innerHTML = '';
    photos.forEach(photo => {
      const photoElement = document.createElement('div');
      photoElement.classList.add('photo');
      photoElement.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}">
        <p>${photo.title}</p>
        <small>${photo.date}</small>
      `;
      gallery.appendChild(photoElement);
    });
  }
  
  // Search functionality
  document.getElementById('search').addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredPhotos = photos.filter(photo =>
      photo.title.toLowerCase().includes(searchQuery)
    );
  
    gallery.innerHTML = '';
    filteredPhotos.forEach(photo => {
      const photoElement = document.createElement('div');
      photoElement.classList.add('photo');
      photoElement.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}">
        <p>${photo.title}</p>
        <small>${photo.date}</small>
      `;
      gallery.appendChild(photoElement);
    });
  });
