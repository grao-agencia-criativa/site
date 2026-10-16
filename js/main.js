// ==========================================================================
// GRÃO — scripts compartilhados
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================================================
  // HERO EM MOSAICO
  // ==========================================================================

  const mosaicHero = document.querySelector("[data-mosaic-hero]");

  if (mosaicHero && !prefersReducedMotion) {
    const pieces = mosaicHero.querySelectorAll(".mosaic-slot");
    const palette = mosaicHero.querySelector(".mosaic-palette");
    const heroInner = mosaicHero.querySelector(".hero-inner");

    let ticking = false;

    const updateMosaic = () => {
      const rect = mosaicHero.getBoundingClientRect();

      const scrollable = Math.max(
        mosaicHero.offsetHeight - window.innerHeight,
        1
      );

      const progress = Math.min(
        Math.max(-rect.top / scrollable, 0),
        1
      );

      mosaicHero.style.setProperty(
        "--mosaic-progress",
        progress.toFixed(4)
      );

      pieces.forEach((piece) => {
        const start = Number(piece.dataset.start || 0);
        const x = Number(piece.dataset.x || 0);
        const y = Number(piece.dataset.y || 0);
        const rotation = Number(piece.dataset.rotate || 0);

        const reveal = Math.min(
          Math.max((progress - start) / 0.16, 0),
          1
        );

        const remaining = 1 - reveal;

        piece.style.opacity = reveal.toFixed(3);

        piece.style.transform = `
          translate(
            ${x * remaining}px,
            ${y * remaining}px
          )
          rotate(${rotation * remaining}deg)
          scale(${0.9 + reveal * 0.1})
        `;
      });

      if (palette) {
        palette.classList.toggle(
          "is-visible",
          progress >= 0.84
        );
      }

      if (heroInner) {
        heroInner.style.transform =
          `translateY(${-16 * progress}px)`;
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        window.requestAnimationFrame(updateMosaic);
        ticking = true;
      },
      { passive: true }
    );

    window.addEventListener("resize", updateMosaic, {
      passive: true
    });

    updateMosaic();
  }

  // ==========================================================================
  // IDENTIFICA IMAGENS DO MOSAICO QUE NÃO CARREGARAM
  // ==========================================================================

  document
    .querySelectorAll(".mosaic-slot img")
    .forEach((image) => {
      image.addEventListener("error", () => {
        image
          .closest(".mosaic-slot")
          ?.classList.add("is-image-error");
      });
    });

  // ==========================================================================
  // RAÍZES QUE CRESCEM
  // ==========================================================================

  const rootSections =
    document.querySelectorAll("[data-root-section]");

  const clamp = (value, min = 0, max = 1) => {
    return Math.min(Math.max(value, min), max);
  };

  const drawRoot = (section, progress) => {
    section.querySelectorAll(".root-line").forEach((line) => {
      const delay = Number(line.dataset.rootDelay || 0);

      const localProgress = clamp(
        (progress - delay) /
          Math.max(1 - delay, 0.01)
      );

      line.style.strokeDashoffset =
        String(1 - localProgress);
    });
  };

  if (rootSections.length && !prefersReducedMotion) {
    rootSections.forEach((section) => {
      section.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const rect = section.getBoundingClientRect();

        const progress = clamp(
          (event.clientY - rect.top) / rect.height
        );

        drawRoot(section, progress);
      });
    });

    let rootTicking = false;

    const updateRootsFromScroll = () => {
      rootSections.forEach((section) => {
        const supportsHover = window.matchMedia(
          "(hover: hover)"
        ).matches;

        if (section.matches(":hover") && supportsHover) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const viewportTrigger = window.innerHeight * 0.82;

        const progress = clamp(
          (viewportTrigger - rect.top) /
            (rect.height + viewportTrigger * 0.35)
        );

        drawRoot(section, progress);
      });

      rootTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (rootTicking) return;

        rootTicking = true;

        window.requestAnimationFrame(
          updateRootsFromScroll
        );
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateRootsFromScroll,
      { passive: true }
    );

    updateRootsFromScroll();
  }

  // ==========================================================================
  // MINIJOGO DA TREND
  // ==========================================================================

  document
    .querySelectorAll("[data-viral-game]")
    .forEach((game) => {
      const button = game.querySelector(
        "[data-viral-button]"
      );

      const resetButton = game.querySelector(
        "[data-viral-reset]"
      );

      const result = game.querySelector(
        "[data-viral-result]"
      );

      const viewsElement = game.querySelector(
        "[data-viral-views]"
      );

      const likesElement = game.querySelector(
        "[data-viral-likes]"
      );

      const commentsElement = game.querySelector(
        "[data-viral-comments]"
      );

      const postElement = game.querySelector(
        ".viral-post"
      );

      if (
        !button ||
        !resetButton ||
        !result ||
        !viewsElement ||
        !likesElement ||
        !commentsElement ||
        !postElement
      ) {
        return;
      }

      const initialValues = {
        views: 127,
        likes: 8,
        comments: 1,
        button: "Clique para viralizar"
      };

      const viralStages = [
        {
          views: 2847,
          likes: 246,
          comments: 18,
          button: "Viralizar mais"
        },
        {
          views: 28400,
          likes: 2100,
          comments: 137,
          button: "Continuar viralizando"
        },
        {
          views: 357000,
          likes: 28400,
          comments: 1842,
          button: "Só mais um clique"
        },
        {
          views: 1200000,
          likes: 98600,
          comments: 7341,
          button: "Trend encerrada"
        }
      ];

      let clickCount = 0;

      const formatNumber = (number) => {
        return new Intl.NumberFormat("pt-BR").format(
          number
        );
      };

      const updateMetrics = (stage) => {
        viewsElement.textContent = formatNumber(
          stage.views
        );

        likesElement.textContent = formatNumber(
          stage.likes
        );

        commentsElement.textContent = formatNumber(
          stage.comments
        );

        button.textContent = stage.button;
      };

      const animatePost = () => {
        if (prefersReducedMotion) return;

        viewsElement.classList.add("is-changing");
        postElement.classList.add("is-growing");

        window.setTimeout(() => {
          viewsElement.classList.remove(
            "is-changing"
          );

          postElement.classList.remove(
            "is-growing"
          );
        }, 300);
      };

      const showFinalMessage = () => {
        result.classList.add("is-visible");
        result.setAttribute("aria-hidden", "false");
        button.disabled = true;

        window.setTimeout(() => {
          resetButton.focus();
        }, prefersReducedMotion ? 0 : 450);
      };

      const resetGame = () => {
        clickCount = 0;

        updateMetrics(initialValues);

        button.disabled = false;

        result.classList.remove("is-visible");
        result.setAttribute("aria-hidden", "true");

        postElement.classList.remove("is-growing");

        viewsElement.classList.remove(
          "is-changing"
        );

        button.focus();
      };

      button.addEventListener("click", () => {
        if (clickCount >= viralStages.length) {
          return;
        }

        const currentStage =
          viralStages[clickCount];

        updateMetrics(currentStage);
        animatePost();

        clickCount++;

        if (clickCount === viralStages.length) {
          window.setTimeout(
            showFinalMessage,
            prefersReducedMotion ? 0 : 450
          );
        }
      });

      resetButton.addEventListener(
        "click",
        resetGame
      );
    });

  // ==========================================================================
  // MENU MOBILE
  // ==========================================================================

  const toggle = document.querySelector(
    ".nav-toggle"
  );

  const links = document.querySelector(
    ".nav-links"
  );

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen =
        links.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }

  // ==========================================================================
  // FILTRO DO PORTFÓLIO
  // ==========================================================================

  const chips = document.querySelectorAll(
    ".filter-chip"
  );

  const cards = document.querySelectorAll(
    ".portfolio-card"
  );

  if (chips.length && cards.length) {
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((currentChip) => {
          currentChip.classList.remove("active");
        });

        chip.classList.add("active");

        const filter = chip.dataset.filter;

        cards.forEach((card) => {
          const match =
            filter === "todos" ||
            card.dataset.category === filter;

          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // ==========================================================================
  // FORMULÁRIO DE CONTATO
  // ==========================================================================

  const form = document.querySelector(
    "#contact-form"
  );

  const status = document.querySelector(
    "#form-status"
  );

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = form.nome.value.trim();

      const whatsapp =
        form.whatsapp.value.trim();

      if (!nome || !whatsapp) {
        status.textContent =
          "Preencha nome e WhatsApp pra gente conseguir te responder.";

        status.className = "form-status";
        return;
      }

      const numeroWhatsapp = "5585991733919";

      const mensagem =
        form.desafio.value.trim();

      const empresa =
        form.empresa.value.trim();

      const texto = encodeURIComponent(
        `Olá! Sou ${nome}` +
        `${empresa ? " da " + empresa : ""}. ` +
        `${
          mensagem
            ? "Meu desafio: " + mensagem
            : "Quero falar com a Grão."
        }`
      );

      status.textContent =
        "Show! Te levando pro WhatsApp...";

      status.className =
        "form-status success";

      window.open(
        `https://wa.me/${numeroWhatsapp}?text=${texto}`,
        "_blank",
        "noopener,noreferrer"
      );

      form.reset();
    });
  }

  // ==========================================================================
  // VALORES — QUADRADOS QUE ABREM AO CLICAR
  // ==========================================================================

  document.querySelectorAll(".value-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isOpen = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // ==========================================================================
  // MANIFESTO — minijogo: cada borrifada pinta uma frase na parede
  // ==========================================================================

  const manifestoGame = document.querySelector("[data-manifesto]");

  if (manifestoGame) {
    const slides = [...manifestoGame.querySelectorAll("[data-mf-slide]")].map(
      (slide) => slide.innerHTML.trim()
    );
    const wall = manifestoGame.querySelector(".mf-wall");
    const text = manifestoGame.querySelector("[data-mf-text]");
    const count = manifestoGame.querySelector("[data-mf-count]");
    const progress = manifestoGame.querySelector("[data-mf-progress]");
    const next = manifestoGame.querySelector("[data-mf-next]");
    const nextLabel = manifestoGame.querySelector("[data-mf-label]");
    const back = manifestoGame.querySelector("[data-mf-back]");
    const total = slides.length;
    const pad = (n) => String(n).padStart(2, "0");
    let current = 0; // 0 = parede limpa, 1..total = frase pintada

    progress.innerHTML = "<span></span>".repeat(total);
    const bars = [...progress.children];
    text.classList.add("is-idle");

    const paint = (sentence) => {
      text.classList.remove("is-idle");
      text.textContent = "";

      const words = sentence.split(/\s+/).map((word, index, all) => {
        const span = document.createElement("span");
        span.className = "gw-word";
        span.textContent = word;
        span.style.setProperty("--i", index);
        span.style.setProperty("--tilt", `${(Math.random() * 2 - 1).toFixed(2)}deg`);

        text.appendChild(span);
        if (index < all.length - 1) text.appendChild(document.createTextNode(" "));
        return span;
      });

      wall.style.setProperty("--mist-x", `${Math.round(20 + Math.random() * 60)}%`);
      wall.style.setProperty("--mist-y", `${Math.round(30 + Math.random() * 40)}%`);
      wall.classList.remove("is-spraying");
      void wall.offsetWidth; // reinicia a animação da névoa
      wall.classList.add("is-spraying");

      if (prefersReducedMotion) {
        words.forEach((word) => word.classList.add("is-painted"));
      } else {
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            words.forEach((word) => word.classList.add("is-painted"))
          )
        );
      }
    };

    const render = () => {
      if (current === 0) {
        text.classList.add("is-idle");
        text.textContent = "Toda grande árvore começou pequena…";
      } else {
        paint(slides[current - 1]);
      }

      count.textContent = `${pad(current)} / ${pad(total)}`;
      bars.forEach((bar, index) => bar.classList.toggle("is-done", index < current));
      back.disabled = current === 0;

      if (current === 0) nextLabel.textContent = "Grafitar a primeira frase";
      else if (current === total) nextLabel.textContent = "Pintar de novo";
      else nextLabel.textContent = "Grafitar a próxima frase";
    };

    next.addEventListener("click", () => {
      current = current === total ? 1 : current + 1;
      render();
    });

    back.addEventListener("click", () => {
      if (current > 0) current -= 1;
      render();
    });

    render();
  }

  // ==========================================================================
  // QUEM FAZ ACONTECER — balões na foto (toque no celular)
  // ==========================================================================

  const teamSpots = document.querySelectorAll(".team-spot");

  teamSpots.forEach((spot) => {
    spot.addEventListener("click", () => {
      const isOpen = spot.getAttribute("aria-expanded") === "true";
      teamSpots.forEach((other) => other.setAttribute("aria-expanded", "false"));
      spot.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".team-spot")) {
      teamSpots.forEach((spot) => spot.setAttribute("aria-expanded", "false"));
    }
  });

  // ==========================================================================
  // ANO AUTOMÁTICO DO RODAPÉ
  // ==========================================================================

  const year = document.querySelector("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
});