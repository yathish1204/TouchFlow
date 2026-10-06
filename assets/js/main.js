/**
 * TouchFlow Visitor Registration — Main Controller
 */

(() => {
  "use strict";

  // --- DOM References ---
  // Desktop / Tablet Header Controls
  const langBtn = document.getElementById("langBtn");
  const langDropdown = document.getElementById("langDropdown");
  const currentLangLabel = document.getElementById("currentLangLabel");
  const langOptions = document.querySelectorAll(".lang-option");

  const helpBtn = document.getElementById("helpBtn");
  const helpDropdown = document.getElementById("helpDropdown");

  // Mobile Drawer Controls
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileDrawerOverlay = document.getElementById("mobileDrawerOverlay");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");

  // Drawer Expandable Language Dropdown
  const drawerLangTrigger = document.getElementById("drawerLangTrigger");
  const drawerLangMenu = document.getElementById("drawerLangMenu");
  const drawerCurrentLangLabel = document.getElementById(
    "drawerCurrentLangLabel",
  );
  const drawerLangItems = document.querySelectorAll(".drawer-lang-item");

  // Drawer Support & Assistance Dropdown
  const drawerHelpTrigger = document.getElementById("drawerHelpTrigger");
  const drawerHelpMenu = document.getElementById("drawerHelpMenu");

  // Display & Contrast Toggles
  const toggleContrastBtn = document.getElementById("toggleContrastBtn");
  const toggleFontBtn = document.getElementById("toggleFontBtn");

  // Screens & Navigation
  const welcomeScreen = document.getElementById("welcomeScreen");
  const step1Section = document.getElementById("step1Section");
  const step2Section = document.getElementById("step2Section");
  const step3Section = document.getElementById("step3Section");
  const step4Section = document.getElementById("step4Section");
  const confirmationSection = document.getElementById("confirmationSection");
  const flowFooter = document.getElementById("flowFooter");
  const btnGetStarted = document.getElementById("btnGetStarted");
  const btnFlowBack = document.getElementById("btnFlowBack");
  const btnFlowContinue = document.getElementById("btnFlowContinue");
  const backChevronIcon = document.getElementById("backChevronIcon");
  const btnBackText = document.getElementById("btnBackText");
  const btnContinueText = document.getElementById("btnContinueText");
  const btnDoneSession = document.getElementById("btnDoneSession");
  const resetCountdown = document.getElementById("resetCountdown");
  const checkAnimationWrap = document.getElementById("checkAnimationWrap");
  const footerStepLabel = document.getElementById("footerStepLabel");
  const footerStepTrack = document.getElementById("footerStepTrack");
  const footerSegments = footerStepTrack
    ? footerStepTrack.querySelectorAll(".progress-segment")
    : [];
  const purposeCards = document.querySelectorAll(".purpose-card");
  const otpBoxes = document.querySelectorAll(".otp-box");
  const btnSendCode = document.getElementById("btnSendCode");
  const resendCountdown = document.getElementById("resendCountdown");
  const otpResendWrap = document.getElementById("otpResendWrap");
  const otpVerifiedTag = document.getElementById("otpVerifiedTag");

  // Step 3 Live Camera Elements
  const captureFrame = document.getElementById("captureFrame");
  const cameraVideo = document.getElementById("cameraVideo");
  const capturedPhotoImg = document.getElementById("capturedPhotoImg");
  const captureCanvas = document.getElementById("captureCanvas");
  const captureFlash = document.getElementById("captureFlash");
  const captureStatusBadge = document.getElementById("captureStatusBadge");
  const captureStatusText = document.getElementById("captureStatusText");
  const btnRetakePhoto = document.getElementById("btnRetakePhoto");
  const cameraFallback = document.getElementById("cameraFallback");
  const btnRequestCamera = document.getElementById("btnRequestCamera");

  // Step 4 & Confirmation Elements
  const reviewAvatarImg = document.getElementById("reviewAvatarImg");
  const passPhotoImg = document.getElementById("passPhotoImg");
  const fullNameInput = document.getElementById("fullNameInput");
  const contactNumberInput = document.getElementById("contactNumberInput");
  const idNumberInput = document.getElementById("idNumberInput");
  const phoneInputGroup = document.getElementById("phoneInputGroup");
  const nameInputWrap = document.getElementById("nameInputWrap");
  const idInputWrap = document.getElementById("idInputWrap");
  const otpBoxesGroup = document.getElementById("otpBoxesGroup");
  const phoneError = document.getElementById("phoneError");
  const otpError = document.getElementById("otpError");
  const nameError = document.getElementById("nameError");
  const idError = document.getElementById("idError");
  const otpHelperText = document.getElementById("otpHelperText");

  const reviewFullName = document.getElementById("reviewFullName");
  const reviewPhone = document.getElementById("reviewPhone");
  const reviewGovId = document.getElementById("reviewGovId");
  const reviewPurpose = document.getElementById("reviewPurpose");
  const reviewDateTime = document.getElementById("reviewDateTime");

  const passFullName = document.getElementById("passFullName");
  const passPhone = document.getElementById("passPhone");
  const passGovId = document.getElementById("passGovId");
  const passPurpose = document.getElementById("passPurpose");

  let currentPurpose = "Interview";
  let currentScreen = "step-2";
  let otpVerificationTimer = null;
  let confirmationTimer = null;
  let resendInterval = null;
  let countdownSeconds = 10;
  let mediaStream = null;
  let capturedImageDataUrl = null;
  let autoCaptureTimer = null;
  let isPhotoCaptured = false;

  function updateFooterStepper(stepNum) {
    if (footerStepLabel) {
      footerStepLabel.textContent = `Step ${stepNum} of 4`;
    }
    if (footerSegments && footerSegments.length) {
      footerSegments.forEach((seg, idx) => {
        if (idx < stepNum) {
          seg.classList.add("is-active");
        } else {
          seg.classList.remove("is-active");
        }
      });
    }
  }

  // --- 1. Screen Switching Controller ---
  function showScreen(screenId) {
    currentScreen = screenId;

    if (welcomeScreen) {
      welcomeScreen.hidden = screenId !== "welcome";
      welcomeScreen.style.display = screenId === "welcome" ? "" : "none";
    }
    if (step1Section) {
      step1Section.hidden = screenId !== "step-1";
      step1Section.style.display = screenId === "step-1" ? "" : "none";
    }
    if (step2Section) {
      step2Section.hidden = screenId !== "step-2";
      step2Section.style.display = screenId === "step-2" ? "" : "none";
    }
    if (step3Section) {
      step3Section.hidden = screenId !== "step-3";
      step3Section.style.display = screenId === "step-3" ? "" : "none";
    }
    if (step4Section) {
      step4Section.hidden = screenId !== "step-4";
      step4Section.style.display = screenId === "step-4" ? "" : "none";
    }
    if (confirmationSection) {
      confirmationSection.hidden = screenId !== "confirmation";
      confirmationSection.style.display =
        screenId === "confirmation" ? "" : "none";
    }

    if (flowFooter) {
      const showFooter =
        screenId === "step-1" ||
        screenId === "step-2" ||
        screenId === "step-3" ||
        screenId === "step-4";
      flowFooter.hidden = !showFooter;
      flowFooter.style.display = showFooter ? "" : "none";

      // Update button text and icons based on screen
      if (screenId === "step-4") {
        if (backChevronIcon) backChevronIcon.style.display = "none";
        if (btnBackText) btnBackText.textContent = "Edit Details";
        if (btnContinueText) btnContinueText.textContent = "Confirm Check-in";
      } else {
        if (backChevronIcon) backChevronIcon.style.display = "";
        if (btnBackText) btnBackText.textContent = "Back";
        if (btnContinueText) btnContinueText.textContent = "Continue";
      }

      // Update footer stepper state (count and active segments)
      if (screenId === "step-1") updateFooterStepper(1);
      else if (screenId === "step-2") updateFooterStepper(2);
      else if (screenId === "step-3") updateFooterStepper(3);
      else if (screenId === "step-4") updateFooterStepper(4);
    }

    const expectedHash = `#${screenId}`;
    if (window.location.hash !== expectedHash) {
      window.location.hash = expectedHash;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Trigger OTP verification check after 3 seconds
    if (screenId === "step-2") {
      const phoneDigits = contactNumberInput
        ? contactNumberInput.value.replace(/\D/g, "")
        : "";
      if (
        phoneDigits.length >= 10 &&
        (!otpVerifiedTag || otpVerifiedTag.hidden)
      ) {
        scheduleOtpVerification();
      }
    } else if (otpVerificationTimer) {
      clearTimeout(otpVerificationTimer);
      otpVerificationTimer = null;
    }

    // Trigger Camera on Step 3
    if (screenId === "step-3") {
      startCamera();
    } else {
      stopCamera();
    }

    // Sync visitor details when reaching Step 3, Step 4 or Confirmation
    if (
      screenId === "step-3" ||
      screenId === "step-4" ||
      screenId === "confirmation"
    ) {
      syncUserDetails();
    }

    // Trigger confirmation screen check animation & 10s auto-reset
    if (screenId === "confirmation") {
      startConfirmationSession();
    } else {
      clearConfirmationTimer();
    }
  }

  function clearConfirmationTimer() {
    if (confirmationTimer) {
      clearInterval(confirmationTimer);
      confirmationTimer = null;
    }
  }

  function startConfirmationSession() {
    clearConfirmationTimer();
    countdownSeconds = 15;
    if (resetCountdown) resetCountdown.textContent = "10";

    // Trigger check animation
    if (checkAnimationWrap) {
      checkAnimationWrap.classList.remove("play-check-anim");
      void checkAnimationWrap.offsetWidth;
      checkAnimationWrap.classList.add("play-check-anim");
    }

    confirmationTimer = setInterval(() => {
      countdownSeconds -= 1;
      if (resetCountdown) {
        resetCountdown.textContent = countdownSeconds;
      }
      if (countdownSeconds <= 0) {
        clearConfirmationTimer();
        resetToWelcome();
      }
    }, 1000);
  }

  function resetToWelcome() {
    clearConfirmationTimer();
    stopCamera();
    if (resendInterval) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
    isPhotoCaptured = false;
    capturedImageDataUrl = null;
    if (capturedPhotoImg) capturedPhotoImg.hidden = true;
    if (cameraVideo) cameraVideo.hidden = false;
    if (captureFrame) captureFrame.classList.remove("is-captured");
    if (captureStatusBadge) captureStatusBadge.classList.remove("is-success");
    if (captureStatusText)
      captureStatusText.textContent = "Align face within circle";
    if (btnRetakePhoto) btnRetakePhoto.hidden = true;
    if (reviewAvatarImg)
      reviewAvatarImg.src = "assets/images/capture-portrait.png";
    if (passPhotoImg) passPhotoImg.src = "assets/images/capture-portrait.png";
    if (otpVerifiedTag) otpVerifiedTag.hidden = true;
    if (otpResendWrap) {
      otpResendWrap.classList.remove("is-disabled");
      otpResendWrap.removeAttribute("aria-disabled");
      otpResendWrap.innerHTML =
        'Resend in <span id="resendCountdown">30</span> seconds';
    }
    otpBoxes.forEach((b) => {
      b.value = "";
      b.disabled = false;
      b.classList.remove("is-verified", "is-error", "is-focused");
    });
    if (contactNumberInput) contactNumberInput.value = "";
    if (fullNameInput) fullNameInput.value = "";
    if (idNumberInput) idNumberInput.value = "";
    if (otpHelperText) {
      otpHelperText.textContent =
        "We'll send a 4 digit code to verify your number";
    }

    // Clear validation error highlights and error messages
    document
      .querySelectorAll(".is-error")
      .forEach((el) => el.classList.remove("is-error"));
    document
      .querySelectorAll(".form-field-error")
      .forEach((el) => (el.hidden = true));

    showScreen("welcome");
  }

  // Helper to mark OTP as verified across UI
  function markOtpVerified() {
    if (otpVerifiedTag) {
      otpVerifiedTag.hidden = false;
    }
    otpBoxes.forEach((b) => {
      b.disabled = true;
      b.classList.remove("is-focused", "is-error");
      b.classList.add("is-verified");
    });
    if (otpError) otpError.hidden = true;
    if (otpResendWrap) {
      otpResendWrap.classList.add("is-disabled");
      otpResendWrap.setAttribute("aria-disabled", "true");
    }
    if (otpVerificationTimer) {
      clearTimeout(otpVerificationTimer);
      otpVerificationTimer = null;
    }
  }

  // Resend Countdown Timer helper
  function startResendCountdown(seconds = 30) {
    if (resendInterval) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
    let remaining = seconds;
    if (otpResendWrap) {
      otpResendWrap.innerHTML = `Resend in <span id="resendCountdown">${remaining}</span> seconds`;
      otpResendWrap.classList.remove("is-disabled");
    }
    resendInterval = setInterval(() => {
      remaining--;
      const countSpan = document.getElementById("resendCountdown");
      if (countSpan) countSpan.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(resendInterval);
        resendInterval = null;
        if (otpResendWrap && (!otpVerifiedTag || otpVerifiedTag.hidden)) {
          otpResendWrap.textContent = "Resend Code";
          otpResendWrap.classList.remove("is-disabled");
        }
      }
    }, 1000);
  }

  // Schedule check for OTP verified after 3 seconds
  function scheduleOtpVerification() {
    if (otpVerificationTimer) {
      clearTimeout(otpVerificationTimer);
      otpVerificationTimer = null;
    }

    // Reset to initial active state
    if (otpVerifiedTag) otpVerifiedTag.hidden = true;
    if (otpResendWrap) {
      otpResendWrap.classList.remove("is-disabled");
      otpResendWrap.removeAttribute("aria-disabled");
    }
    otpBoxes.forEach((b, i) => {
      b.disabled = false;
      b.classList.remove("is-verified", "is-error");
      if (i === 0 && !b.value) b.classList.add("is-focused");
      else b.classList.remove("is-focused");
    });
    if (otpError) otpError.hidden = true;

    startResendCountdown(30);

    // Exactly 3 seconds: show verified tag,
    otpVerificationTimer = setTimeout(() => {
      if (currentScreen !== "step-2") return;

      const sampleOtp = ["7", "4", "3", "1"];
      otpBoxes.forEach((b, i) => {
        if (!b.value) {
          b.value = sampleOtp[i] || "1";
        }
      });

      markOtpVerified();
    }, 3000);
  }

  // Determine initial screen based on hash, defaulting to 'step-2'
  function getScreenFromHash() {
    const hash = window.location.hash;
    if (hash === "#welcome") return "welcome";
    if (hash === "#step-1") return "step-1";
    if (hash === "#step-2") return "step-2";
    if (hash === "#step-3") return "step-3";
    if (hash === "#step-4") return "step-4";
    if (hash === "#confirmation") return "confirmation";
    return "step-2";
  }

  showScreen(getScreenFromHash());

  window.addEventListener("hashchange", () => {
    showScreen(getScreenFromHash());
  });

  const brandLink = document.querySelector(".brand-link");
  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetToWelcome();
    });
  }

  // --- 2. Purpose Card Selection (Radio Group) ---
  purposeCards.forEach((card) => {
    card.addEventListener("click", () => {
      purposeCards.forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("is-selected");
      card.setAttribute("aria-checked", "true");
      currentPurpose = card.dataset.purpose || "Other";
      syncUserDetails();
    });
  });

  // Flow Navigation Buttons
  if (btnGetStarted) {
    btnGetStarted.addEventListener("click", () => {
      showScreen("step-1");
    });
  }

  if (btnFlowBack) {
    btnFlowBack.addEventListener("click", () => {
      if (currentScreen === "step-4") {
        showScreen("step-3");
      } else if (currentScreen === "step-3") {
        showScreen("step-2");
      } else if (currentScreen === "step-2") {
        showScreen("step-1");
      } else if (currentScreen === "step-1") {
        showScreen("welcome");
      }
    });
  }

  if (btnFlowContinue) {
    btnFlowContinue.addEventListener("click", () => {
      if (currentScreen === "step-1") {
        showScreen("step-2");
      } else if (currentScreen === "step-2") {
        // Enforce required fields validation before advancing
        if (!validateStep2()) {
          return;
        }
        syncUserDetails();
        showScreen("step-3");
      } else if (currentScreen === "step-3") {
        if (!isPhotoCaptured) {
          captureLivePhoto();
        }
        syncUserDetails();
        showScreen("step-4");
      } else if (currentScreen === "step-4") {
        syncUserDetails();
        showScreen("confirmation");
      }
    });
  }

  // Confirmation screen Done button
  if (btnDoneSession) {
    btnDoneSession.addEventListener("click", () => {
      resetToWelcome();
    });
  }

  // Real-time input handling & validation clearing for Step 2
  if (contactNumberInput) {
    contactNumberInput.addEventListener("input", (e) => {
      // Allow only numbers, max 10 digits
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      e.target.value = digits;

      if (digits.length >= 10) {
        if (phoneInputGroup) phoneInputGroup.classList.remove("is-error");
        if (phoneError) phoneError.hidden = true;
        if (otpHelperText) {
          otpHelperText.textContent = `We've sent a 4 digit code to +91 ${digits}`;
        }
      }
      syncUserDetails();
    });
  }

  if (fullNameInput) {
    fullNameInput.addEventListener("input", (e) => {
      if (e.target.value.trim().length >= 2) {
        if (nameInputWrap) nameInputWrap.classList.remove("is-error");
        if (nameError) nameError.hidden = true;
      }
      syncUserDetails();
    });
  }

  if (idNumberInput) {
    idNumberInput.addEventListener("input", (e) => {
      if (e.target.value.trim().length >= 3) {
        if (idInputWrap) idInputWrap.classList.remove("is-error");
        if (idError) idError.hidden = true;
      }
      syncUserDetails();
    });
  }

  // Step 2 OTP auto-advance & input behavior
  otpBoxes.forEach((box, idx) => {
    box.addEventListener("input", (e) => {
      const val = e.target.value.replace(/\D/g, "");
      e.target.value = val ? val[0] : "";
      box.classList.remove("is-error");
      if (otpError) otpError.hidden = true;

      if (val && idx < otpBoxes.length - 1) {
        otpBoxes.forEach((b) => b.classList.remove("is-focused"));
        otpBoxes[idx + 1].classList.add("is-focused");
        otpBoxes[idx + 1].focus();
      }

      // If all 4 boxes are now filled with digits, automatically mark verified
      const allFilled = Array.from(otpBoxes).every(
        (b) => b.value && b.value.length === 1,
      );
      if (allFilled) {
        markOtpVerified();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0) {
        otpBoxes.forEach((b) => b.classList.remove("is-focused"));
        otpBoxes[idx - 1].classList.add("is-focused");
        otpBoxes[idx - 1].focus();
      }
    });

    box.addEventListener("focus", () => {
      otpBoxes.forEach((b) => b.classList.remove("is-focused"));
      box.classList.add("is-focused");
    });
  });

  if (btnSendCode) {
    btnSendCode.addEventListener("click", () => {
      const digits = contactNumberInput
        ? contactNumberInput.value.replace(/\D/g, "")
        : "";
      if (!digits || digits.length < 10) {
        if (phoneInputGroup) phoneInputGroup.classList.add("is-error");
        if (phoneError) {
          phoneError.hidden = false;
          phoneError.textContent = !digits
            ? "Please enter your contact number first"
            : "Please enter a valid 10-digit mobile number";
        }
        if (contactNumberInput) contactNumberInput.focus();
        return;
      }

      if (phoneInputGroup) phoneInputGroup.classList.remove("is-error");
      if (phoneError) phoneError.hidden = true;

      btnSendCode.textContent = "Code Sent";
      btnSendCode.disabled = true;
      if (otpHelperText) {
        otpHelperText.textContent = `We've sent a 4 digit code to +91 ${digits}`;
      }

      scheduleOtpVerification();

      setTimeout(() => {
        btnSendCode.textContent = "Send Code";
        btnSendCode.disabled = false;
      }, 3000);
    });
  }

  // --- Live Camera Controller (Step 3) ---
  async function startCamera() {
    if (isPhotoCaptured && capturedImageDataUrl) {
      if (capturedPhotoImg) {
        capturedPhotoImg.src = capturedImageDataUrl;
        capturedPhotoImg.hidden = false;
      }
      if (cameraVideo) cameraVideo.hidden = true;
      if (captureFrame) captureFrame.classList.add("is-captured");
      if (captureStatusBadge) captureStatusBadge.classList.add("is-success");
      if (captureStatusText)
        captureStatusText.textContent = "Photo captured successfully! ✓";
      if (btnRetakePhoto) btnRetakePhoto.hidden = false;
      if (cameraFallback) cameraFallback.hidden = true;
      return;
    }

    if (capturedPhotoImg) capturedPhotoImg.hidden = true;
    if (cameraVideo) cameraVideo.hidden = false;
    if (captureFrame) captureFrame.classList.remove("is-captured");
    if (captureStatusBadge) captureStatusBadge.classList.remove("is-success");
    if (captureStatusText)
      captureStatusText.textContent = "Align face within circle";
    if (btnRetakePhoto) btnRetakePhoto.hidden = true;
    if (cameraFallback) cameraFallback.hidden = true;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 720 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cameraVideo) {
          cameraVideo.srcObject = mediaStream;
          await cameraVideo.play().catch(() => {});
        }

        scheduleAutoCapture();
      } else {
        showCameraFallback();
      }
    } catch (err) {
      console.warn("Camera access unavailable or denied:", err);
      showCameraFallback();
    }
  }

  function stopCamera() {
    clearTimeout(autoCaptureTimer);
    autoCaptureTimer = null;

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      mediaStream = null;
    }

    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
  }

  function scheduleAutoCapture() {
    clearTimeout(autoCaptureTimer);
    autoCaptureTimer = setTimeout(() => {
      if (currentScreen === "step-3" && !isPhotoCaptured) {
        captureLivePhoto();
      }
    }, 3500);
  }

  function captureLivePhoto() {
    clearTimeout(autoCaptureTimer);
    autoCaptureTimer = null;

    if (captureFlash) {
      captureFlash.classList.add("flash-active");
      setTimeout(() => {
        captureFlash.classList.remove("flash-active");
      }, 180);
    }

    try {
      if (captureCanvas && cameraVideo && cameraVideo.videoWidth > 0) {
        const ctx = captureCanvas.getContext("2d");
        const vW = cameraVideo.videoWidth;
        const vH = cameraVideo.videoHeight;
        const size = Math.min(vW, vH);
        const sX = (vW - size) / 2;
        const sY = (vH - size) / 2;

        captureCanvas.width = 480;
        captureCanvas.height = 480;

        ctx.save();
        ctx.translate(480, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(cameraVideo, sX, sY, size, size, 0, 0, 480, 480);
        ctx.restore();

        capturedImageDataUrl = captureCanvas.toDataURL("image/jpeg", 0.92);
      } else {
        generateFallbackPhoto();
      }
    } catch (e) {
      generateFallbackPhoto();
    }

    isPhotoCaptured = true;

    if (capturedPhotoImg && capturedImageDataUrl) {
      capturedPhotoImg.src = capturedImageDataUrl;
      capturedPhotoImg.hidden = false;
    }
    if (cameraVideo) cameraVideo.hidden = true;
    if (captureFrame) captureFrame.classList.add("is-captured");
    if (captureStatusBadge) captureStatusBadge.classList.add("is-success");
    if (captureStatusText)
      captureStatusText.textContent = "Photo captured successfully! ✓";
    if (btnRetakePhoto) btnRetakePhoto.hidden = false;

    if (reviewAvatarImg && capturedImageDataUrl) {
      reviewAvatarImg.src = capturedImageDataUrl;
    }
    if (passPhotoImg && capturedImageDataUrl) {
      passPhotoImg.src = capturedImageDataUrl;
    }

    stopCamera();
  }

  function retakePhoto() {
    isPhotoCaptured = false;
    capturedImageDataUrl = null;
    startCamera();
  }

  function showCameraFallback() {
    if (cameraFallback) cameraFallback.hidden = false;
    if (cameraVideo) cameraVideo.hidden = true;
    if (capturedPhotoImg) capturedPhotoImg.hidden = true;
    if (captureStatusText)
      captureStatusText.textContent =
        "Camera offline. Generating visitor photo";

    generateFallbackPhoto();
    setTimeout(() => {
      if (currentScreen === "step-3" && !isPhotoCaptured) {
        captureLivePhoto();
      }
    }, 2000);
  }

  function generateFallbackPhoto() {
    if (!captureCanvas) return;
    const ctx = captureCanvas.getContext("2d");
    captureCanvas.width = 480;
    captureCanvas.height = 480;

    const fallbackImg = new Image();
    fallbackImg.crossOrigin = "anonymous";
    fallbackImg.src = "assets/images/capture-portrait.png";
    fallbackImg.onload = () => {
      ctx.drawImage(fallbackImg, 0, 0, 480, 480);
      capturedImageDataUrl = captureCanvas.toDataURL("image/jpeg", 0.92);
      if (reviewAvatarImg) reviewAvatarImg.src = capturedImageDataUrl;
      if (passPhotoImg) passPhotoImg.src = capturedImageDataUrl;
      if (capturedPhotoImg) capturedPhotoImg.src = capturedImageDataUrl;
    };
  }

  function formatCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} · ${hours}:${minutes} ${ampm}`;
  }

  function validateStep2() {
    let isValid = true;
    let firstInvalidElement = null;

    // 1. Validate Contact Number (required, minimum 10 digits)
    const phoneVal = contactNumberInput
      ? contactNumberInput.value.replace(/\D/g, "")
      : "";
    if (!phoneVal || phoneVal.length < 10) {
      isValid = false;
      if (phoneInputGroup) phoneInputGroup.classList.add("is-error");
      if (phoneError) {
        phoneError.hidden = false;
        phoneError.textContent = !phoneVal
          ? "Please enter your contact number"
          : "Please enter a valid 10-digit mobile number";
      }
      if (!firstInvalidElement && contactNumberInput)
        firstInvalidElement = contactNumberInput;
    } else {
      if (phoneInputGroup) phoneInputGroup.classList.remove("is-error");
      if (phoneError) phoneError.hidden = true;
    }

    // 2. Validate OTP (all 4 digits required or verified)
    let otpFilled = true;
    let firstEmptyOtpBox = null;
    otpBoxes.forEach((box) => {
      if (!box.value || box.value.trim() === "") {
        otpFilled = false;
        if (!firstEmptyOtpBox) firstEmptyOtpBox = box;
      }
    });

    const isOtpVerified = otpVerifiedTag && !otpVerifiedTag.hidden;
    if (!otpFilled && !isOtpVerified) {
      isValid = false;
      otpBoxes.forEach((box) => {
        if (!box.value) box.classList.add("is-error");
      });
      if (otpError) {
        otpError.hidden = false;
        otpError.textContent = "Please enter the 4-digit verification code";
      }
      if (!firstInvalidElement && firstEmptyOtpBox)
        firstInvalidElement = firstEmptyOtpBox;
    } else {
      otpBoxes.forEach((box) => box.classList.remove("is-error"));
      if (otpError) otpError.hidden = true;
    }

    // 3. Validate Full Name (required)
    const nameVal = fullNameInput ? fullNameInput.value.trim() : "";
    if (!nameVal || nameVal.length < 2) {
      isValid = false;
      if (nameInputWrap) nameInputWrap.classList.add("is-error");
      if (nameError) {
        nameError.hidden = false;
        nameError.textContent =
          "Please enter your full name as per government ID";
      }
      if (!firstInvalidElement && fullNameInput)
        firstInvalidElement = fullNameInput;
    } else {
      if (nameInputWrap) nameInputWrap.classList.remove("is-error");
      if (nameError) nameError.hidden = true;
    }

    // 4. Validate ID Number (required)
    const idVal = idNumberInput ? idNumberInput.value.trim() : "";
    if (!idVal || idVal.length < 3) {
      isValid = false;
      if (idInputWrap) idInputWrap.classList.add("is-error");
      if (idError) {
        idError.hidden = false;
        idError.textContent = "Please enter your government ID number";
      }
      if (!firstInvalidElement && idNumberInput)
        firstInvalidElement = idNumberInput;
    } else {
      if (idInputWrap) idInputWrap.classList.remove("is-error");
      if (idError) idError.hidden = true;
    }

    // Focus first invalid element for optimal accessibility
    if (!isValid && firstInvalidElement) {
      firstInvalidElement.focus();
    }

    return isValid;
  }

  function syncUserDetails() {
    const rawName = (fullNameInput && fullNameInput.value.trim()) || "";
    const rawPhone =
      (contactNumberInput && contactNumberInput.value.replace(/\D/g, "")) || "";
    const rawGovId = (idNumberInput && idNumberInput.value.trim()) || "";
    const purpose = currentPurpose || "Interview";

    // Exact entered values carry through seamlessly
    const name = rawName || "Yathish Shettigar";
    const phone = rawPhone ? `+91 ${rawPhone}` : "+91 9874563210";
    const govId = rawGovId || "9874 5455 4455";

    // Step 4 Review Card
    if (reviewFullName) reviewFullName.textContent = name;
    if (reviewPhone) reviewPhone.textContent = phone;
    if (reviewGovId) reviewGovId.textContent = govId;
    if (reviewPurpose) reviewPurpose.textContent = purpose;
    if (reviewDateTime) reviewDateTime.textContent = formatCurrentDateTime();

    // Confirmation Digital Visitor Pass
    if (passFullName) passFullName.textContent = name;
    if (passPhone) passPhone.textContent = phone;
    if (passGovId) passGovId.textContent = govId;
    if (passPurpose) passPurpose.textContent = purpose;

    // Accessibility image alt text
    if (reviewAvatarImg) reviewAvatarImg.alt = name;
    if (passPhotoImg) passPhotoImg.alt = name;

    // Carry captured photo preview
    if (capturedImageDataUrl) {
      if (reviewAvatarImg) reviewAvatarImg.src = capturedImageDataUrl;
      if (passPhotoImg) passPhotoImg.src = capturedImageDataUrl;
    }
  }

  if (btnRetakePhoto) {
    btnRetakePhoto.addEventListener("click", () => {
      retakePhoto();
    });
  }

  if (btnRequestCamera) {
    btnRequestCamera.addEventListener("click", () => {
      if (cameraFallback) cameraFallback.hidden = true;
      startCamera();
    });
  }

  if (captureFrame) {
    captureFrame.addEventListener("click", () => {
      if (
        !isPhotoCaptured &&
        cameraVideo &&
        !cameraVideo.hidden &&
        mediaStream
      ) {
        captureLivePhoto();
      }
    });
  }

  // --- 3. Language Dropdown (Desktop / Tablet) ---
  function toggleLangDropdown(event) {
    if (event) event.stopPropagation();
    if (helpDropdown && !helpDropdown.hidden) {
      helpDropdown.hidden = true;
      if (helpBtn) helpBtn.setAttribute("aria-expanded", "false");
    }
    const isExpanded = langBtn.getAttribute("aria-expanded") === "true";
    langBtn.setAttribute("aria-expanded", !isExpanded);
    langDropdown.hidden = isExpanded;
  }

  function toggleHelpDropdown(event) {
    if (event) event.stopPropagation();
    if (langDropdown && !langDropdown.hidden) {
      langDropdown.hidden = true;
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
    const isExpanded = helpBtn.getAttribute("aria-expanded") === "true";
    helpBtn.setAttribute("aria-expanded", !isExpanded);
    if (helpDropdown) {
      helpDropdown.hidden = isExpanded;
    }
  }

  function closeAllDropdowns() {
    if (langDropdown && !langDropdown.hidden) {
      langDropdown.hidden = true;
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
    if (helpDropdown && !helpDropdown.hidden) {
      helpDropdown.hidden = true;
      if (helpBtn) helpBtn.setAttribute("aria-expanded", "false");
    }
    if (drawerLangMenu && !drawerLangMenu.hidden) {
      drawerLangMenu.hidden = true;
      if (drawerLangTrigger)
        drawerLangTrigger.setAttribute("aria-expanded", "false");
    }
    if (drawerHelpMenu && !drawerHelpMenu.hidden) {
      drawerHelpMenu.hidden = true;
      if (drawerHelpTrigger)
        drawerHelpTrigger.setAttribute("aria-expanded", "false");
    }
  }

  function selectLanguage(langName) {
    if (currentLangLabel) {
      currentLangLabel.textContent = langName;
    }
    if (drawerCurrentLangLabel) {
      drawerCurrentLangLabel.textContent =
        langName === "English" ? "English (US)" : langName;
    }

    // Update active state in desktop dropdown
    langOptions.forEach((opt) => {
      const isMatch = opt.dataset.lang === langName;
      opt.classList.toggle("is-active", isMatch);
      opt.setAttribute("aria-selected", isMatch);
      let checkmark = opt.querySelector(".check-mark");
      if (isMatch) {
        if (!checkmark) {
          checkmark = document.createElement("span");
          checkmark.className = "check-mark";
          checkmark.style.color = "#18b968";
          checkmark.style.fontWeight = "bold";
          checkmark.textContent = "✓";
          opt.appendChild(checkmark);
        }
      } else if (checkmark) {
        checkmark.remove();
      }
    });

    // Update active state in mobile drawer dropdown
    drawerLangItems.forEach((item) => {
      const isMatch = item.dataset.lang === langName;
      item.classList.toggle("is-active", isMatch);
      item.setAttribute("aria-selected", isMatch);
      let checkmark = item.querySelector(".drawer-check");
      if (isMatch) {
        if (!checkmark) {
          checkmark = document.createElement("span");
          checkmark.className = "drawer-check";
          checkmark.style.color = "#18b968";
          checkmark.style.fontWeight = "bold";
          checkmark.textContent = "✓";
          item.appendChild(checkmark);
        }
      } else if (checkmark) {
        checkmark.remove();
      }
    });

    closeAllDropdowns();
  }

  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", toggleLangDropdown);

    langOptions.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        selectLanguage(opt.dataset.lang);
      });
    });
  }

  // Drawer Language Dropdown Expand / Collapse
  if (drawerLangTrigger && drawerLangMenu) {
    drawerLangTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded =
        drawerLangTrigger.getAttribute("aria-expanded") === "true";
      drawerLangTrigger.setAttribute("aria-expanded", !isExpanded);
      drawerLangMenu.hidden = isExpanded;
    });

    drawerLangItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        selectLanguage(item.dataset.lang);
      });
    });
  }

  // --- 4. Help Dropdown Handlers ---
  if (helpBtn && helpDropdown) {
    helpBtn.addEventListener("click", toggleHelpDropdown);
  }

  // Drawer Support & Assistance Dropdown Expand / Collapse
  if (drawerHelpTrigger && drawerHelpMenu) {
    drawerHelpTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded =
        drawerHelpTrigger.getAttribute("aria-expanded") === "true";
      drawerHelpTrigger.setAttribute("aria-expanded", !isExpanded);
      drawerHelpMenu.hidden = isExpanded;
    });
  }

  // --- 5. Mobile Accessibility Hamburger Drawer ---
  function toggleMobileDrawer() {
    const isOpen = mobileDrawerOverlay.classList.contains("is-open");
    if (isOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  }

  function openMobileDrawer() {
    if (mobileDrawerOverlay && hamburgerBtn) {
      mobileDrawerOverlay.classList.add("is-open");
      hamburgerBtn.classList.add("is-active");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawerOverlay && hamburgerBtn) {
      mobileDrawerOverlay.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleMobileDrawer);
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeMobileDrawer);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === mobileDrawerOverlay) {
        closeMobileDrawer();
      }
    });
  }

  // --- 6. Accessibility Preferences (Contrast & Font Size) ---
  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      const isHighContrast = document.body.classList.contains("high-contrast");
      toggleContrastBtn.textContent = isHighContrast ? "Enabled ✓" : "Default";
      toggleContrastBtn.classList.toggle("is-active", isHighContrast);
    });
  }

  if (toggleFontBtn) {
    toggleFontBtn.addEventListener("click", () => {
      document.body.classList.toggle("large-font");
      const isLarge = document.body.classList.contains("large-font");
      toggleFontBtn.textContent = isLarge ? "Large (+15%)" : "Standard";
      toggleFontBtn.classList.toggle("is-active", isLarge);
    });
  }

  // --- 7. Global Document Listeners (Click Outside & ESC Key) ---
  document.addEventListener("click", (e) => {
    if (
      langDropdown &&
      !langDropdown.hidden &&
      !langBtn.contains(e.target) &&
      !langDropdown.contains(e.target)
    ) {
      langDropdown.hidden = true;
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
    if (
      helpDropdown &&
      !helpDropdown.hidden &&
      !helpBtn.contains(e.target) &&
      !helpDropdown.contains(e.target)
    ) {
      helpDropdown.hidden = true;
      if (helpBtn) helpBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
      closeMobileDrawer();
    }
  });
})();
