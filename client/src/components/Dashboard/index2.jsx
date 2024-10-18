// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Cloud,
//   Leaf,
//   DollarSign,
//   Droplet,
//   Sun,
//   Wind,
//   Thermometer,
//   Calendar,
//   Plus,
//   ChevronDown,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { useLanguage } from "../../hooks/languageContext.jsx";
// import LanguageDropdown from "./Language";
// import Modal from "./Modal";
// import Loader from "./Loader";

// const Card = ({ children, className = "" }) => (
//   <motion.div
//     className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
//     whileHover={{ scale: 1.02 }}
//     transition={{ type: "spring", stiffness: 300 }}
//   >
//     {children}
//   </motion.div>
// );

// const CardHeader = ({ children, className = "" }) => (
//   <div className={`px-4 py-3 bg-gray-50 border-b border-gray-200 ${className}`}>
//     {children}
//   </div>
// );

// const CardTitle = ({ children, className = "" }) => (
//   <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
//     {children}
//   </h3>
// );

// const CardContent = ({ children, className = "" }) => (
//   <div className={`p-4 ${className}`}>{children}</div>
// );

// const CalendarContainer = ({ month, year, activeDays, onDayClick }) => {
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDay = new Date(year, month, 1).getDay();
//   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
//         <div
//           key={day}
//           className="text-center text-xs font-medium text-gray-500"
//         >
//           {day}
//         </div>
//       ))}
//       {Array(firstDay)
//         .fill(null)
//         .map((_, i) => (
//           <div key={`empty-${i}`} className="h-8"></div>
//         ))}
//       {days?.map((day) => (
//         <motion.div
//           key={day}
//           className={`h-8 flex items-center justify-center rounded-full text-sm cursor-pointer
//             ${
//               activeDays?.includes(day)
//                 ? "bg-green-500 text-white"
//                 : "text-gray-700"
//             }`}
//           onClick={() => onDayClick(day)}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           {day}
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// const ProgressBar = ({ value, max, className = "" }) => (
//   <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
//     <motion.div
//       className="bg-green-600 h-2.5 rounded-full"
//       initial={{ width: 0 }}
//       animate={{ width: `${(value / max) * 100}%` }}
//       transition={{ duration: 0.5 }}
//     ></motion.div>
//   </div>
// );

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const { language } = useLanguage();

//   const texts = {
//     en: {
//       greeting: "Hi, Farmer",
//       subtitle: "Let's check your farm's activity today",
//       searchPlaceholder: "Search for farm data",
//       weatherData: "Weather Data",
//       farmingDays: "Your Farming Days",
//       farmActivity: "Your Farm Activity for Today",
//       cropYield: "Crop Yield Progress",
//       sustainabilityScore: "Sustainability Score",
//       farmingHabits: "My Farming Habits",
//       addNew: "Add New",
//       sessionsCompleted: "Sessions completed:",
//       greatJob: "Great job! Your farm is on track for sustainability.",
//       aiSuggestions: "AI Suggestions",
//     },
//     hi: {
//       greeting: "नमस्ते, किसान",
//       subtitle: "आज अपने खेत की गतिविधियों का जायजा लेते हैं",
//       searchPlaceholder: "खेत डेटा खोजें",
//       weatherData: "मौसम डेटा",
//       farmingDays: "आपके खेती दिन",
//       farmActivity: "आज की आपकी खेती गतिविधियाँ",
//       cropYield: "फसल उत्पादन प्रगति",
//       sustainabilityScore: "स्थायित्व स्कोर",
//       farmingHabits: "मेरी खेती आदतें",
//       addNew: "नया जोड़ें",
//       sessionsCompleted: "सत्र पूर्ण हो गए:",
//       greatJob: "शाबाश! आपका खेत स्थायित्व के लिए सही रास्ते पर है।",
//       aiSuggestions: "AI सुझाव",
//     },
//     te: {
//       greeting: "హలో, రైతు",
//       subtitle: "మేము ఇప్పుడు మీ పొలం యొక్క కార్యకల్పతను తనిఖీ చేద్దాం",
//       searchPlaceholder: "పొలం డేటా కోసం వెతకండి",
//       weatherData: "వాతావరణం డేటా",
//       farmingDays: "మీ వ్యవసాయ దినాలు",
//       farmActivity: "ఇప్పుడు మీ వ్యవసాయ కార్యకల్పతలు",
//       cropYield: "పంట దిగుబడి పురోగతి",
//       sustainabilityScore: "స్థిరత్వ స్కోరు",
//       farmingHabits: "నా వ్యవసాయ అలవాట్లు",
//       addNew: "కొత్తది జోడించండి",
//       sessionsCompleted: "సెషన్లు పూర్తయ్యాయి:",
//       greatJob: "బాగుంది! మీ పొలం స్థిరత్వం కోసం సరైన దారిలో ఉంది.",
//       aiSuggestions: "AI సూచనలు",
//     },
//   };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const userId = localStorage.getItem("userId");
//         const position = await new Promise((resolve, reject) => {
//           navigator.geolocation.getCurrentPosition(resolve, reject);
//         });
//         const { latitude, longitude } = position.coords;
//         const response = await axios.get(
//           `http://localhost:5000/dashboard/${userId}`,
//           {
//             params: { latitude, longitude },
//           }
//         );
//         console.log(response.data)
//         setDashboardData(response.data);
//       } catch (err) {
//         setError("Failed to fetch dashboard data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleDayClick = (day) => {
//     // Get the current month and year from the displayed calendar
//     const month = new Date().getMonth(); // Month index (0 for Jan, 1 for Feb, etc.)
//     const year = new Date().getFullYear();
  
