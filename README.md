# TouchFlow Visitor Registration

TouchFlow is a modern, responsive, touch-friendly visitor registration kiosk web application built with pure HTML, CSS, and JavaScript.

---

## 📁 Folder Structure

```text
xiphias/
│
├── index.html                  # Main application entry point & screens
├── README.md                   # Project documentation and run guide
│
└── assets/
    ├── css/
    │   └── style.css           # Global design system, utility classes & responsive styles
    │
    ├── js/
    │   └── main.js             # Client-side controller (navigation, OTP, camera, validation)
    │
    └── images/
        ├── favicon.svg         # Browser favicon icon
        ├── qr-code.svg         # Digital pass QR code asset
        ├── welcome-hero.png    # Welcome screen illustration asset
        │
        ├── icons/              # Benefit & feature badges
        │   ├── easy.png        # Easy check-in icon
        │   ├── fast.png        # Fast speed icon
        │   └── secure.png      # Security icon
        │
        └── image/              # Purpose card icons & profile assets
            ├── Delivery.png    # Delivery purpose icon
            ├── Interview.png   # Interview purpose icon
            ├── Meetings.png    # Meetings purpose icon
            ├── Other.png       # Other purpose icon
            ├── Services.png    # Services purpose icon
            ├── hero-img.png    # Hero artwork asset
            ├── xiphias.png     # Logo asset
            └── yathish.png     # Default visitor profile avatar
```

---

## 🚀 How to Run

Because the application includes **live webcam capture** (`navigator.mediaDevices.getUserMedia`), running it through a local HTTP server is recommended for camera permissions to function seamlessly.

### Option 1: VS Code Live Server (Recommended)

1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The app will automatically open in your default browser at `http://127.0.0.1:5500`.

### Option 2: Direct Browser Launch

- Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.
- _Note:_ Some browsers may restrict camera access when opened via the `file://` protocol. Use an HTTP server (Options 1–3) for full camera testing.

---

## 🛠️ Tech Stack & Key Features

- **Core**: Semantic HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Vanilla CSS with custom properties (CSS variables), Flexbox & CSS Grid
- **Webcam Integration**: Live video preview, blink/click capture via HTML5 `<video>` and `<canvas>`
- **Responsive Layout**: Optimized for desktop kiosk displays, tablets, and mobile devices
- **Multi-Step Flow**:
  1. **Welcome Screen**: Engaging entrance with quick benefits
  2. **Step 1 - Purpose**: Selection grid (Meetings, Interview, Delivery, Services, Other)
  3. **Step 2 - Verification**: Contact details, 4-digit OTP input, simulated verification
  4. **Step 3 - Live Photo**: Camera feed with oval positioning guide and retake option
  5. **Step 4 - Review**: Summary confirmation card carrying exact visitor data
  6. **Step 5 - Digital Pass**: Check-in confirmation with pass details and auto-reset countdown
