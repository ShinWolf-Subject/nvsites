// DOM Elements
const urlInput = document.getElementById('urlInput');
const pasteBtn = document.getElementById('pasteBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadMP3Btn = document.getElementById('downloadMP3Btn');
const downloadMP4Btn = document.getElementById('downloadMP4Btn');
const resultSection = document.getElementById('resultSection');
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const thumbnailImg = document.getElementById('thumbnailImg');
const videoTitle = document.getElementById('videoTitle');
const videoFormat = document.getElementById('videoFormat');
const videoSize = document.getElementById('videoSize');
const videoDuration = document.getElementById('videoDuration');
const downloadLink = document.getElementById('downloadLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const directDownloadBtn = document.getElementById('directDownloadBtn');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// API URLs
const MP3_API_URL = 'https://api.deline.web.id/downloader/ytmp3?url=';
const MP4_API_URL = 'https://api.elrayyxml.web.id/api/downloader/ytmp4?url=';

// Event Listeners
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text;
    showNotification('URL berhasil ditempel!', 'success');
  } catch (err) {
    showNotification('Gagal menempel dari clipboard', 'error');
    console.error('Failed to read clipboard:', err);
  }
});

clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  urlInput.focus();
  showNotification('Input telah dibersihkan', 'info');
});

downloadMP3Btn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!isValidYouTubeUrl(url)) {
    showError('URL YouTube tidak valid. Silakan periksa kembali URL Anda.');
    return;
  }
  downloadMedia(url, 'mp3');
});

downloadMP4Btn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!isValidYouTubeUrl(url)) {
    showError('URL YouTube tidak valid. Silakan periksa kembali URL Anda.');
    return;
  }
  downloadMedia(url, 'mp4');
});

copyLinkBtn.addEventListener('click', () => {
  if (!downloadLink.value || downloadLink.value === 'Link akan muncul di sini setelah proses selesai') {
    showNotification('Tidak ada link untuk disalin', 'warning');
    return;
  }
  
  navigator.clipboard.writeText(downloadLink.value)
    .then(() => {
      showNotification('Link berhasil disalin ke clipboard!', 'success');
      // Change button temporarily
      const originalText = copyLinkBtn.innerHTML;
      copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
      copyLinkBtn.classList.remove('bg-pastel-pink');
      copyLinkBtn.classList.add('bg-pastel-green');
      
      setTimeout(() => {
        copyLinkBtn.innerHTML = originalText;
        copyLinkBtn.classList.remove('bg-pastel-green');
        copyLinkBtn.classList.add('bg-pastel-pink');
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      showNotification('Gagal menyalin link', 'error');
    });
});

retryBtn.addEventListener('click', () => {
  hideError();
  urlInput.focus();
});

// Utility Functions
function isValidYouTubeUrl(url) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return pattern.test(url);
}

function encodeURL(url) {
  return encodeURIComponent(url);
}

function showLoading() {
  loadingSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  
  // Simulate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) {
      clearInterval(interval);
      progress = 90; // Hold at 90% until API response
    }
    updateProgress(progress);
  }, 300);
  
  window.progressInterval = interval;
}

