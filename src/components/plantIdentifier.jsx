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
const GEMINI_MODAL = import.meta.env.VITE_GEMINI_MODAL;
const genAI = new GoogleGenerativeAI(API_KEY);

const PlantIdentifier = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setImageError("Image size must be less than 8 MB");
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
    setImageError(null);
    // Clear previous info when a new image is uploaded
    setPlantInfo(null);

    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODAL,
        generationConfig: {
          response_mime_type: "application/json",
        },
      });

      const prompt = PLANT_ANALYSIS_PROMPT;
      const imagePart = await fileToGenerativePart(imageFile);

      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      const responseText = response.text();

      if (!responseText) {
        throw new Error("Received empty response from Gemini API");
      }

      // Directly parse the JSON string from the API
      const geminiJson = JSON.parse(responseText);

      // Map the response from Gemini to the structure your React component expects
      const formattedPlantInfo = {
        name: geminiJson.Name || "Unknown",
        scientificName: geminiJson["Scientific Name"] || "Not available",
        family: geminiJson.Family || "Not available",
        description: geminiJson.Description || "No description available",
        care: {
          light: geminiJson["Care Instructions"]?.Light || "Not specified",
          water: geminiJson["Care Instructions"]?.Water || "Not specified",
          humidity: geminiJson["Care Instructions"]?.Humidity || "Not specified",
        },
        additionalInfo: {
          growthRate: geminiJson["Additional Information"]?.["Growth Rate"] || "Not specified",
          maxHeight: geminiJson["Additional Information"]?.["Maximum Height"] || "Not specified",
          toxicity: geminiJson["Additional Information"]?.Toxicity || "Not specified",
          propagation: geminiJson["Additional Information"]?.Propagation || "Not specified",
          soilType: geminiJson["Additional Information"]?.["Soil Type"] || "Not specified",
          fertilization: geminiJson["Additional Information"]?.Fertilization || "Not specified",
        },
        commonIssues: geminiJson["Common Issues"] || ["No common issues specified"],
      };

      setPlantInfo(formattedPlantInfo);

    } catch (err) {
      console.error("Error identifying plant:", err);
      let errorMessage = "Failed to identify plant. Please try again.";

      if (err instanceof SyntaxError) {
        errorMessage = "Failed to read the data from the AI. The format might be incorrect.";
      } else if (err.message) {
        errorMessage = `An error occurred: ${err.message}`;
      }

      setImageError(errorMessage);
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
      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 8MB</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:w-[920px]">
        <BodyHeader />

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 justify-center items-center">
          {/* Image Upload */}
          <label
            htmlFor="image-upload"
            className="block w-full md:w-1/2 cursor-pointer"
          >
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors duration-200">
              {uploadImgEl}
            </div>
          </label>

          {/* Capture from Camera */}
          <label
            htmlFor="camera-upload"
            className="block w-full md:w-1/2 cursor-pointer"
          >
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors duration-200">
              {captureImgEl}
            </div>
          </label>
        </div>

        {imageError && (
          <AlertEl>
            <p>{imageError}</p>
          </AlertEl>
        )}

        {plantDetailsEl}
      </div>

      <AppDetailsSection />

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 PlantBuddy. Made with 🌱 for plant lovers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlantIdentifier;
