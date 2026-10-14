/**
 * Location and Reverse Geocoding Utility
 * Explicit user-consented location detection for identifying village / city.
 * Raw GPS coordinates are never stored. Only readable place names are extracted.
 */

export interface LocationDetectionResult {
  success: boolean;
  city?: string;
  state?: string;
  country?: string;
  formattedText?: string;
  errorMessage?: string;
  userDenied?: boolean;
}

export async function detectReadableLocation(): Promise<LocationDetectionResult> {
  if (!navigator.geolocation) {
    return {
      success: false,
      errorMessage: 'Geolocation is not supported by your browser.'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse-geocoding using OpenStreetMap Nominatim with proper User-Agent
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en,hi'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Geocoding server responded with ${response.status}`);
          }

          const data = await response.json();
          const addr = data.address || {};

          // Extract best readable location: village, town, city, district, subdistrict
          const place =
            addr.village ||
            addr.town ||
            addr.city ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            addr.city_district ||
            '';

          const state = addr.state || '';
          const readable = place ? (state ? `${place}, ${state}` : place) : (data.name || state || 'Local Area');

          resolve({
            success: true,
            city: readable,
            state: state,
            country: addr.country || 'India',
            formattedText: readable
          });
        } catch (error) {
          console.warn('Reverse geocoding fetch error, using fallback:', error);
          // Fallback to secondary reverse geocoding
          try {
            const fbResp = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (fbResp.ok) {
              const fbData = await fbResp.json();
              const place = fbData.locality || fbData.city || fbData.principalSubdivision || '';
              if (place) {
                return resolve({
                  success: true,
                  city: place,
                  state: fbData.principalSubdivision || '',
                  formattedText: place
                });
              }
            }
          } catch (e2) {
            // ignore
          }

          resolve({
            success: false,
            errorMessage: 'Could not resolve place name automatically. Please enter your village/city manually.'
          });
        }
      },
      (error) => {
        let errorMsg = 'Location access could not be retrieved.';
        const userDenied = error.code === error.PERMISSION_DENIED;

        if (userDenied) {
          errorMsg = 'Location permission was denied. You can simply type your village or city name below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable. Please type your city manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please enter your city manually.';
        }

        resolve({
          success: false,
          userDenied,
          errorMessage: errorMsg
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  });
}