function updateProgress(percent) {
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${Math.round(percent)}%`;
}

function hideLoading() {
  loadingSection.classList.add('hidden');
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
  updateProgress(100);
}

function showResult() {
  resultSection.classList.remove('hidden');
  resultSection.classList.add('fade-in');
}

function showError(message) {
  errorMessage.textContent = message;
  errorSection.classList.remove('hidden');
  errorSection.classList.add('fade-in');
  loadingSection.classList.add('hidden');
  resultSection.classList.add('hidden');
}

function hideError() {
  errorSection.classList.add('hidden');
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-6 right-6 neobrut-card p-4 z-50 fade-in ${
        type === 'success' ? 'bg-pastel-green' : 
        type === 'error' ? 'bg-pastel-pink' : 'bg-pastel-yellow'
    }`;
  
  const icon = type === 'success' ? 'fa-check-circle' :
    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas ${icon} text-2xl"></i>
      <div>
        <p class="font-bold">${type === 'success' ? 'Sukses!' : type === 'error' ? 'Error!' : 'Info'}</p>
            <p>${message}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('fade-in');
    notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Main Download Function
async function downloadMedia(url, type) {
  showLoading();
  const encodedUrl = encodeURL(url);
  const apiUrl = type === 'mp3' ? MP3_API_URL + encodedUrl : MP4_API_URL + encodedUrl;
  
  try {
    const response = await axios.get(apiUrl);
    
    // Simulate a bit more loading time for UX
    setTimeout(() => {
      hideLoading();
      
      if (response.data.status) {
        displayResult(response.data, type);
        showResult();
        showNotification(`Berhasil mendapatkan link download ${type.toUpperCase()}!`, 'success');
      } else {
        showError(`API mengembalikan status false. Coba lagi dengan URL yang berbeda.`);
      }
    }, 800);
    
  } catch (error) {
    hideLoading();
    console.error(`Error fetching ${type}:`, error);
    
    // Fallback to mock data if API fails (for demo purposes)
    if (error.response && error.response.status === 404) {
      showError(`API ${type.toUpperCase()} sedang tidak tersedia. Coba lagi nanti.`);
    } else {
      // For demo, show mock data when API fails
      showNotification('Menggunakan data demo karena API sedang bermasalah', 'info');
      displayMockData(type);
      showResult();
    }
  }
}

function displayResult(data, type) {
  if (type === 'mp3') {
    // MP3 Response Format
    thumbnailImg.src = data.result.youtube.thumbnail;
    videoTitle.textContent = data.result.youtube.title;
    videoFormat.textContent = data.result.pick.ext.toUpperCase() + ' - ' + data.result.pick.quality;
    videoSize.textContent = data.result.pick.size;
    videoDuration.textContent = 'Tidak tersedia';
    downloadLink.value = data.result.dlink;
    directDownloadBtn.href = data.result.dlink;
  } else {
    // MP4 Response Format
    thumbnailImg.src = data.result.thumbnail;
    videoTitle.textContent = data.result.title;
    videoFormat.textContent = 'MP4 - ' + data.result.format + 'p';
    videoSize.textContent = 'Tidak tersedia';
    
    // Format duration from seconds to minutes:seconds
    const duration = data.result.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    videoDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    downloadLink.value = data.result.url;
    directDownloadBtn.href = data.result.url;
  }
  
  // Update direct download button text based on type
  directDownloadBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> Download ${type.toUpperCase()}`;
}

// Mock data for demo purposes
function displayMockData(type) {
  const mockMP3Data = {
    result: {
      youtube: {
        thumbnail: "https://i.ytimg.com/vi/L29MaxP9PfM/0.jpg",
        title: "NaFF - Kau Masih Kekasihku | Official Music Video"
      },
      pick: {
        quality: "128kbps",
        size: "4.4 MB",
        ext: "mp3"
      },
      dlink: "https://example.com/demo-audio.mp3"
    }
  };
  
  const mockMP4Data = {
    result: {
      title: "Video Demo - Lorem Ipsum Dolor Sit Amet",
      format: "1080",
      thumbnail: "https://i.ytimg.com/vi_webp/cy10F25jlhc/maxresdefault.webp",
      duration: 937,
      url: "https://example.com/demo-video.mp4"
    }
  };
  
  displayResult(type === 'mp3' ? mockMP3Data : mockMP4Data, type);
}

// Initialize with example URL
window.addEventListener('DOMContentLoaded', () => {
  // Example URL for user to try
  urlInput.value = 'https://youtu.be/cy10F25jlhc?si=ElqiulRJkJFvwIfC';
  
  // Add animation to download buttons
  setTimeout(() => {
    downloadMP3Btn.classList.add('pulse');
    downloadMP4Btn.classList.add('pulse');
  }, 1000);
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('Selamat datang di NeoTube Downloader! Tempel URL YouTube dan pilih format download.', 'info');
  }, 1500);
  
  // Add event listener for Enter key
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const url = urlInput.value.trim();
      if (!isValidYouTubeUrl(url)) {
        showError('URL YouTube tidak valid. Silakan periksa kembali URL Anda.');
        return;
      }
      // Default to MP3 if Enter is pressed
      downloadMedia(url, 'mp3');
    }
  });
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidYouTubeUrl,
    encodeURL,
    showNotification,
    showError,
    hideError
  };
}