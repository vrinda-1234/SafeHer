import { useEffect, useState } from "react";

export default function DestinationSearch({
  destination,
  setDestination,
  setSelectedDestination,
}) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (destination.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destination
          )}&limit=5`
        );

        const data = await res.json();

        setSuggestions(data);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [destination]);

  return (
    <div className="relative font-inter">
      <input
        value={destination}
        onChange={(e) => {
          setDestination(e.target.value);
          setSelectedDestination(null);
        }}
        placeholder="Search destination..."
        className="w-full border rounded-xl p-3"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-50 bg-white border rounded-xl mt-1 w-full shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <button
              key={place.place_id}
              type="button"
              className="block w-full text-left p-3 hover:bg-gray-100"
              onClick={() => {
                setDestination(place.display_name);

                setSelectedDestination({
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon),
                  name: place.display_name,
                });

                setSuggestions([]);
              }}
            >
              📍 {place.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}