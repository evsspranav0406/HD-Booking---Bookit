import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock } from "lucide-react";
import type { Experience } from "../types";
import { experiencesApi } from "../utils/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ExperienceCard = ({ experience }: { experience: Experience }) => (
  <Card className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white">
    <div className="relative">
      <img
        src={experience.images[0] || "https://via.placeholder.com/300x180?text=No+Image"}
        alt={experience.title}
        className="w-full h-44 object-cover rounded-t-lg"
      />
      <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-md text-gray-900">
        {experience.category}
      </span>
    </div>

    <div className="p-4 text-left">
      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
        {experience.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{experience.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{experience.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{experience.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-semibold">₹{experience.price.toLocaleString("en-IN")}</span>
        <Link to={`/details/${experience._id}`}>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-sm px-3 py-1 rounded-md">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  </Card>
);

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experiencesApi.getAll();
        setExperiences(response.data);
      } catch (err) {
        setError("Failed to load experiences");
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const categories = [...new Set(experiences.map((exp) => exp.category))];

  const filteredExperiences = experiences.filter((experience) => {
    const matchesSearch =
      experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-cover" />
            <h1 className="text-lg font-bold text-gray-800">highway delite</h1>
          </Link>
        </div>
      </header>

      {/* Search + Filters */}
      <section className="bg-white shadow-sm py-6 mb-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-md items-center relative">
            <Search className="absolute left-3 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus-visible:ring-yellow-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => setSelectedCategory("")}
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-4 py-1 text-sm ${
                !selectedCategory
                  ? "bg-yellow-400 text-black hover:bg-yellow-500"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedCategory === category
                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                    : "bg-white border text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Cards */}
      <main className="container mx-auto px-4 pb-16">
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p>No experiences found. Try adjusting filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-10">
        <div className="text-center text-sm text-gray-500">
          © 2025 Highway Delite. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
