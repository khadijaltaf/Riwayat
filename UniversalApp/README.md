# Riwayat — Heritage on a Plate 🍛

Welcome to **Riwayat**, a project born out of a love for authentic, home-cooked flavors. We believe that the best meals aren't found in restaurants, but in the kitchens of home chefs who cook with heart and tradition.

Riwayat is designed to be the bridge between these talented chefs and people who crave a real taste of home. This app is the "Partner" side of that bridge—giving chefs the tools they need to manage their kitchen, showcase their signature dishes, and connect with their community.

---

## ✨ What makes Riwayat special?

We didn't just build an app; we built an experience. We wanted something that felt premium, warm, and deeply rooted in culture.

### 🎨 A Rich, Premium Aesthetic
The app uses a curated palette we call **"Riwayat Red" (#600E10)** paired with clean whites. It’s a design that feels both traditional and modern.

### 🚀 A Dashboard for busy Chefs
*   **Kitchen Control:** A simple, beautiful toggle to go online or offline.
*   **Quick access:** A 2x3 grid that puts everything (Menu, Orders, Earnings) just one tap away.
*   **Real-time Updates:** A carousel to keep chefs in the loop with what's happening in the Riwayat community.

### 💬 Connecting through Conversation
Food is personal, so our chat system is too.
*   **WhatsApp-style ease:** Simple, real-time messaging.
*   **Voice and Vision:** Send voice notes to explain a recipe detail or a photo of a fresh dish ready for delivery.
*   **Direct Dial:** Sometimes a quick call is better. We’ve integrated one-tap calling for seamless coordination.

### 📝 Seamless Onboarding
Becoming a partner is a journey. Our 6-step registration flow guides chefs through setting up their profile, kitchen details, and their very first menu without feeling overwhelmed.

---

## 🛠️ The Tech Behind the Taste

We chose tools that let us build fast and stay flexible:

*   **Core:** React Native with Expo (SDK 54).
*   **Navigation:** Expo Router for that smooth, native feel.
*   **Design:** Custom styles with Poppins typography for that modern touch.
*   **Media:** Integrated audio and image handling for a rich chat experience.

---

## 🚀 Jump In

### Installation

1.  **Clone the spirit:**
    ```bash
    git clone https://github.com/yourusername/riwayat-app.git
    cd riwayat-app
    ```

2.  **Get the ingredients (dependencies):**
    ```bash
    npm install
    ```

3.  **Fire up the kitchen:**
    ```bash
    npx expo start
    ```

### Testing it out

We've built in some **Test Credentials** so you can see the app in action immediately:

| Role | Phone | PIN |
|:---|:---|:---|
| **Test Chef** | `03001122334` | `1234` |
| **Chef Ahmad** | `03330000000` | `1234` |

---

## 📦 Creating the APK

If you want to hold the app in your hands, you can generate a build:

1.  **Preparation:** `npx expo prebuild`
2.  **Standard Build:** Use `eas build -p android --profile preview` for a cloud-based APK.
3.  **Local Alternative:** Run `./gradlew assembleRelease` inside the `android` folder.

---

*Built with ❤️ and a lot of tea, for the love of food.*
