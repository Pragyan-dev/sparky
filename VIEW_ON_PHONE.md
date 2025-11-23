# 📱 How to View Sparky Shopper on Your Phone

## ✅ Your App is Running!

The Expo server is running at: **exp://192.168.1.18:8081**

You should see a **QR code** in your terminal right now.

---

## 🎯 Step-by-Step Guide

### For Android Phone:

1. **Install Expo Go** (if you haven't already)
   - Open Google Play Store
   - Search for "Expo Go"
   - Install the app
   - Link: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Open Expo Go app** on your phone

3. **Scan the QR code**
   - In Expo Go, tap "Scan QR code"
   - Point your camera at the QR code in your terminal
   - The app will load automatically!

### For iPhone:

1. **Install Expo Go** (if you haven't already)
   - Open App Store
   - Search for "Expo Go"
   - Install the app
   - Link: https://apps.apple.com/app/expo-go/id982107779

2. **Use your Camera app** (not Expo Go!)
   - Open the default Camera app
   - Point it at the QR code in your terminal
   - A notification will appear
   - Tap the notification to open in Expo Go

---

## 🔍 What You'll See

Once the app loads, you'll see:

1. **"🛒 Sparky Shopper"** title in purple
2. **"Allergen-Aware Shopping Assistant"** subtitle
3. **Three animated badges:**
   - ✅ Green "Safe" badge
   - 🟠 Amber "Caution" badge (pulsing)
   - ⛔ Red "Not Safe" badge (pulsing)
4. **Status checklist** showing completed features

This is the demo screen showing that the foundation is working!

---

## ⚠️ Troubleshooting

### "Can't scan the QR code"
- Make sure your phone and computer are on the **same WiFi network**
- The terminal shows: `exp://192.168.1.18:8081`
- Your phone needs to be able to reach this IP address

### "Connection failed"
1. Check if both devices are on the same network
2. Try pressing `r` in the terminal to reload
3. Or restart the server:
   - Press `Ctrl+C` to stop
   - Run `npm start` again

### "App loads but shows error"
- This is normal on first load while Metro bundles the JavaScript
- Wait a few seconds and it should load
- You'll see a progress bar in the terminal

---

## 🎨 Package Version Warnings

You might see warnings about package versions:
```
react-native-gesture-handler@2.29.1 - expected version: ~2.28.0
react-native-screens@4.18.0 - expected version: ~4.16.0
react-native-svg@15.15.0 - expected version: 15.12.1
```

**These are safe to ignore!** The app will work fine with the current versions. These are just recommendations from Expo.

---

## 🚀 Alternative: View on Web

If you want to see it in your browser instead:

1. In the terminal where Expo is running, press **`w`**
2. A browser window will open automatically
3. You'll see the same demo screen

---

## 📱 Next Steps After Viewing

Once you see the app running:

1. **Explore the code**: Check `App.tsx` to see how it's built
2. **Review the data**: Look at `data/products.json` to see the 65 products
3. **Test the modules**: The allergy engine and navigation are ready to use
4. **Build screens**: Start implementing the remaining UI screens

---

## 💡 Pro Tips

- **Live Reload**: Any changes you make to the code will automatically reload on your phone
- **Shake to Debug**: Shake your phone to open the developer menu
- **Console Logs**: Check the terminal to see console.log outputs

---

## 🆘 Still Having Issues?

Make sure:
- ✅ Terminal shows "Metro waiting on exp://..."
- ✅ You see the QR code in the terminal
- ✅ Your phone has Expo Go installed
- ✅ Both devices are on the same WiFi network
- ✅ No firewall is blocking port 8081

If you're still stuck, try:
```bash
# Stop the server (Ctrl+C)
# Then restart with tunnel mode (slower but works across networks)
npx expo start --tunnel
```

---

**Happy testing! 🎉**
