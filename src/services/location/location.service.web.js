// Web build only. The native app starts watching the user's position as soon
// as it opens. In a browser, and especially inside a portfolio page, asking for
// location before the visitor has done anything is the wrong moment, so the
// web build only asks when the visitor taps a location control on the map.
import { EventEmitter } from "fbemitter";

export const locationEventsEmitter = new EventEmitter();

export const startLocationTask = async () => {};
export const stopLocationTask = async () => {};

// Native reverse geocoding is not available in browsers; OpenStreetMap's
// Nominatim service fills the same role for the "Your Location" card.
const reverseGeocode = async (latitude, longitude) => {
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1" +
      `&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, { headers: { "Accept-Language": "da,en" } });
    const json = await response.json();
    const a = json.address || {};
    const street = [a.road, a.house_number].filter(Boolean).join(" ") || json.name || "";
    const place = [a.postcode, a.city || a.town || a.village || a.suburb].filter(Boolean).join(" ");
    const region = [a.state, a.country].filter(Boolean).join(", ");
    return [street, place, region].filter(Boolean).join("\n");
  } catch (e) {
    return null;
  }
};

export const requestLocationOnce = () =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not available in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationEventsEmitter.emit("location", position);
        reverseGeocode(position.coords.latitude, position.coords.longitude).then((address) => {
          if (address) locationEventsEmitter.emit("address", address);
        });
        resolve(position);
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