//     // Create a full date object from day, month, and year
//     const fullDate = new Date(year, month, day);
  
//     // Format the date as YYYY-MM-DD (or any format you prefer)
//     const formattedDate = fullDate.toISOString().split('T')[0]; 
  
//     console.log('Selected Date:', formattedDate);
  
//     // Save selected date in both state and localStorage
//     setSelectedDate(formattedDate);
//     localStorage.setItem('selectedDate', formattedDate);
  
//     setShowModal(true);
//   };
  

//   const handleModalClose = () => {
//     setShowModal(false);
//     setSelectedDate(null);
//   };
//   const handleActivitySubmit = async (activities) => {
//     try {
//       console.log('activity ')
//       const selectedDate = localStorage.getItem("selectedDate"); // Get the selected date from localStorage
//       if (!selectedDate || isNaN(new Date(selectedDate))) {
//         throw new Error('Invalid date');
//       }
  
//       await axios.post(`http://localhost:5000/dashboard/update-farming`, {
//         farmerId: localStorage.getItem("userId"),
//         date: selectedDate,  // Ensure the date is valid
//         activities,
//       });
  
//       // Refresh dashboard data
//       const response = await axios.get(`http://localhost:5000/dashboard/${localStorage.getItem("userId")}`);
//       setDashboardData(response.data);
//     } catch (err) {
//       console.error("Failed to update farming day:", err);
//     }
//     handleModalClose();
//   };
  

//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   const weatherData = [
//     {
//       name: "Current",
//       temperature: dashboardData?.weatherData?.current?.temp_c,
//       humidity: dashboardData?.weatherData?.current?.humidity,
//       precipitation: dashboardData?.weatherData?.current?.precip_mm,
//     },
//   ];

//   return (
//     <div className="flex h-full overflow-y-auto bg-gray-100 w-full">
//       <div className="flex-1 p-10 overflow-auto w-full">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               {texts[language].greeting} {dashboardData?.farmerName}!
//             </h1>
//             <p className="text-gray-600">{texts[language].subtitle}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder={texts[language].searchPlaceholder}
//                 className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <svg
//                 className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 01140z"
//                 ></path>
//               </svg>
//             </div>
//             <LanguageDropdown />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <Card className="col-span-1">
//             <CardHeader>
//               <CardTitle>{texts[language].weatherData}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={250}>
//                 <LineChart data={weatherData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
//                   <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
//                   <Line type="monotone" dataKey="precipitation" stroke="#ffc658" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{texts[language].farmingDays}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between items-center mb-4">
//                 <span className="font-semibold">
//                   {new Date().toLocaleString('default', { month: 'long' })}
//                 </span>
//                 <button className="text-gray-600 hover:text-gray-800">
//                   <ChevronDown size={20} />
//                 </button>
//               </div>
//               <CalendarContainer
//                 month={new Date().getMonth()}
//                 year={new Date().getFullYear()}
//                 activeDays={dashboardData?.farmingDays?.map((day) =>
//                   new Date(day.date).getDate()
//                 )}
//                 onDayClick={handleDayClick}
//               />
//             </CardContent>
//           </Card>

