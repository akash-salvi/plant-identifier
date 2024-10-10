import { GoogleGenerativeAI } from "@google/generative-ai";
import { Camera, FileImage } from "lucide-react";
import { useState } from "react";
import AlertEl from "../utils/alertEl";
import { PLANT_ANALYSIS_PROMPT } from "../utils/const";
import AppDetailsSection from "./appDetailsSection";
import BodyHeader from "./bodyHeader";
import Navbar from "./navbar";
import PlantDetails from "./plantDetails";

// Replace with your actual API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const PlantIdentifier = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("Image size must be less than 8 MB");
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

  const identifyPlant = async (imageFile) => {
    setLoading(true);
    setError(null);

    try {
      // Updated to use gemini-1.5-flash model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = PLANT_ANALYSIS_PROMPT;

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

  let plantDetailsEl = null;

  let uploadImgEl = (
    <div className="space-y-1 text-center">
      <div className="text-sm text-gray-600">
        <span className="relative cursor-pointer font-medium text-green-600 hover:text-green-500">
          Upload an Image
        </span>

        <input
          id="image-upload"
          name="image-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <FileImage className="mx-auto h-12 w-auto text-gray-400" />
      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
    </div>
  );

  let captureImgEl = (
    <div className="space-y-1 text-center">
      <div className="text-sm text-gray-600">
        <span className="relative cursor-pointer font-medium text-green-600 hover:text-green-500">
          Capture Image
        </span>
        <input
          id="camera-upload"
          name="camera-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>
      <Camera className="mx-auto h-12 w-12 text-gray-400" />
      <p className="text-xs text-gray-500">Use your device&apos;s camera</p>
    </div>
  );

  if (plantInfo || imagePreview) {
    plantDetailsEl = (
      <PlantDetails
        imagePreview={imagePreview}
        plantInfo={plantInfo}
        loading={loading}
        error={error}
      />
    );
  }

  if (loading) {
    uploadImgEl = (
      <div className="space-y-1 text-center flex space-x-4 items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        <span className="text-gray-500">Identifying plant...</span>
      </div>
    );
    captureImgEl = (
      <div className="space-y-1 text-center flex space-x-4 items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        <span className="text-gray-500">Identifying plant...</span>
      </div>
    );
  }

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:w-[920px]">
        <BodyHeader />

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center items-center">
          {/* Image Upload */}
          <label htmlFor="image-upload" className="block w-full md:w-1/2 cursor-pointer">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors duration-200">
              {uploadImgEl}
            </div>
          </label>

          {/* Capture from Camera */}
          <label htmlFor="camera-upload" className="block w-full md:w-1/2 cursor-pointer">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors duration-200">
              {captureImgEl}
            </div>
          </label>
        </div>

        <AlertEl>
          <p>{error}</p>
        </AlertEl>

        {plantDetailsEl}
      </div>

      <AppDetailsSection />

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
