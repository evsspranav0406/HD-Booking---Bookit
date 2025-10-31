import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { experiencesApi } from "../utils/api";
import type { Experience } from "../types";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [persons, setPersons] = useState(1);

  // Get available dates from slots
  const availableDates = experience ? experience.slots
    .filter(slot => slot.available)
    .map(slot => slot.date.split('T')[0]) // Get date part only
    .filter((date, index, arr) => arr.indexOf(date) === index) // Unique dates
    .sort() : [];

  // Get all slots for selected date (available and sold out)
  const allSlotsForDate = experience ? experience.slots
    .filter(slot => slot.date.split('T')[0] === selectedDate) : [];

  // Separate available and sold out slots
  const availableSlots = allSlotsForDate.filter(slot => slot.available);
  const soldOutSlots = allSlotsForDate.filter(slot => !slot.available);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await experiencesApi.getById(id!);
        setExperience(response.data);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  const handleProceed = () => {
    if (!experience) return;
    navigate("/checkout", {
      state: {
        experienceId: experience._id,
        experienceTitle: experience.title,
        price: experience.price,
        selectedDate,
        selectedTime: selectedSlot,
        participants: persons,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Experience not found.
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-cover" />
            <h1 className="text-lg font-bold text-gray-800">highway delite</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section — About Experience */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-sm">
              <img
                src={experience.images?.[0] || "https://via.placeholder.com/800x400"}
                alt={experience.title}
                className="w-full h-80 object-cover"
              />
            </Card>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{experience.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-yellow-500" />
                  <span>{experience.category}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">About Experience</h3>
              <p className="text-gray-600 leading-relaxed">{experience.description}</p>
            </div>
          </div>

          {/* Right Section — Booking Card */}
          <div>
            <Card className="p-6 sticky top-20 shadow-md bg-white">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Book Your Experience
              </h3>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="inline w-4 h-4 text-yellow-500 mr-1" />
                  Select Date
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => (
                    <Button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-3 rounded-md border text-sm text-center min-w-[120px] ${
                        selectedDate === date
                          ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Slot Selection */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 text-yellow-500 mr-1" />
                    Select Slot
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {/* Available slots */}
                    {availableSlots.map((slot) => {
                      const slotsLeft = slot.maxParticipants - slot.bookedCount;
                      return (
                        <div key={slot.time} className="flex flex-col items-center gap-1">
                          <Button
                            type="button"
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`px-4 py-2 rounded-md border text-sm ${
                              selectedSlot === slot.time
                                ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {slot.time}
                          </Button>
                          <span className="text-xs text-red-500 font-medium">
                            {slotsLeft} left
                          </span>
                        </div>
                      );
                    })}

                    {/* Sold out slots */}
                    {soldOutSlots.map((slot) => (
                      <div key={slot.time} className="flex flex-col items-center gap-1">
                        <Button
                          type="button"
                          disabled
                          className="px-4 py-2 rounded-md border text-sm bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        >
                          {slot.time}
                        </Button>
                        <span className="text-xs text-red-500 font-medium">
                          Sold Out
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of Persons */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 text-yellow-500 mr-1" />
                  Number of Persons
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-8 h-8 rounded-full border-gray-300"
                    onClick={() => setPersons((p) => Math.max(1, p - 1))}
                  >
                    –
                  </Button>
                  <span className="text-lg font-semibold">{persons}</span>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-8 h-8 rounded-full border-gray-300"
                    onClick={() => {
                      const selectedSlotData = availableSlots.find(slot => slot.time === selectedSlot);
                      if (selectedSlotData) {
                        const slotsLeft = selectedSlotData.maxParticipants - selectedSlotData.bookedCount;
                        setPersons((p) => Math.min(p + 1, slotsLeft));
                      } else {
                        setPersons((p) => p + 1);
                      }
                    }}
                    disabled={selectedSlot ? (() => {
                      const selectedSlotData = availableSlots.find(slot => slot.time === selectedSlot);
                      if (selectedSlotData) {
                        const slotsLeft = selectedSlotData.maxParticipants - selectedSlotData.bookedCount;
                        return persons >= slotsLeft;
                      }
                      return false;
                    })() : false}
                  >
                    +
                  </Button>
                </div>
                {selectedSlot && (() => {
                  const selectedSlotData = availableSlots.find(slot => slot.time === selectedSlot);
                  if (selectedSlotData) {
                    const slotsLeft = selectedSlotData.maxParticipants - selectedSlotData.bookedCount;
                    return (
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {slotsLeft} persons for selected slot
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4 mb-4">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{(experience.price * persons).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={handleProceed}
                disabled={!selectedDate || !selectedSlot}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