//           <Card className="col-span-1">
//             <CardHeader>
//               <CardTitle>{texts[language].farmActivity}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={dashboardData?.farmingDays[dashboardData?.farmingDays?.length - 1]?.activities || []}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="hours"
//                     >
//                       {dashboardData?.farmingDays[dashboardData?.farmingDays.length - 1]?.activities?.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="flex justify-around mt-4">
//                 {dashboardData?.farmingDays[dashboardData?.farmingDays?.length - 1]?.activities?.map((item, index) => (
//                   <div key={index} className="text-center">
//                     <div className="text-2xl font-bold" style={{ color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4] }}>{item.hours}h</div>
//                     <div className="text-gray-600">{item.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{texts[language].cropYield}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={dashboardData?.cropYieldData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="current"
//                     stackId="1"
//                     stroke="#8884d8"
//                     fill="#8884d8"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="target"
//                     stackId="1"
//                     stroke="#82ca9d"
//                     fill="#82ca9d"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>{texts[language].sustainabilityScore}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center">
//                 <div className="relative">
//                   <svg className="w-32 h-32">
//                     <circle
//                       className="text-gray-300"
//                       strokeWidth="10"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="56"
//                       cx="64"
//                       cy="64"
//                     />
//                     <motion.circle
//                       className="text-green-500"
//                       strokeWidth="10"
//                       strokeDasharray={2 * Math.PI * 56}
//                       strokeDashoffset={
//                         2 *
//                         Math.PI *
//                         56 *
//                         (1 - dashboardData?.sustainabilityScore / 100)
//                       }
//                       strokeLinecap="round"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="56"
//                       cx="64"
//                       cy="64"
//                       initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
//                       animate={{
//                         strokeDashoffset:
//                           2 *
//                           Math.PI *
//                           56 *
//                           (1 - dashboardData?.sustainabilityScore / 100),
//                       }}
//                       transition={{ duration: 1 }}
//                     />
//                   </svg>
//                   <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
//                     {dashboardData?.sustainabilityScore}%
//                   </span>
//                 </div>
//               </div>
//               <p className="text-center mt-4 text-gray-600">
//                 {texts[language].greatJob}
//               </p>
//             </CardContent>
//           </Card>

//           {/* <Card className="col-span-1">
//             <CardHeader className="flex justify-between items-center">
//               <CardTitle>{texts[language].farmingHabits}</CardTitle>
//               <button className="text-green-500 hover:text-green-600 flex items-center">
//                 <Plus size={20} className="mr-1" /> {texts[language].addNew}
//               </button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {dashboardData?.farmingHabits?.map((habit, index) => (
//                   <div key={index} className="flex items-center">
//                     <div className="bg-green-400 p-2 rounded-full mr-4">
//                       {habit.icon}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="font-medium">{habit.name}</span>
//                         <span className="text-sm text-gray-500">
//                           {texts[language].sessionsCompleted}{" "}
//                           {habit.completedSessions}/{habit.totalSessions}
//                         </span>
//                       </div>
//                       <ProgressBar
//                         value={habit.completedSessions}
//                         max={habit.totalSessions}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card> */}

//           <Card className="col-span-1">
//             <CardHeader>
//               <CardTitle>{texts[language].aiSuggestions}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc pl-5 space-y-2">
//                 {dashboardData?.aiSuggestions?.map((suggestion, index) => (
//                   <motion.li
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     {suggestion}
//                   </motion.li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       <AnimatePresence>
//         {showModal && (
//           <Modal
//             onClose={handleModalClose}
//             onSubmit={handleActivitySubmit}
//             selectedDate={selectedDate}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Dashboard;