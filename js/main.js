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
  // MANIFESTO GRAFITADO — palavras "pintadas" conforme a rolagem
  // ==========================================================================

  const graffitiWall = document.querySelector("[data-graffiti]");

  if (graffitiWall && !prefersReducedMotion) {
    const manifesto = graffitiWall.querySelector(".manifesto");
    const paragraphs = [...manifesto.querySelectorAll("p")];
    const nozzle = document.createElement("span");
    nozzle.className = "gw-nozzle";
    nozzle.setAttribute("aria-hidden", "true");
    manifesto.appendChild(nozzle);

    // Quebra cada parágrafo em palavras (o texto continua legível para leitores de tela)
    const groups = paragraphs.map((paragraph) => {
      const words = paragraph.textContent.trim().split(/\s+/);
      paragraph.setAttribute("aria-label", paragraph.textContent.trim());
      paragraph.textContent = "";

      return words.map((text, index) => {
        const word = document.createElement("span");
        word.className = "gw-word";
        word.setAttribute("aria-hidden", "true");
        word.textContent = text;
        word.style.setProperty("--tilt", `${(Math.random() * 2 - 1).toFixed(2)}deg`);

        if (text.length > 4 && Math.random() < 0.06) {
          word.classList.add("has-drip");
          word.style.setProperty("--drip-x", `${Math.round(20 + Math.random() * 60)}%`);
          word.style.setProperty("--drip-h", `${Math.round(10 + Math.random() * 22)}px`);
        }

        paragraph.appendChild(word);
        if (index < words.length - 1) paragraph.appendChild(document.createTextNode(" "));
        return word;
      });
    });

    let graffitiTicking = false;

    const paintFromScroll = () => {
      const viewport = window.innerHeight;
      let lastPainted = null;
      let painting = false;

      paragraphs.forEach((paragraph, i) => {
        const rect = paragraph.getBoundingClientRect();
        const start = viewport * 0.85;
        const progress = Math.min(
          Math.max((start - rect.top) / (rect.height + viewport * 0.3), 0),
          1
        );
        const words = groups[i];
        const count = Math.round(progress * words.length);

        words.forEach((word, index) => {
          word.classList.toggle("is-painted", index < count);
        });

        if (count > 0) lastPainted = words[count - 1];
        if (count > 0 && count < words.length) painting = true;
      });

      if (lastPainted && painting) {
        nozzle.style.transform = `translate(${lastPainted.offsetLeft + lastPainted.offsetWidth}px, ${lastPainted.offsetTop + lastPainted.offsetHeight / 2}px)`;
        nozzle.classList.add("is-active");
      } else {
        nozzle.classList.remove("is-active");
      }

      graffitiTicking = false;
    };

    window.addEventListener("scroll", () => {
      if (graffitiTicking) return;
      graffitiTicking = true;
      window.requestAnimationFrame(paintFromScroll);
    }, { passive: true });

    window.addEventListener("resize", paintFromScroll, { passive: true });
    paintFromScroll();
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