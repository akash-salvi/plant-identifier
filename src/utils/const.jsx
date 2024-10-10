const PLANT_ANALYSIS_PROMPT = `Analyze this plant image and provide detailed information in the following format:

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

export { PLANT_ANALYSIS_PROMPT };
