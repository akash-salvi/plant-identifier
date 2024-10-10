// PlantIdentifier.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Droplets,
  FileImage,
  Leaf,
  Sun,
  ThermometerSun,
  Menu,
  X,
  Upload,
  Search,
  Info,
} from "lucide-react";
import { useState } from "react";

// Simple Alert component
// eslint-disable-next-line react/prop-types
const Alert = ({ children }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    {children}
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="bg-green-600 text-white p-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <Leaf className="h-8 w-8" />
          <a href="#" className="text-2xl font-bold">
            PlantBuddy
          </a>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden mr-4">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Nav Links - Hidden on Mobile, Shown on Larger Screens */}
        <div className="space-x-6 hidden lg:block">
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Home
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            About
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Contact
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Other
          </a>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden">
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Home
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            About
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Contact
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Other
          </a>
        </div>
      )}
    </nav>
  );
};

const HowToUseSection = () => (
  <section className="py-8 pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Use the App</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 - Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload an Image</h3>
          <p className="text-gray-600">
            Take a clear photo of a plant and upload it. We support JPG, PNG, and GIF formats up to
            4MB.
          </p>
        </div>

        {/* Card 2 - Analyze */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Analyze the Plant</h3>
          <p className="text-gray-600">
            Once you upload an image, our AI will identify the plant and provide a detailed
            analysis.
          </p>
        </div>

        {/* Card 3 - Get Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Info className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Get Plant Information</h3>
          <p className="text-gray-600">
            Learn about the plant&apos;s name, family, care instructions, growth rate, toxicity, and
            more!
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Replace with your actual API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const PlantIdentifier = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Image size must be less than 4MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      identifyPlant(file);
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const identifyPlant = async (imageFile) => {
    setLoading(true);
    setError(null);

    try {
      // Updated to use gemini-1.5-flash model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this plant image and provide detailed information in the following format:

Name: [Common name of the plant]
Scientific Name: [Scientific name]
Family: [Plant family]

Care Instructions:
Light: [Light requirements]
Water: [Watering needs]
Humidity: [Humidity preferences]

Description: [Brief description of the plant]

Additional Information:
Growth Rate: [Slow/Medium/Fast]
Maximum Height: [Expected maximum height]
Toxicity: [Any toxicity concerns]
Propagation: [How to propagate]
Soil Type: [Preferred soil type]
Fertilization: [Fertilization requirements]

Common Issues:
- [List common problem 1]
- [List common problem 2]
- [List common problem 3]
- [List common problem 4]

Please be as accurate and detailed as possible, following the exact format above.`;

      const imagePart = await fileToGenerativePart(imageFile);

      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;

        if (response && response.text) {
          const parsedInfo = parseGeminiResponse(response);
          setPlantInfo(parsedInfo);
        } else {
          throw new Error("Received empty response from Gemini API");
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw new Error(`API Error: ${apiError.message || "Unknown error occurred"}`);
      }
    } catch (err) {
      console.error("Error identifying plant:", err);
      setError(
        `Failed to identify plant: ${err.message}. Please try again or contact support if the issue persists.`
      );
    } finally {
      setLoading(false);
    }
  };

  const parseGeminiResponse = (response) => {
    try {
      const text = response.text();

      let parsedInfo = {
        name: "Unknown",
        scientificName: "Not available",
        family: "Not available",
        care: {
          light: "Not specified",
          water: "Not specified",
          humidity: "Not specified",
        },
        description: "No description available",
        additionalInfo: {
          growthRate: "Not specified",
          maxHeight: "Not specified",
          toxicity: "Not specified",
          propagation: "Not specified",
          soilType: "Not specified",
          fertilization: "Not specified",
        },
        commonIssues: ["No common issues specified"],
      };

      // Simple key-value parsing
      const lines = text.split("\n");
      let currentSection = "";

      lines.forEach((line) => {
        if (line.includes(":")) {
          const [key, value] = line.split(":").map((part) => part.trim());

          switch (key.toLowerCase()) {
            case "name":
              parsedInfo.name = value;
              break;
            case "scientific name":
              parsedInfo.scientificName = value;
              break;
            case "family":
              parsedInfo.family = value;
              break;
            case "light":
              parsedInfo.care.light = value;
              break;
            case "water":
              parsedInfo.care.water = value;
              break;
            case "humidity":
              parsedInfo.care.humidity = value;
              break;
            case "description":
              currentSection = "description";
              parsedInfo.description = value;
              break;
            case "growth rate":
              parsedInfo.additionalInfo.growthRate = value;
              break;
            case "maximum height":
              parsedInfo.additionalInfo.maxHeight = value;
              break;
            case "toxicity":
              parsedInfo.additionalInfo.toxicity = value;
              break;
            case "propagation":
              parsedInfo.additionalInfo.propagation = value;
              break;
            case "soil type":
              parsedInfo.additionalInfo.soilType = value;
              break;
            case "fertilization":
              parsedInfo.additionalInfo.fertilization = value;
              break;
            case "common issues":
              currentSection = "commonIssues";
              parsedInfo.commonIssues = [];
              break;
          }
        } else if (line.trim().startsWith("-") && currentSection === "commonIssues") {
          parsedInfo.commonIssues.push(line.trim().substring(1).trim());
        } else if (line.trim() && currentSection === "description") {
          parsedInfo.description += " " + line.trim();
        }
      });

      return parsedInfo;
    } catch (err) {
      console.error("Error parsing Gemini response:", err);
      throw new Error("Failed to parse plant information");
    }
  };

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-500" />
            <h1 className="ml-3 text-4xl font-bold text-gray-900">PlantBuddy</h1>
          </div>
          <p className="text-xl text-gray-600">Discover and learn about plants instantly</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 lg:w-[920px]">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload Your Plant</h2>
              <p className="text-gray-600 mb-4">
                Take a photo of any plant and let our AI identify it for you!
              </p>

              <label htmlFor="image-upload" className="block">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {imagePreview && (
                <div className="mb-6">
                  <img
                    src={imagePreview}
                    alt="Selected plant"
                    className="w-full h-96 object-contain rounded-lg shadow-lg border bg-black"
                  />
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  <span className="text-gray-500">Identifying plant...</span>
                </div>
              )}

              {error && (
                <Alert>
                  <p>{error}</p>
                </Alert>
              )}

              {!loading && plantInfo && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{plantInfo.name}</h2>
                    <p className="text-sm text-gray-500 italic">{plantInfo.scientificName}</p>
                    <p className="text-sm text-gray-500 mt-1">Family: {plantInfo.family}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-600">{plantInfo.description}</p>
                  </div>
                </div>
              )}
            </div>

            {!loading && plantInfo && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <Sun className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm text-gray-600 text-center">
                      {plantInfo.care.light}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <Droplets className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600 text-center">
                      {plantInfo.care.water}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                    <ThermometerSun className="h-6 w-6 text-yellow-600 mb-2" />
                    <span className="text-sm text-gray-600 text-center">
                      {plantInfo.care.humidity}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Plant Details</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(plantInfo.additionalInfo).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Issues</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {plantInfo.commonIssues.lenght ? (
                      plantInfo.commonIssues.map((issue, index) => (
                        <li key={index} className="text-gray-600">
                          {issue}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">No common issues specified</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm"></div>
      </div>

      <HowToUseSection />

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">© 2024 PlantBuddy. Made with 🌱 for plant lovers.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlantIdentifier;
