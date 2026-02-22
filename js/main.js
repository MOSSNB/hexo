// Yachiyo Theme Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

  // 1. 访客计数器动画
  const counterEl = document.getElementById('visitor-counter');
  if (counterEl) {
    animateCounter(counterEl);
  }

  // 2. 踩号检测
  checkMilestone();

  // 3. 导航菜单交互
  initNav();

  // 4. 返回顶部
  initBackToTop();

  // 5. 图片懒加载
  initLazyLoad();
});

// 计数器动画
function animateCounter(el) {
  const target = parseInt(el.textContent);
  const duration = 2000;
  const start = target - 50;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
      // 整百数字特效
      if (target % 100 === 0) {
        el.classList.add('milestone');
        celebrateMilestone();
      }
    }
  }

  requestAnimationFrame(update);
}

// 踩号检测
function checkMilestone() {
  const counterEl = document.getElementById('visitor-counter');
  if (!counterEl) return;

  const count = parseInt(counterEl.textContent);
  if (count % 100 === 0 && count > 0) {
    showMilestoneNotice(count);
  }
}

// 整百庆祝效果
function celebrateMilestone() {
  const widget = document.querySelector('.milestone-widget');
  if (widget) {
    widget.classList.add('celebrating');
    widget.style.animation = 'pulse 2s ease-in-out';
  }
}

// 显示踩号通知
function showMilestoneNotice(count) {
  const notice = document.createElement('div');
  notice.className = 'milestone-popup';
  notice.innerHTML = `
    <div class="popup-content">
      <h3>🎉 恭喜！</h3>
      <p>您是第 ${count} 位访客！</p>
      <p>踩中了整百号！</p>
      <p>请向站长报告领取奖励~</p>
      <button onclick="this.parentElement.parentElement.remove()">知道了</button>
    </div>
  `;
  document.body.appendChild(notice);
}

// 导航交互
function initNav() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });

    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// 返回顶部
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #87CEEB;
    color: white;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    font-size: 20px;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 999;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      btn.style.opacity = '1';
    } else {
      btn.style.opacity = '0';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 图片懒加载
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Web拍手功能
function initClap() {
  const clapBtns = document.querySelectorAll('.clap-btn');

  clapBtns.forEach(btn => {
    btn.addEventListener('click', async function() {
      const postId = this.dataset.postId;

      try {
        const response = await fetch('/api/clap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId })
        });

        if (response.ok) {
          const data = await response.json();
          this.querySelector('.clap-count').textContent = data.count;
          this.classList.add('clapped');
        }
      } catch (err) {
        console.log('拍手失败:', err);
      }
    });
  });
}