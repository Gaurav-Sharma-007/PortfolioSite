/**
 * Portfolio Data
 * Easily editable details for the user's portfolio.
 */

export const portfolioData = {
  name: "Gaurav Sharma",
  title: "Data Science Engineer | Python | Azure | AI/ML",
  bio: "B.Tech in Data Science with hands-on experience in AI/ML, cloud (Azure AZ-900 certified), and enterprise app development. Proven track record in building scalable LLM-RAG systems, SharePoint solutions, and Power Platform apps that improve operational efficiency.",
  email: "myspacegaurav7@gmail.com",
  location: "Indore, MP, India",
  phone: "+91 7021316536",
  socials: {
    linkedin: "https://www.linkedin.com/in/gaurav-sharma-a67655200/",
    github: "https://github.com/Gaurav-Sharma-007",
    kaggle: "https://www.kaggle.com/gauravsharma007"
  },
  skills: [
    { category: "Languages and Frameworks", items: ["Python", "JavaScript", "Java", "HTML", "CSS", "TensorFlow", "Scikit-learn"] },
    { category: "Cloud & Tools", items: ["SharePoint", "Microsoft Azure", "Copilot Studio", "Power BI", "Power Automate", "Power Apps"] },
    { category: "Enterprise Tech", items: ["Dynamics 365", "SharePoint Online", "JSON Scripting", "ETL", "RAG", "Deep Learning"] }
  ],
  education: [
    {
      id: 1,
      degree: "B.Tech, Data Science",
      institution: "Manipal University Jaipur",
      period: "2020 – 2024",
      score: "CGPA: 8.5/10"
    }
  ],
  experience: [
    {
      id: 1,
      role: "Software Developer",
      company: "Gigatorb Software Pvt. Ltd.",
      period: "Apr 2025 – Present",
      description: "Building customizable SharePoint sites and end-to-end inventory management systems.",
      details: [
        "Built fully customizable SharePoint sites using native web-parts, JSON formatting, and Power Apps.",
        "Developed end-to-end inventory & field service management apps using Power BI + Power Automate.",
        "Built RAG systems with LangChain + vector DBs for document intelligence.",
        "Trained interns on SharePoint, Power Apps, and Power BI."
      ],
      stats: [
        { label: "Reporting Speed", value: 30, suffix: "%", prefix: "+" },
        { label: "Data Entry Reduced", value: 70, suffix: "%", prefix: "-" },
        { label: "Process Time Cut", value: 35, suffix: "%", prefix: "-" }
      ]
    },
    {
      id: 2,
      role: "Data Analytics Intern",
      company: "XXL Studioworks",
      period: "Jan – Jun 2024",
      description: "Applied analytics to boost branding engagement.",
      details: [
        "Applied analytics to boost branding engagement by 20%."
      ],
      stats: [
        { label: "Engagement", value: 20, suffix: "%", prefix: "+" }
      ]
    },
    {
      id: 3,
      role: "ML Intern",
      company: "Reliance Jio",
      period: "Jun – Aug 2023",
      description: "Forecasted customer churn using regression & ML models.",
      details: [
        "Forecasted customer churn with 85% accuracy using regression & ML models."
      ],
      stats: [
        { label: "Accuracy", value: 85, suffix: "%", prefix: "" }
      ]
    }
  ],
  projects: [
    {
      id: 1,
      title: "Alzheimer’s Classification Model",
      description: "Classified 6,400 MRI images into 4 groups with 98% accuracy using Deep Learning.",
      tech: ["Deep Learning", "Python", "Computer Vision"],
      videoUrl: "", 
      posterUrl: "https://via.placeholder.com/600x400/101010/ffffff?text=Alzheimer+Model",
      liveUrl: "#",
      repoUrl: "#",
      stats: [
        { label: "Accuracy", value: 98, suffix: "%" }
      ]
    },
    {
      id: 2,
      title: "Churn Prediction Model",
      description: "Achieved 87% accuracy in predicting customer churn.",
      tech: ["ML", "Python", "Scikit-learn"],
      videoUrl: "",
      posterUrl: "https://via.placeholder.com/600x400/202020/ffffff?text=Churn+Prediction",
      liveUrl: "#",
      repoUrl: "#",
      stats: [
        { label: "Accuracy", value: 87, suffix: "%" }
      ]
    },
    {
      id: 3,
      title: "Modular SharePoint Site",
      description: "Developed a fully customizable modular SharePoint site with native web-parts, custom list formatting, and Power Apps. Includes a custom Power BI dashboard for real-time data monitoring.",
      tech: ["SharePoint", "JSON", "Power Apps", "Power BI"],
      image: "https://via.placeholder.com/600x400?text=SharePoint+Dashboard",
      liveUrl: "#",
      repoUrl: "#",
      stats: [
        { label: "Real-time Data", value: 100, prefix: "", suffix: "%" },
        { label: "Customizability", value: 100, prefix: "", suffix: "%" }
      ]
    },
    {
      id: 4,
      title: "Titanic Survival Prediction",
      description: "Predicted survival of Titanic passengers using Logistic Regression based on socio-economic metrics.",
      tech: ["Logistic Regression", "Python", "Data Science"],
      image: "https://via.placeholder.com/600x400?text=Titanic+Survival",
      liveUrl: "#",
      repoUrl: "#",
      stats: [{ label: "Accuracy", value: 82, suffix: "%" }]
    },
    {
      id: 5,
      title: "Movie Ticket Price Prediction",
      description: "Predicted movie ticket prices using Linear Regression machine learning model.",
      tech: ["Linear Regression", "Data Science", "ML"],
      image: "https://via.placeholder.com/600x400?text=Movie+Price",
      liveUrl: "#",
      repoUrl: "#",
      stats: [{ label: "Error Rate", value: 15, suffix: "%", prefix: "-" }]
    },
    {
      id: 6,
      title: "Music Genre Classification",
      description: "Classified music tracks into respective genres using a Deep Learning model.",
      tech: ["Deep Learning", "Audio Processing", "Python"],
      image: "https://via.placeholder.com/600x400?text=Music+Genre",
      liveUrl: "#",
      repoUrl: "#",
      stats: [{ label: "Accuracy", value: 92, suffix: "%" }]
    },
    {
      id: 7,
      title: "Diabetes Predictor",
      description: "Implemented ML algorithms to produce precise predictions for early diabetes identification.",
      tech: ["Machine Learning", "Healthcare AI", "Python"],
      image: "https://via.placeholder.com/600x400?text=Diabetes+Prediction",
      liveUrl: "#",
      repoUrl: "#",
      stats: [{ label: "Precision", value: 89, suffix: "%" }]
    },
    {
      id: 9,
      title: "AI-Powered MCQ Generator",
      description: "Automated Flask web app using Gemini AI to generate structured MCQs from uploaded documents (PDF/DOCX).",
      tech: ["Generative AI", "Flask", "Python", "Gemini API"],
      image: "https://via.placeholder.com/600x400?text=MCQ+Generator",
      liveUrl: "#",
      repoUrl: "#",
      stats: [
        { label: "Options Gen.", value: 4, suffix: "", prefix: "" },
        { label: "Formats", value: 3, suffix: "", prefix: "" }
      ]
    },
    {
      id: 8,
      title: "YouTube Ad View Prediction",
      description: "Forecasted ad views for Internship Studio using regression analysis.",
      tech: ["Regression", "Analytics", "Python"],
      image: "https://via.placeholder.com/600x400?text=YouTube+Ads",
      liveUrl: "#",
      repoUrl: "#",
      stats: [{ label: "Forecast Accuracy", value: 85, suffix: "%" }]
    }
  ],
  certifications: [
    {
      name: "AZ-900: Microsoft Azure Fundamentals",
      url: "https://learn.microsoft.com/api/credentials/share/en-us/gauravsharma-6240/B4C10EA2E6A94567?sharingId=9D1DA20F4C7A9414"
    },
    {
      name: "MB-910: Microsoft Dynamics 365 Fundamentals – CRM",
      url: "https://learn.microsoft.com/en-us/users/gauravsharma-4727/credentials/e22629c1a3b25ef"
    }
  ],
  volunteering: [
    {
      id: 1,
      role: "Ninja (over 10 drives)",
      organization: "Robin Hood Army",
      period: "May 2023 – Present",
      description: "Successfully completed 10 drives with the organization in order to provide food and education to less fortunate children, who cannot afford them otherwise.",
      category: "Education & Social Service"
    }
  ]
};
