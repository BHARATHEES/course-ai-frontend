const API_BASE = `${process.env.REACT_APP_API_URL}`;

const api = {
  analyzeCourse: async (courseName) => {
    try {
      // Change /analyze to /api/ai to match your backend
      const response = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: courseName }), // Use 'prompt' to match backend req.body
      });

      return await response.json();
    } catch (err) {
      console.error("API Error", err);
      return { error: "API request failed" };
    }
  },
};

export default api;