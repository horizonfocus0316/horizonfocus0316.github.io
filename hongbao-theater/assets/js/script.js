/* =========================================
   script.js - 互動邏輯核心
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. 浮現動畫 (Scroll Animation)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".timeline-item, .element-card, .video-card").forEach(el => observer.observe(el));

  // 2. Chart.js 圖表 (30家 vs 1家)
  if(document.getElementById('myChart')) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['全盛期 (30家)', '現今 (1家)'],
        datasets: [{
          label: '西門町歌廳數量',
          data: [30, 1],
          backgroundColor: ['rgba(255, 255, 255, 0.2)', '#FFE87A'],
          borderColor: ['transparent', '#FFE87A'],
          borderWidth: 1,
          barThickness: 60
        }]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { 
            ticks: { color: '#fff', font: {size: 14, family: "'Noto Serif TC', serif"} }, 
            grid: { display: false } 
          },
          y: { 
            ticks: { color: '#888' }, 
            grid: { color: 'rgba(255,255,255,0.1)' } 
          }
        },
        animation: { duration: 2000, easing: 'easeOutQuart' }
      }
    });
  }

  // 3. Leaflet 地圖 (定位西門町金鑽)
  if(document.getElementById('map')) {
    var map = L.map('map', { 
      center: [25.04426, 121.50735], 
      zoom: 16, 
      scrollWheelZoom: false, // 禁止滾輪，避免誤觸
      zoomControl: false 
    });
    
    // 使用深色地圖風格
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
      attribution: '&copy; CARTO' 
    }).addTo(map);
    
    // 自定義金色 Icon
    var goldIcon = L.divIcon({ 
      className: 'custom-div-icon', 
      html: "<div style='background:#FFE87A; width:16px; height:16px; border-radius:50%; box-shadow:0 0 15px #FFE87A; border: 2px solid #fff;'></div>", 
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    
    L.marker([25.04426, 121.50735], {icon: goldIcon})
      .addTo(map)
      .bindPopup("<b style='color:#333'>金鑽歌廳</b><br><span style='color:#666'>台北市漢中街42號</span>")
      .openPopup();
  }

  // 4. Modal 彈窗邏輯
  const modal = document.getElementById("modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".element-card").forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title.split("：")[0]; // 取標題
      modalBody.innerHTML = `
        <strong style="color:var(--gold); display:block; margin-bottom:10px;">${card.dataset.title.split("：")[1] || ''}</strong>
        ${card.dataset.body}
      `;
      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // 禁止背景捲動
    });
  });

  const closeModal = () => { modal.classList.remove("open"); document.body.style.overflow = ""; };
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  // 5. 導覽列 Active 狀態與進度條
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-bar a");
  
  window.addEventListener('scroll', () => {
    // 進度條
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";

    // Nav Active
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 300) { current = section.getAttribute("id"); }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) { link.classList.add("active"); }
    });
  });
});
