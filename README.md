# Chronometer (Sundial)

Turn your desktop background into a clock, like a sundial. Choose two colors and let Chronometer cycle between the color gradients throughout the day.

### Build

Chronometer uses ImageMagick to create gradient images so running the development build requires ImageMagick installed.

To run a test build of the electron app:
```
npm i
npm start
```

Create development macOS build:
```
npm run build
```

Build deployable macOS dmg:
```
npm run dist
```

![](./sundial_snap.png)
