// === 1. أنميشن فتح الظرف (GSAP) ===
function openWeddingInvitation() {
    const envelope = document.querySelector('.envelope');
    envelope.style.pointerEvents = 'none'; // منع الضغط مرتين

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflowY = 'auto'; // تفعيل السكرول
            document.body.style.height = 'auto';
            document.getElementById('envelope-wrapper').remove();
            initScrollAnimations();
        }
    });

    tl.to(".click-hint", { opacity: 0, y: 10, duration: 0.25 })
        // الختم يتشقق ويختفي
        .to("#waxSeal", { scale: 1.4, opacity: 0, rotation: -25, duration: 0.45, ease: "power2.in" })
        // الغطاء ينفتح للخلف
        .to("#envelopeFlap", { rotationX: 180, duration: 0.7, ease: "power2.inOut" }, "-=0.1")
        // الظرف كامل يتمدد ويتلاشى للأعلى تاركاً المجال للموقع
        .to(".envelope-stage", { scale: 1.15, opacity: 0, duration: 0.5, ease: "power1.in" }, "-=0.2")
        .to("#envelope-wrapper", { opacity: 0, duration: 0.5 }, "-=0.3")
        .set("#envelope-wrapper", { pointerEvents: "none" })
        .to("#main-website", { opacity: 1, visibility: "visible", duration: 0.1 }, "-=0.4")

        // أنميشن دخول نصوص الهيرو
        .from(".hero-content .animate-text", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.5)"
        }, "-=0.3")
        .from(".scroll-down", {
            opacity: 0,
            y: -10,
            duration: 0.6
        }, "-=0.2");
}

// === 2. أنميشن النزول بالصفحة (ScrollTrigger) ===
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-up');
    elements.forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    gsap.from(".footer-ornament, .footer-message, .footer-names, .footer-sub", {
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });
}

// === 3. العداد التنازلي الدقيق (10 تموز 2026) ===
document.addEventListener("DOMContentLoaded", () => {
    const weddingDate = new Date("July 10, 2026 19:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.querySelector(".countdown-container").innerHTML = "<h3 style='color: var(--gold-light); font-size: 28px; font-family: Amiri;'>لقد بدأت ليلة العمر!</h3>";
            return;
        }

        document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();
});

// === 4. معالجة إرسال الفورم (RSVP) ===
// رابط Google Apps Script الخاص بك (سنحصل عليه في الخطوات التالية)
const scriptURL = 'https://script.google.com/macros/s/AKfycbyUKov0lbfk1hkQymslVcM4ORZXQ2NhIL-3RL33INsrp82d2bMt35Kud3AmZPp4vAZ6kQ/exec';

document.getElementById('wedding-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");

    // 1. تغيير حالة الزر أثناء الإرسال
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled = true;

    // 2. تجميع بيانات الفورم
    const formData = new FormData(this);

    // 3. إرسال البيانات عبر Fetch API
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // حالة النجاح
            btn.style.background = "#4CAF50";
            btn.style.color = "#fff";
            btn.innerHTML = 'تم الإرسال بنجاح <i class="fa-solid fa-check"></i>';
            this.reset(); // تفريغ الحقول

            // إعادة الزر لحالته الطبيعية بعد 3 ثوانٍ (اختياري)
            setTimeout(() => {
                btn.style.background = "";
                btn.style.color = "";
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال التأكيد';
                btn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            // حالة الخطأ
            console.error('Error!', error.message);
            btn.style.background = "#f44336"; // لون أحمر للخطأ
            btn.innerHTML = 'حدث خطأ، حاول مجدداً <i class="fa-solid fa-xmark"></i>';
            btn.disabled = false;
        });
});