const REVIEW_STORAGE_KEY = "d4c_reviews";

const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderReviews() {
  const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
  const reviews = stored ? JSON.parse(stored) : [];

  if (!reviews.length) {
    reviewsList.innerHTML = `<div class="empty-reviews">No community reviews yet. Be the first to share your experience.</div>`;
    return;
  }

  reviewsList.innerHTML = reviews
    .map((review) => {
      const stars = "\u2605".repeat(review.rating) + "\u2606".repeat(5 - review.rating);
      return `
        <article class="review-item">
          <div class="review-top">
            <span class="review-name">${escapeHtml(review.name)}</span>
            <span class="review-rating" aria-label="${review.rating} out of 5">${stars}</span>
          </div>
          <p>${escapeHtml(review.text)}</p>
          <p class="review-date">${escapeHtml(review.date)}</p>
        </article>
      `;
    })
    .join("");
}

function saveReview(name, rating, text) {
  const existing = localStorage.getItem(REVIEW_STORAGE_KEY);
  const reviews = existing ? JSON.parse(existing) : [];

  const next = [
    {
      name,
      rating,
      text,
      date: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    },
    ...reviews
  ].slice(0, 20);

  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(next));
}

if (reviewForm && reviewsList) {
  renderReviews();

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewForm);
    const name = String(formData.get("name") || "").trim();
    const rating = Number(formData.get("rating"));
    const text = String(formData.get("text") || "").trim();

    if (!name || !text || !rating) {
      return;
    }

    saveReview(name, rating, text);
    reviewForm.reset();
    renderReviews();
  });
}

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent("Bathroom Remodel Consultation Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nProject Details:\n${message}`
    );

    contactStatus.textContent =
      "Opening your email app to send your consultation request.";

    window.location.href = `mailto:d4c.david@gmail.com?subject=${subject}&body=${body}`;
  });
}
