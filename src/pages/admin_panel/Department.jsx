



// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//   });

//   // ✅ Get logged-in user data from localStorage
//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const companyId = loggedInUser?.cid; // This is the CID from login
  
//   // ✅ Get company name from multiple possible sources
//   const getCompanyName = () => {
//     const companyData = JSON.parse(localStorage.getItem("company"));
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const companyName = getCompanyName();

//   console.log("Logged in user:", loggedInUser);
//   console.log("Company ID:", companyId);
//   console.log("Company Name:", companyName);

//   // ✅ Global departments (cannot be deleted)
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", companyName: "Global", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", companyName: "Global", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", companyName: "Global", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", companyName: "Global", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", companyName: "Global", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", companyName: "Global", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", companyName: "Global", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch company-specific departments using CID
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (!companyId) {
//         console.error("No company ID found!");
//         return;
//       }

//       try {
//         const departmentsRef = collection(db, "departments");
//         // Query departments where CID matches the logged-in user's company ID
//         const q = query(departmentsRef, where("cid", "==", companyId));
//         const querySnapshot = await getDocs(q);
        
//         const deptList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         console.log("Fetched departments for company", companyId, ":", deptList);
//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
    
//     fetchDepartments();
//   }, [companyId]);

//   // ✅ Add new department with CID
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD fields!");
//       return;
//     }
//     if (!companyId) {
//       alert("Company ID missing! Please log in again.");
//       return;
//     }

//     try {
//       // Prepare department data with guaranteed values
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: companyName, // Use the function that always returns a string
//         cid: companyId, // Company ID
//         createdAt: serverTimestamp(),
//       };

//       console.log("Adding department with data:", departmentData);

//       const docRef = await addDoc(collection(db, "departments"), departmentData);

//       // Add to local state with the correct structure
//       const newDepartment = {
//         id: docRef.id,
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: companyName,
//         cid: companyId,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "" });
      
//       console.log("Department added successfully:", newDepartment);
//     } catch (error) {
//       console.error("Error adding department:", error);
//       alert("Error adding department: " + error.message);
//     }
//   };

//   // ✅ Delete department (skip global)
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       }
//     }
//   };

//   // ✅ Edit mode
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData(dept);
//   };

//   // ✅ Save updated data
//   const handleSave = async (id) => {
//     try {
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         ...editedData,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   // Combine global departments with company-specific departments
//   const allDepartments = [...globalDepartments, ...departments];

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//             <FaBuilding className="text-blue-500" />
//             Departments {companyName && `- ${companyName}`}
//           </h1>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 <th className="px-6 py-4">Company Name</th>
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     {companyName} {/* Show company name as read-only */}
//                   </td>
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({
//                           ...newDept,
//                           hod: e.target.value,
//                         })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>
//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700 cursor-pointer"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500 cursor-pointer"
//                         onClick={() => setAddingDept(false)}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {allDepartments.map((dept) => (
//                 <tr
//                   key={dept.id}
//                   className={`hover:bg-gray-700 transition ${dept.permanent ? "bg-gray-800" : ""}`}
//                 >
//                   <td className="px-6 py-3 font-medium">
//                     {editingId === dept.id ? (
//                       <input
//                         type="text"
//                         value={editedData.name || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             name: e.target.value,
//                           })
//                         }
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     ) : (
//                       <span>{dept.name}</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-3">
//                     <span className={!dept.companyName ? "text-gray-400 italic" : ""}>
//                       {dept.companyName || "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-3">
//                     {editingId === dept.id ? (
//                       <input
//                         type="text"
//                         value={editedData.hod || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             hod: e.target.value,
//                           })
//                         }
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaUserTie className="text-blue-400" size={14} />
//                         <span className={!dept.hod ? "text-gray-400 italic" : ""}>
//                           {dept.hod || "N/A"}
//                         </span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-3 text-gray-300">
//                     {formatDate(dept.createdAt)}
//                   </td>

//                   <td className="px-6 py-3">
//                     <div className="flex gap-2">
//                       {editingId === dept.id ? (
//                         <>
//                           <button
//                             className="text-green-500 hover:text-green-700"
//                             onClick={() => handleSave(dept.id)}
//                           >
//                             <FaCheck size={16} />
//                           </button>
//                           <button
//                             className="text-gray-400 hover:text-gray-600"
//                             onClick={handleCancel}
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           {!dept.permanent && (
//                             <button
//                               className="text-blue-500 hover:text-blue-700"
//                               onClick={() => handleEdit(dept)}
//                             >
//                               <FaEdit size={16} />
//                             </button>
//                           )}
//                           {!dept.permanent && (
//                             <button
//                               className="text-red-500 hover:text-red-700"
//                               onClick={() => handleDelete(dept.id, dept.permanent)}
//                             >
//                               <FaTrash size={16} />
//                             </button>
//                           )}
//                           {dept.permanent && (
//                             <span className="text-gray-400 italic text-xs">
//                               Global
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {allDepartments.length === 0 && !addingDept && (
//           <div className="text-center py-12 text-gray-300">
//             <h3 className="text-lg font-medium mb-2">No departments found</h3>
//             <p className="mb-4">Get started by adding your first department.</p>
//             <button
//               onClick={() => setAddingDept(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Add First Department
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Departments;
















// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Get logged-in user data from localStorage
//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const companyId = loggedInUser?.cid; // This is the CID from login
//   const userRole = loggedInUser?.role; // Get user role
  
//   // ✅ Check if user is site admin
//   const isSiteAdmin = userRole === "siteadmin";
//   const isCompanyAdmin = userRole === "admin";

//   console.log("Logged in user:", loggedInUser);
//   console.log("Company ID:", companyId);
//   console.log("User Role:", userRole);
//   console.log("Is Site Admin:", isSiteAdmin);
//   console.log("Is Company Admin:", isCompanyAdmin);

//   // ✅ Get current company name for company admins
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) {
//       return "Site Admin";
//     }
    
//     // For company admin, get their company name
//     const companyData = JSON.parse(localStorage.getItem("company"));
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments (cannot be deleted)
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", companyName: "Global", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", companyName: "Global", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", companyName: "Global", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", companyName: "Global", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", companyName: "Global", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", companyName: "Global", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", companyName: "Global", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch all companies for site admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const querySnapshot = await getDocs(companiesRef);
//           const companiesList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companiesList);
//           console.log("Fetched companies for site admin:", companiesList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };

//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments based on user role
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
      
//       try {
//         let deptList = [];
        
//         if (isSiteAdmin) {
//           // Site admin can see all departments from all companies
//           const departmentsRef = collection(db, "departments");
//           const querySnapshot = await getDocs(departmentsRef);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           console.log("Fetched all departments for site admin:", deptList);
//         } else if (currentCompanyId) {
//           // Company admin - fetch only their company departments
//           const departmentsRef = collection(db, "departments");
//           const q = query(departmentsRef, where("cid", "==", currentCompanyId));
//           const querySnapshot = await getDocs(q);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           console.log("Fetched departments for company", currentCompanyId, ":", deptList);
//         }
        
//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection change for site admin
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find(company => company.id === selectedCompanyId);
    
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name : ""
//     });
//   };

//   // ✅ Add new department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD fields!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;

//     if (isSiteAdmin) {
//       // For site admin - use selected company
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company for the department!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       // For company admin - use their company
//       if (!currentCompanyId) {
//         alert("Company ID missing! Please log in again.");
//         return;
//       }
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       // Prepare department data
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       console.log("Adding department with data:", departmentData);

//       const docRef = await addDoc(collection(db, "departments"), departmentData);

//       // Add to local state with the correct structure
//       const newDepartment = {
//         id: docRef.id,
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ 
//         name: "", 
//         hod: "", 
//         companyName: "", 
//         cid: "" 
//       });
      
//       console.log("Department added successfully:", newDepartment);
//     } catch (error) {
//       console.error("Error adding department:", error);
//       alert("Error adding department: " + error.message);
//     }
//   };

//   // ✅ Delete department (skip global)
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       }
//     }
//   };

//   // ✅ Edit mode - only allow editing name and HOD, not company name
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData({
//       name: dept.name,
//       hod: dept.hod
//       // Don't include companyName or cid in edited data
//     });
//   };

//   // ✅ Save updated data - only update name and HOD
//   const handleSave = async (id) => {
//     try {
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   // ✅ Reset new department form when canceling
//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ 
//       name: "", 
//       hod: "", 
//       companyName: "", 
//       cid: "" 
//     });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   // Combine global departments with company-specific departments
//   const allDepartments = [...globalDepartments, ...departments];

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//             <FaBuilding className="text-blue-500" />
//             Departments {currentCompanyName && !isSiteAdmin && `- ${currentCompanyName}`}
//             {isSiteAdmin && (
//               <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md">
//                 <FaCrown size={12} /> Site Admin
//               </span>
//             )}
//             {isCompanyAdmin && (
//               <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md">
//                 <FaUserTie size={12} /> Company Admin
//               </span>
//             )}
//           </h1>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 <th className="px-6 py-4">Company Name</th>
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     {isSiteAdmin ? (
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.map((company) => (
//                           <option key={company.id} value={company.id}>
//                             {company.name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex items-center gap-2 text-gray-300">
//                         <FaBuilding className="text-blue-400" />
//                         {currentCompanyName}
//                       </div>
//                     )}
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({
//                           ...newDept,
//                           hod: e.target.value,
//                         })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700 cursor-pointer"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500 cursor-pointer"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
//                     Loading departments...
//                   </td>
//                 </tr>
//               ) : (
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${dept.permanent ? "bg-gray-800" : ""}`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <span>{dept.name}</span>
//                       )}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-blue-400" size={14} />
//                         <span className={!dept.companyName ? "text-gray-400 italic" : ""}>
//                           {dept.companyName || "N/A"}
//                           {dept.permanent && " (Global)"}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span className={!dept.hod ? "text-gray-400 italic" : ""}>
//                             {dept.hod || "N/A"}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {!dept.permanent && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
//                             {!dept.permanent && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() => handleDelete(dept.id, dept.permanent)}
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
//                             {dept.permanent && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {!loading && allDepartments.length === 0 && !addingDept && (
//           <div className="text-center py-12 text-gray-300">
//             <h3 className="text-lg font-medium mb-2">No departments found</h3>
//             <p className="mb-4">Get started by adding your first department.</p>
//             <button
//               onClick={() => setAddingDept(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Add First Department
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Departments;










// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Get logged-in user data from localStorage
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid; // This is the CID from login
//   const userRole = loggedInUser?.role; // Get user role
  
//   // ✅ Check if user is site admin - FIXED THE ROLE CHECK
//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   console.log("Logged in user:", loggedInUser);
//   console.log("Company ID:", companyId);
//   console.log("User Role:", userRole);
//   console.log("Is Site Admin:", isSiteAdmin);
//   console.log("Is Company Admin:", isCompanyAdmin);

//   // ✅ Get current company name for company admins
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) {
//       return "Site Admin";
//     }
    
//     // For company admin, get their company name
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments (cannot be deleted)
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", companyName: "Global", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", companyName: "Global", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", companyName: "Global", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", companyName: "Global", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", companyName: "Global", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", companyName: "Global", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", companyName: "Global", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch all companies for site admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const querySnapshot = await getDocs(companiesRef);
//           const companiesList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companiesList);
//           console.log("Fetched companies for site admin:", companiesList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };

//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments based on user role - ENSURING SITE ADMIN SEES ALL DEPARTMENTS
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
      
//       try {
//         let deptList = [];
        
//         if (isSiteAdmin) {
//           // ✅ SITE ADMIN: Fetch ALL departments from all companies
//           console.log("Fetching ALL departments for Site Admin...");
//           const departmentsRef = collection(db, "departments");
//           const querySnapshot = await getDocs(departmentsRef);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           console.log("✅ Site Admin - All departments fetched:", deptList);
//         } else if (currentCompanyId) {
//           // ✅ COMPANY ADMIN: Fetch only their company departments
//           console.log(`Fetching departments for company: ${currentCompanyId}`);
//           const departmentsRef = collection(db, "departments");
//           const q = query(departmentsRef, where("cid", "==", currentCompanyId));
//           const querySnapshot = await getDocs(q);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           console.log(`✅ Company Admin - Departments fetched for company ${currentCompanyId}:`, deptList);
//         } else {
//           console.log("❌ No company ID found or user not properly logged in");
//         }
        
//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection change for site admin
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find(company => company.id === selectedCompanyId);
    
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name : ""
//     });
//   };

//   // ✅ Add new department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD fields!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;

//     if (isSiteAdmin) {
//       // For site admin - use selected company
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company for the department!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       // For company admin - use their company
//       if (!currentCompanyId) {
//         alert("Company ID missing! Please log in again.");
//         return;
//       }
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       // Prepare department data
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       console.log("Adding department with data:", departmentData);

//       const docRef = await addDoc(collection(db, "departments"), departmentData);

//       // Add to local state with the correct structure
//       const newDepartment = {
//         id: docRef.id,
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ 
//         name: "", 
//         hod: "", 
//         companyName: "", 
//         cid: "" 
//       });
      
//       console.log("✅ Department added successfully:", newDepartment);
//     } catch (error) {
//       console.error("Error adding department:", error);
//       alert("Error adding department: " + error.message);
//     }
//   };

//   // ✅ Delete department (skip global)
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       }
//     }
//   };

//   // ✅ Edit mode - only allow editing name and HOD, not company name
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData({
//       name: dept.name,
//       hod: dept.hod
//       // Don't include companyName or cid in edited data
//     });
//   };

//   // ✅ Save updated data - only update name and HOD
//   const handleSave = async (id) => {
//     try {
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   // ✅ Reset new department form when canceling
//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ 
//       name: "", 
//       hod: "", 
//       companyName: "", 
//       cid: "" 
//     });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   // ✅ Combine global departments with company-specific departments
//   const allDepartments = [...globalDepartments, ...departments];

//   // ✅ Get total count for display
//   const totalDepartments = allDepartments.length;
//   const userAddedDepartments = departments.length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments 
//               {currentCompanyName && !isSiteAdmin && `- ${currentCompanyName}`}
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin 
//                 ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
//                 : `Viewing company departments (${totalDepartments} total)`
//               }
//             </p>
//           </div>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 <th className="px-6 py-4">Company Name</th>
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     {isSiteAdmin ? (
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.map((company) => (
//                           <option key={company.id} value={company.id}>
//                             {company.name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex items-center gap-2 text-gray-300">
//                         <FaBuilding className="text-blue-400" />
//                         {currentCompanyName}
//                       </div>
//                     )}
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({
//                           ...newDept,
//                           hod: e.target.value,
//                         })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>
                  
//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700 cursor-pointer"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500 cursor-pointer"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
//                     Loading departments...
//                   </td>
//                 </tr>
//               ) : (
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${dept.permanent ? "bg-gray-800" : ""}`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <span>{dept.name}</span>
//                       )}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-blue-400" size={14} />
//                         <span className={!dept.companyName ? "text-gray-400 italic" : ""}>
//                           {dept.companyName || "N/A"}
//                           {dept.permanent && " (Global)"}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span className={!dept.hod ? "text-gray-400 italic" : ""}>
//                             {dept.hod || "N/A"}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {!dept.permanent && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
//                             {!dept.permanent && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() => handleDelete(dept.id, dept.permanent)}
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
//                             {dept.permanent && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {!loading && allDepartments.length === 0 && !addingDept && (
//           <div className="text-center py-12 text-gray-300">
//             <h3 className="text-lg font-medium mb-2">No departments found</h3>
//             <p className="mb-4">Get started by adding your first department.</p>
//             <button
//               onClick={() => setAddingDept(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Add First Department
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Departments;










// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ Current company
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) return "Site Admin";
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch companies (for site admin only)
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const querySnapshot = await getDocs(companiesRef);
//           const list = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(list);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         if (isSiteAdmin) {
//           const departmentsRef = collection(db, "departments");
//           const querySnapshot = await getDocs(departmentsRef);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         } else if (currentCompanyId) {
//           const departmentsRef = collection(db, "departments");
//           const q = query(departmentsRef, where("cid", "==", currentCompanyId));
//           const querySnapshot = await getDocs(q);
//           deptList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         }
//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection (site admin)
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name : "",
//     });
//   };

//   // ✅ Add department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;

//     if (isSiteAdmin) {
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     }
//   };

//   // ✅ Delete
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       }
//     }
//   };

//   // ✅ Edit / Save / Cancel
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const allDepartments = [...globalDepartments, ...departments];
//   const totalDepartments = allDepartments.length;
//   const userAddedDepartments = departments.length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
//                 : `Viewing company departments (${userAddedDepartments} total)`}
//             </p>
//           </div>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {isSiteAdmin && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   {isSiteAdmin && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, hod: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={isSiteAdmin ? 5 : 4}
//                     className="px-6 py-8 text-center text-gray-400"
//                   >
//                     Loading departments...
//                   </td>
//                 </tr>
//               ) : (
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${
//                       dept.permanent ? "bg-gray-800" : ""
//                     }`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         dept.name
//                       )}
//                     </td>

//                     {isSiteAdmin && (
//                       <td className="px-6 py-3">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" size={14} />
//                           <span>
//                             {dept.companyName || "N/A"}
//                             {dept.permanent && " (Global)"}
//                           </span>
//                         </div>
//                       </td>
//                     )}

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span>{dept.hod || "N/A"}</span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {!dept.permanent && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
//                             {!dept.permanent && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() =>
//                                   handleDelete(dept.id, dept.permanent)
//                                 }
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
//                             {dept.permanent && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;








// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ Current company name
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) return "Site Admin";
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch companies for Site Admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           const snapshot = await getDocs(deptRef);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         } else if (currentCompanyId) {
//           const q = query(deptRef, where("cid", "==", currentCompanyId));
//           const snapshot = await getDocs(q);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection (for Site Admin)
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany
//         ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company"
//         : "",
//     });
//   };

//   // ✅ Add new department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;

//     if (isSiteAdmin) {
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     }
//   };

//   // ✅ Delete department
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       }
//     }
//   };

//   // ✅ Edit department
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const allDepartments = [...globalDepartments, ...departments];
//   const totalDepartments = allDepartments.length;
//   const userAddedDepartments = departments.length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
//                 : `Viewing company departments (${userAddedDepartments} total)`}
//             </p>
//           </div>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {isSiteAdmin && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   {isSiteAdmin && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.length > 0 ? (
//                           companies.map((c) => (
//                             <option key={c.id} value={c.id}>
//                               {c.name || c.companyName || "Unnamed Company"}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No companies available</option>
//                         )}
//                       </select>
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, hod: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={isSiteAdmin ? 5 : 4}
//                     className="px-6 py-8 text-center text-gray-400"
//                   >
//                     Loading departments...
//                   </td>
//                 </tr>
//               ) : (
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${
//                       dept.permanent ? "bg-gray-800" : ""
//                     }`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         dept.name
//                       )}
//                     </td>

//                     {isSiteAdmin && (
//                       <td className="px-6 py-3">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" size={14} />
//                           <span>
//                             {dept.companyName || "N/A"}
//                             {dept.permanent && " (Global)"}
//                           </span>
//                         </div>
//                       </td>
//                     )}

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span>{dept.hod || "N/A"}</span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {!dept.permanent && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
//                             {!dept.permanent && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() =>
//                                   handleDelete(dept.id, dept.permanent)
//                                 }
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
//                             {dept.permanent && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;









// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ Current company name
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) return "Site Admin";
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch companies for Site Admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           const snapshot = await getDocs(deptRef);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         } else if (currentCompanyId) {
//           const q = query(deptRef, where("cid", "==", currentCompanyId));
//           const snapshot = await getDocs(q);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany
//         ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company"
//         : "",
//     });
//   };

//   // ✅ Add new department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;
//     if (isSiteAdmin) {
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       setSaving(true);
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Delete department
//   const handleDelete = async (id, permanent) => {
//     if (permanent) return alert("Global departments cannot be deleted.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         setSaving(true);
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Edit department
//   const handleEdit = (dept) => {
//     if (dept.permanent) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       setSaving(true);
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const allDepartments = [...globalDepartments, ...departments];
//   const totalDepartments = allDepartments.length;
//   const userAddedDepartments = departments.length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       {/* ✅ Loader Overlay */}
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">
//             {saving ? "Saving..." : "Loading..."}
//           </p>
//         </div>
//       )}

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
//                 : `Viewing company departments (${userAddedDepartments} total)`}
//             </p>
//           </div>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {isSiteAdmin && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   {isSiteAdmin && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.length > 0 ? (
//                           companies.map((c) => (
//                             <option key={c.id} value={c.id}>
//                               {c.name || c.companyName || "Unnamed Company"}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No companies available</option>
//                         )}
//                       </select>
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, hod: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {!loading &&
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${
//                       dept.permanent ? "bg-gray-800" : ""
//                     }`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         dept.name
//                       )}
//                     </td>

//                     {isSiteAdmin && (
//                       <td className="px-6 py-3">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" size={14} />
//                           <span>
//                             {dept.companyName || "N/A"}
//                             {dept.permanent && " (Global)"}
//                           </span>
//                         </div>
//                       </td>
//                     )}

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span>{dept.hod || "N/A"}</span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {!dept.permanent && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
//                             {!dept.permanent && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() =>
//                                   handleDelete(dept.id, dept.permanent)
//                                 }
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
//                             {dept.permanent && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;












// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ Current company name
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) return "Site Admin";
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     return companyData?.name || loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ✅ Global departments
//   const globalDepartments = [
//     { id: "global-1", name: "Human Resources", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-2", name: "Finance", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-3", name: "IT", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-4", name: "Marketing", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-5", name: "Sales", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-6", name: "Operations", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
//     { id: "global-7", name: "Administration", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
//   ];

//   // ✅ Fetch companies for Site Admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ✅ Fetch departments - UPDATED
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           // Site Admin ke liye sab departments (global + all companies)
//           const snapshot = await getDocs(deptRef);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         } else if (currentCompanyId) {
//           // Company Admin ke liye sirf apni company ke departments
//           const q = query(deptRef, where("cid", "==", currentCompanyId));
//           const snapshot = await getDocs(q);
//           deptList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ✅ Handle company selection
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany
//         ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company"
//         : "",
//     });
//   };

//   // ✅ Add new department
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName;
//     if (isSiteAdmin) {
//       if (!newDept.cid || !newDept.companyName) {
//         alert("Please select a company!");
//         return;
//       }
//       finalCompanyId = newDept.cid;
//       finalCompanyName = newDept.companyName;
//     } else {
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//     }

//     try {
//       setSaving(true);
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments([...departments, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Delete department - UPDATED
//   const handleDelete = async (id, permanent) => {
//     // Site Admin ke liye sab departments deletable hain
//     if (!isSiteAdmin && permanent) {
//       return alert("Global departments cannot be deleted.");
//     }
    
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         setSaving(true);
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments(departments.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Edit department - UPDATED
//   const handleEdit = (dept) => {
//     // Site Admin ke liye sab departments editable hain
//     if (isSiteAdmin || !dept.permanent) {
//       setEditingId(dept.id);
//       setEditedData({ name: dept.name, hod: dept.hod });
//     }
//   };

//   const handleSave = async (id) => {
//     try {
//       setSaving(true);
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments(
//         departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
//       );
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error updating department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "" });
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   // ✅ All departments array - UPDATED
//   const allDepartments = isSiteAdmin 
//     ? [...globalDepartments, ...departments]  // Site Admin: global + all
//     : departments;  // Company Admin: sirf apne departments

//   const totalDepartments = allDepartments.length;
//   const userAddedDepartments = departments.length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       {/* ✅ Loader Overlay */}
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">
//             {saving ? "Saving..." : "Loading..."}
//           </p>
//         </div>
//       )}

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
//                 : `Viewing company departments (${departments.length} total)`}
//             </p>
//           </div>
//           <button
//             onClick={() => setAddingDept(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//           >
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {isSiteAdmin && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={newDept.name}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, name: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   {isSiteAdmin && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       <select
//                         value={newDept.cid}
//                         onChange={handleCompanyChange}
//                         className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                         required
//                       >
//                         <option value="">Select Company</option>
//                         {companies.length > 0 ? (
//                           companies.map((c) => (
//                             <option key={c.id} value={c.id}>
//                               {c.name || c.companyName || "Unnamed Company"}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No companies available</option>
//                         )}
//                       </select>
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Head of Department"
//                       value={newDept.hod}
//                       onChange={(e) =>
//                         setNewDept({ ...newDept, hod: e.target.value })
//                       }
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">
//                     Auto-generated
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-500 hover:text-green-700"
//                         onClick={handleAddDept}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-400 hover:text-gray-500"
//                         onClick={handleCancelAdd}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows - UPDATED */}
//               {!loading &&
//                 allDepartments.map((dept) => (
//                   <tr
//                     key={dept.id}
//                     className={`hover:bg-gray-700 transition ${
//                       dept.permanent ? "bg-gray-800" : ""
//                     }`}
//                   >
//                     <td className="px-6 py-3 font-medium">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         dept.name
//                       )}
//                     </td>

//                     {isSiteAdmin && (
//                       <td className="px-6 py-3">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" size={14} />
//                           <span>
//                             {dept.companyName || "N/A"}
//                             {dept.permanent && " (Global)"}
//                           </span>
//                         </div>
//                       </td>
//                     )}

//                     <td className="px-6 py-3">
//                       {editingId === dept.id ? (
//                         <input
//                           type="text"
//                           value={editedData.hod || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               hod: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
//                         />
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <FaUserTie className="text-blue-400" size={14} />
//                           <span>{dept.hod || "N/A"}</span>
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-300">
//                       {formatDate(dept.createdAt)}
//                     </td>

//                     <td className="px-6 py-3">
//                       <div className="flex gap-2">
//                         {editingId === dept.id ? (
//                           <>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               onClick={() => handleSave(dept.id)}
//                             >
//                               <FaCheck size={16} />
//                             </button>
//                             <button
//                               className="text-gray-400 hover:text-gray-600"
//                               onClick={handleCancel}
//                             >
//                               <FaTimes size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {/* Site Admin ke liye sab editable, Company Admin ke liye sirf non-permanent */}
//                             {(isSiteAdmin || !dept.permanent) && (
//                               <button
//                                 className="text-blue-500 hover:text-blue-700"
//                                 onClick={() => handleEdit(dept)}
//                               >
//                                 <FaEdit size={16} />
//                               </button>
//                             )}
                            
//                             {/* Site Admin ke liye sab deletable, Company Admin ke liye sirf non-permanent */}
//                             {(isSiteAdmin || !dept.permanent) && (
//                               <button
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={() => handleDelete(dept.id, dept.permanent)}
//                               >
//                                 <FaTrash size={16} />
//                               </button>
//                             )}
                            
//                             {dept.permanent && !isSiteAdmin && (
//                               <span className="text-gray-400 italic text-xs">
//                                 Global
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;









// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
//   FaGlobe,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//     permanent: false,
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ FIXED: Better company name detection
//   const getCurrentCompanyName = () => {
//     if (isSiteAdmin) return "Site Admin";
    
//     // Pehle user object mein check karein
//     if (loggedInUser?.companyName) {
//       return loggedInUser.companyName;
//     }
    
//     // Phir localStorage se company data check karein
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     if (companyData?.name) {
//       return companyData.name;
//     }
    
//     // Last option
//     return loggedInUser?.companyName || "My Company";
//   };

//   const currentCompanyName = getCurrentCompanyName();
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ---------------------
//   // Fetch companies for Site Admin
//   // ---------------------
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ---------------------
//   // Fetch departments 
//   // - SiteAdmin: gets ONLY permanent departments (global)
//   // - CompanyAdmin / normal: gets company departments (cid == currentCompanyId) AND permanent:true departments
//   // ---------------------
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           // ✅ Site admin: ONLY permanent/global departments
//           const qGlobal = query(deptRef, where("permanent", "==", true));
//           const snapGlobal = await getDocs(qGlobal);
//           deptList = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));
//         } else if (currentCompanyId) {
//           // company admin or normal user: need two queries (company-specific + permanent/global)
//           const qCompany = query(deptRef, where("cid", "==", currentCompanyId));
//           const qGlobal = query(deptRef, where("permanent", "==", true));

//           const [snapCompany, snapGlobal] = await Promise.all([
//             getDocs(qCompany),
//             getDocs(qGlobal),
//           ]);

//           const companyDepts = snapCompany.docs.map((d) => ({ id: d.id, ...d.data() }));
//           const globalDepts = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));

//           // merge but avoid duplicates
//           const map = new Map();
//           [...globalDepts, ...companyDepts].forEach((d) => map.set(d.id, d));
//           deptList = Array.from(map.values());
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ---------------------
//   // Handle company selection for Site Admin when adding
//   // ---------------------
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company" : "",
//     });
//   };

//   // ---------------------
//   // Add new department - Auto-set company name for Company Admin
//   // ---------------------
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName, finalPermanent;

//     if (isSiteAdmin) {
//       finalPermanent = !!newDept.permanent;
//       if (finalPermanent) {
//         finalCompanyId = null; // global
//         finalCompanyName = "Global";
//       } else {
//         if (!newDept.cid || !newDept.companyName) {
//           alert("Please select a company (or mark as Global)!");
//           return;
//         }
//         finalCompanyId = newDept.cid;
//         finalCompanyName = newDept.companyName;
//       }
//     } else {
//       // ✅ Company Admin: Automatically set their company info (NON-EDITABLE)
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//       finalPermanent = false;
//     }

//     try {
//       setSaving(true);
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         permanent: finalPermanent || false,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments((prev) => [...prev, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------------------
//   // Delete department
//   // - Allow deleting permanent only for SiteAdmin
//   // ---------------------
//   const handleDelete = async (id, permanent) => {
//     if (permanent && !isSiteAdmin) return alert("Global departments cannot be deleted by company admins.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         setSaving(true);
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments((prev) => prev.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ---------------------
//   // Edit department
//   // - If dept.permanent and user is NOT site admin -> prevent editing
//   // - SiteAdmin can edit permanent departments
//   // ---------------------
//   const handleEdit = (dept) => {
//     if (dept.permanent && !isSiteAdmin) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       setSaving(true);
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...editedData } : d)));
//       setEditingId(null);
//       setEditedData({});
//     } catch (error) {
//       console.error("Error updating department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//   };

//   // ✅ Set company name automatically when adding starts (for Company Admin)
//   useEffect(() => {
//     if (addingDept && !isSiteAdmin) {
//       setNewDept(prev => ({
//         ...prev,
//         companyName: currentCompanyName,
//         cid: currentCompanyId
//       }));
//     }
//   }, [addingDept, isSiteAdmin, currentCompanyName, currentCompanyId]);

//   // ✅ NEW: Debug function to check company data
//   useEffect(() => {
//     console.log("Current User:", loggedInUser);
//     console.log("Current Company Name:", currentCompanyName);
//     console.log("Current Company ID:", currentCompanyId);
//     console.log("Is Company Admin:", isCompanyAdmin);
//   }, [currentCompanyName]);

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const totalDepartments = departments.length;
//   const userAddedDepartments = departments.filter((d) => !d.permanent).length;
//   const globalDepartmentsCount = departments.filter((d) => d.permanent).length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       {/* Loader Overlay */}
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">{saving ? "Saving..." : "Loading..."}</p>
//         </div>
//       )}

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing GLOBAL departments only (${globalDepartmentsCount} total)`
//                 : `Viewing departments (${userAddedDepartments} company + ${globalDepartmentsCount} global)`}
//             </p>
//             {/* ✅ Debug info - temporary */}
//             {!isSiteAdmin && (
//               <p className="text-gray-400 text-xs mt-1">
//                 Company: {currentCompanyName} (ID: {currentCompanyId})
//               </p>
//             )}
//           </div>
//           <button onClick={() => setAddingDept(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {/* ✅ Company Admin ke liye bhi Company Name column show karein */}
//                 {(isSiteAdmin || isCompanyAdmin) && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Department Name" 
//                       value={newDept.name} 
//                       onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   {/* ✅ Company Name column - Auto-filled for Company Admin */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       {isSiteAdmin ? (
//                         <div className="flex gap-2">
//                           <select 
//                             value={newDept.cid} 
//                             onChange={handleCompanyChange} 
//                             className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                             required
//                           >
//                             <option value="">Select Company</option>
//                             {companies.length > 0 ? (
//                               companies.map((c) => (
//                                 <option key={c.id} value={c.id}>{c.name || c.companyName || "Unnamed Company"}</option>
//                               ))
//                             ) : (
//                               <option disabled>No companies available</option>
//                             )}
//                           </select>
//                           <label className="flex items-center gap-2 text-sm">
//                             <input 
//                               type="checkbox" 
//                               checked={newDept.permanent} 
//                               onChange={(e) => setNewDept({ ...newDept, permanent: e.target.checked })} 
//                             />
//                             <span>Mark as Global</span>
//                           </label>
//                         </div>
//                       ) : (
//                         // ✅ Company Admin: Auto-filled, non-editable company name
//                         <div className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-300 cursor-not-allowed">
//                           {currentCompanyName}
//                         </div>
//                       )}
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Head of Department" 
//                       value={newDept.hod} 
//                       onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">Auto-generated</td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button className="text-green-500 hover:text-green-700" onClick={handleAddDept}>
//                         <FaCheck size={18} />
//                       </button>
//                       <button className="text-gray-400 hover:text-gray-500" onClick={handleCancelAdd}>
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {!loading && departments.map((dept) => (
//                 <tr key={dept.id} className={`hover:bg-gray-700 transition ${dept.permanent ? "bg-gray-800" : ""}`}>
//                   <td className="px-6 py-3 font-medium">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.name || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         {dept.permanent && <FaGlobe className="text-green-400" size={14} />}
//                         <span>{dept.name}</span>
//                         {dept.permanent && <span className="text-xs px-2 py-1 bg-gray-600 rounded text-green-400">Global</span>}
//                       </div>
//                     )}
//                   </td>

//                   {/* ✅ Company Name column */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-blue-400" size={14} />
//                         <span>
//                           {dept.permanent 
//                             ? "Global Department" 
//                             : dept.companyName || "N/A"
//                           }
//                         </span>
//                       </div>
//                     </td>
//                   )}

//                   <td className="px-6 py-3">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.hod || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, hod: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaUserTie className="text-blue-400" size={14} />
//                         <span>{dept.hod || "N/A"}</span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-3 text-gray-300">{formatDate(dept.createdAt)}</td>

//                   <td className="px-6 py-3">
//                     <div className="flex gap-2">
//                       {editingId === dept.id ? (
//                         <>
//                           <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(dept.id)}>
//                             <FaCheck size={16} />
//                           </button>
//                           <button className="text-gray-400 hover:text-gray-600" onClick={handleCancel}>
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           {/* Edit button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-blue-500 hover:text-blue-700"}`} 
//                               onClick={() => handleEdit(dept)}
//                             >
//                               <FaEdit size={16} />
//                             </button>
//                           )}

//                           {/* Delete button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`} 
//                               onClick={() => handleDelete(dept.id, dept.permanent)}
//                             >
//                               <FaTrash size={16} />
//                             </button>
//                           )}

//                           {dept.permanent && !isSiteAdmin && (
//                             <span className="text-gray-400 italic text-xs">Read Only</span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;









// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
//   FaGlobe,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//     permanent: false,
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [actualCompanyName, setActualCompanyName] = useState("");

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ NEW: Firestore se directly company name fetch karein
//   useEffect(() => {
//     const fetchCompanyName = async () => {
//       if (isSiteAdmin || !companyId) return;
      
//       try {
//         console.log("Fetching company data for ID:", companyId);
//         const companyDoc = await getDoc(doc(db, "companies", companyId));
        
//         if (companyDoc.exists()) {
//           const companyData = companyDoc.data();
//           console.log("Company data from Firestore:", companyData);
          
//           // Different possible field names check karein
//           const companyName = 
//             companyData.name || 
//             companyData.companyName || 
//             companyData.businessName || 
//             companyData.title ||
//             "Our Company";
            
//           setActualCompanyName(companyName);
//           console.log("Final company name:", companyName);
//         } else {
//           console.log("Company document not found for ID:", companyId);
//           // Fallback methods
//           const fallbackName = getFallbackCompanyName();
//           setActualCompanyName(fallbackName);
//         }
//       } catch (error) {
//         console.error("Error fetching company:", error);
//         const fallbackName = getFallbackCompanyName();
//         setActualCompanyName(fallbackName);
//       }
//     };

//     fetchCompanyName();
//   }, [companyId, isSiteAdmin]);

//   // ✅ Fallback company name function
//   const getFallbackCompanyName = () => {
//     // User object check
//     if (loggedInUser?.companyName && loggedInUser.companyName !== "My Company") {
//       return loggedInUser.companyName;
//     }
    
//     // LocalStorage company data check
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     if (companyData?.name && companyData.name !== "My Company") {
//       return companyData.name;
//     }
//     if (companyData?.companyName && companyData.companyName !== "My Company") {
//       return companyData.companyName;
//     }
    
//     // Email se derive karein
//     if (loggedInUser?.email) {
//       const domain = loggedInUser.email.split('@')[1];
//       const companyFromEmail = domain.split('.')[0];
//       return companyFromEmail.charAt(0).toUpperCase() + companyFromEmail.slice(1) + " Company";
//     }
    
//     return "Our Company";
//   };

//   const currentCompanyName = isSiteAdmin ? "Site Admin" : actualCompanyName;
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ---------------------
//   // Fetch companies for Site Admin
//   // ---------------------
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ---------------------
//   // Fetch departments 
//   // ---------------------
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           const qGlobal = query(deptRef, where("permanent", "==", true));
//           const snapGlobal = await getDocs(qGlobal);
//           deptList = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));
//         } else if (currentCompanyId) {
//           const qCompany = query(deptRef, where("cid", "==", currentCompanyId));
//           const qGlobal = query(deptRef, where("permanent", "==", true));

//           const [snapCompany, snapGlobal] = await Promise.all([
//             getDocs(qCompany),
//             getDocs(qGlobal),
//           ]);

//           const companyDepts = snapCompany.docs.map((d) => ({ id: d.id, ...d.data() }));
//           const globalDepts = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));

//           const map = new Map();
//           [...globalDepts, ...companyDepts].forEach((d) => map.set(d.id, d));
//           deptList = Array.from(map.values());
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ---------------------
//   // Handle company selection for Site Admin when adding
//   // ---------------------
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company" : "",
//     });
//   };

//   // ---------------------
//   // Add new department - Auto-set company name for Company Admin
//   // ---------------------
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName, finalPermanent;

//     if (isSiteAdmin) {
//       finalPermanent = !!newDept.permanent;
//       if (finalPermanent) {
//         finalCompanyId = null;
//         finalCompanyName = "Global";
//       } else {
//         if (!newDept.cid || !newDept.companyName) {
//           alert("Please select a company (or mark as Global)!");
//           return;
//         }
//         finalCompanyId = newDept.cid;
//         finalCompanyName = newDept.companyName;
//       }
//     } else {
//       // ✅ Company Admin: Actual company name use karein
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//       finalPermanent = false;
      
//       console.log("Adding department with company:", {
//         companyId: finalCompanyId,
//         companyName: finalCompanyName
//       });
//     }

//     try {
//       setSaving(true);
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         permanent: finalPermanent || false,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments((prev) => [...prev, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------------------
//   // Delete department
//   // ---------------------
//   const handleDelete = async (id, permanent) => {
//     if (permanent && !isSiteAdmin) return alert("Global departments cannot be deleted by company admins.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         setSaving(true);
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments((prev) => prev.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ---------------------
//   // Edit department
//   // ---------------------
//   const handleEdit = (dept) => {
//     if (dept.permanent && !isSiteAdmin) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       setSaving(true);
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...editedData } : d)));
//       setEditingId(null);
//       setEditedData({});
//     } catch (error) {
//       console.error("Error updating department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//   };

//   // ✅ Set company name automatically when adding starts (for Company Admin)
//   useEffect(() => {
//     if (addingDept && !isSiteAdmin) {
//       setNewDept(prev => ({
//         ...prev,
//         companyName: currentCompanyName,
//         cid: currentCompanyId
//       }));
//     }
//   }, [addingDept, isSiteAdmin, currentCompanyName, currentCompanyId]);

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const totalDepartments = departments.length;
//   const userAddedDepartments = departments.filter((d) => !d.permanent).length;
//   const globalDepartmentsCount = departments.filter((d) => d.permanent).length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       {/* Loader Overlay */}
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">{saving ? "Saving..." : "Loading..."}</p>
//         </div>
//       )}

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing GLOBAL departments only (${globalDepartmentsCount} total)`
//                 : `Viewing departments (${userAddedDepartments} company + ${globalDepartmentsCount} global)`}
//             </p>
//             {/* ✅ Company info display */}
//             {!isSiteAdmin && (
//               <p className="text-gray-400 text-xs mt-1">
//                 Company: <strong className="text-white">{currentCompanyName}</strong> (ID: {currentCompanyId})
//               </p>
//             )}
//           </div>
//           <button onClick={() => setAddingDept(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {(isSiteAdmin || isCompanyAdmin) && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Department Name" 
//                       value={newDept.name} 
//                       onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   {/* ✅ Company Name column */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       {isSiteAdmin ? (
//                         <div className="flex gap-2">
//                           <select 
//                             value={newDept.cid} 
//                             onChange={handleCompanyChange} 
//                             className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                             required
//                           >
//                             <option value="">Select Company</option>
//                             {companies.length > 0 ? (
//                               companies.map((c) => (
//                                 <option key={c.id} value={c.id}>{c.name || c.companyName || "Unnamed Company"}</option>
//                               ))
//                             ) : (
//                               <option disabled>No companies available</option>
//                             )}
//                           </select>
//                           <label className="flex items-center gap-2 text-sm">
//                             <input 
//                               type="checkbox" 
//                               checked={newDept.permanent} 
//                               onChange={(e) => setNewDept({ ...newDept, permanent: e.target.checked })} 
//                             />
//                             <span>Mark as Global</span>
//                           </label>
//                         </div>
//                       ) : (
//                         // ✅ Company Admin: Auto-filled, non-editable company name
//                         <div className="flex flex-col gap-1">
//                           <div className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white cursor-not-allowed">
//                             <strong>{currentCompanyName}</strong>
//                           </div>
//                           <p className="text-xs text-gray-400">Your company name (auto-set)</p>
//                         </div>
//                       )}
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Head of Department" 
//                       value={newDept.hod} 
//                       onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">Auto-generated</td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button className="text-green-500 hover:text-green-700" onClick={handleAddDept}>
//                         <FaCheck size={18} />
//                       </button>
//                       <button className="text-gray-400 hover:text-gray-500" onClick={handleCancelAdd}>
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {!loading && departments.map((dept) => (
//                 <tr key={dept.id} className={`hover:bg-gray-700 transition ${dept.permanent ? "bg-gray-800" : ""}`}>
//                   <td className="px-6 py-3 font-medium">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.name || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         {dept.permanent && <FaGlobe className="text-green-400" size={14} />}
//                         <span>{dept.name}</span>
//                         {/* {dept.permanent && <span className="text-xs px-2 py-1 bg-gray-600 rounded text-green-400">Globagggl</span>} */}
//                       </div>
//                     )}
//                   </td>

//                   {/* ✅ Company Name column */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-blue-400" size={14} />
//                         <span>
//                           {dept.permanent 
//                             ? "Global Department" 
//                             : dept.companyName || "N/A"
//                           }
//                         </span>
//                       </div>
//                     </td>
//                   )}

//                   <td className="px-6 py-3">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.hod || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, hod: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaUserTie className="text-blue-400" size={14} />
//                         <span>{dept.hod || "N/A"}</span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-3 text-gray-300">{formatDate(dept.createdAt)}</td>

//                   <td className="px-6 py-3">
//                     <div className="flex gap-2">
//                       {editingId === dept.id ? (
//                         <>
//                           <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(dept.id)}>
//                             <FaCheck size={16} />
//                           </button>
//                           <button className="text-gray-400 hover:text-gray-600" onClick={handleCancel}>
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           {/* Edit button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-blue-500 hover:text-blue-700"}`} 
//                               onClick={() => handleEdit(dept)}
//                             >
//                               <FaEdit size={16} />
//                             </button>
//                           )}

//                           {/* Delete button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`} 
//                               onClick={() => handleDelete(dept.id, dept.permanent)}
//                             >
//                               <FaTrash size={16} />
//                             </button>
//                           )}

//                           {dept.permanent && !isSiteAdmin && (
//                             <span className="text-gray-400 italic text-xs">Read Only</span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;









// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import Sidebar from "../../components/Sidebar";
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaCheck,
//   FaTimes,
//   FaBuilding,
//   FaUserTie,
//   FaCrown,
//   FaGlobe,
// } from "react-icons/fa";

// function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingDept, setAddingDept] = useState(false);
//   const [newDept, setNewDept] = useState({
//     name: "",
//     hod: "",
//     companyName: "",
//     cid: "",
//     permanent: false,
//   });
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [actualCompanyName, setActualCompanyName] = useState("");

//   // ✅ Logged-in user
//   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const companyId = loggedInUser?.cid;
//   const userRole = loggedInUser?.role;

//   const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
//   const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

//   // ✅ NEW: Firestore se directly company name fetch karein
//   useEffect(() => {
//     const fetchCompanyName = async () => {
//       if (isSiteAdmin || !companyId) return;
      
//       try {
//         console.log("Fetching company data for ID:", companyId);
//         const companyDoc = await getDoc(doc(db, "companies", companyId));
        
//         if (companyDoc.exists()) {
//           const companyData = companyDoc.data();
//           console.log("Company data from Firestore:", companyData);
          
//           // Different possible field names check karein
//           const companyName = 
//             companyData.name || 
//             companyData.companyName || 
//             companyData.businessName || 
//             companyData.title ||
//             "Our Company";
            
//           setActualCompanyName(companyName);
//           console.log("Final company name:", companyName);
//         } else {
//           console.log("Company document not found for ID:", companyId);
//           // Fallback methods
//           const fallbackName = getFallbackCompanyName();
//           setActualCompanyName(fallbackName);
//         }
//       } catch (error) {
//         console.error("Error fetching company:", error);
//         const fallbackName = getFallbackCompanyName();
//         setActualCompanyName(fallbackName);
//       }
//     };

//     fetchCompanyName();
//   }, [companyId, isSiteAdmin]);

//   // ✅ Fallback company name function
//   const getFallbackCompanyName = () => {
//     // User object check
//     if (loggedInUser?.companyName && loggedInUser.companyName !== "My Company") {
//       return loggedInUser.companyName;
//     }
    
//     // LocalStorage company data check
//     const companyData = JSON.parse(localStorage.getItem("company") || "{}");
//     if (companyData?.name && companyData.name !== "My Company") {
//       return companyData.name;
//     }
//     if (companyData?.companyName && companyData.companyName !== "My Company") {
//       return companyData.companyName;
//     }
    
//     // Email se derive karein
//     if (loggedInUser?.email) {
//       const domain = loggedInUser.email.split('@')[1];
//       const companyFromEmail = domain.split('.')[0];
//       return companyFromEmail.charAt(0).toUpperCase() + companyFromEmail.slice(1) + " Company";
//     }
    
//     return "Our Company";
//   };

//   const currentCompanyName = isSiteAdmin ? "Site Admin" : actualCompanyName;
//   const currentCompanyId = isSiteAdmin ? null : companyId;

//   // ---------------------
//   // Fetch companies for Site Admin
//   // ---------------------
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       if (isSiteAdmin) {
//         try {
//           const companiesRef = collection(db, "companies");
//           const snapshot = await getDocs(companiesRef);
//           const companyList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCompanies(companyList);
//         } catch (error) {
//           console.error("Error fetching companies:", error);
//         }
//       }
//     };
//     fetchCompanies();
//   }, [isSiteAdmin]);

//   // ---------------------
//   // Fetch departments 
//   // ---------------------
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         let deptList = [];
//         const deptRef = collection(db, "departments");

//         if (isSiteAdmin) {
//           const qGlobal = query(deptRef, where("permanent", "==", true));
//           const snapGlobal = await getDocs(qGlobal);
//           deptList = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));
//         } else if (currentCompanyId) {
//           const qCompany = query(deptRef, where("cid", "==", currentCompanyId));
//           const qGlobal = query(deptRef, where("permanent", "==", true));

//           const [snapCompany, snapGlobal] = await Promise.all([
//             getDocs(qCompany),
//             getDocs(qGlobal),
//           ]);

//           const companyDepts = snapCompany.docs.map((d) => ({ id: d.id, ...d.data() }));
//           const globalDepts = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));

//           const map = new Map();
//           [...globalDepts, ...companyDepts].forEach((d) => map.set(d.id, d));
//           deptList = Array.from(map.values());
//         }

//         setDepartments(deptList);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, [currentCompanyId, isSiteAdmin]);

//   // ---------------------
//   // Handle company selection for Site Admin when adding
//   // ---------------------
//   const handleCompanyChange = (e) => {
//     const selectedCompanyId = e.target.value;
//     const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
//     setNewDept({
//       ...newDept,
//       cid: selectedCompanyId,
//       companyName: selectedCompany ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company" : "",
//     });
//   };

//   // ---------------------
//   // Add new department - Auto-set company name for Company Admin
//   // ---------------------
//   const handleAddDept = async () => {
//     if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
//       alert("Please fill department name and HOD!");
//       return;
//     }

//     let finalCompanyId, finalCompanyName, finalPermanent;

//     if (isSiteAdmin) {
//       finalPermanent = !!newDept.permanent;
//       if (finalPermanent) {
//         finalCompanyId = null;
//         finalCompanyName = "Global";
//       } else {
//         if (!newDept.cid || !newDept.companyName) {
//           alert("Please select a company (or mark as Global)!");
//           return;
//         }
//         finalCompanyId = newDept.cid;
//         finalCompanyName = newDept.companyName;
//       }
//     } else {
//       // ✅ Company Admin: Actual company name use karein
//       finalCompanyId = currentCompanyId;
//       finalCompanyName = currentCompanyName;
//       finalPermanent = false;
      
//       console.log("Adding department with company:", {
//         companyId: finalCompanyId,
//         companyName: finalCompanyName
//       });
//     }

//     try {
//       setSaving(true);
//       const departmentData = {
//         name: newDept.name.trim(),
//         hod: newDept.hod.trim(),
//         companyName: finalCompanyName,
//         cid: finalCompanyId,
//         permanent: finalPermanent || false,
//         createdAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "departments"), departmentData);
//       const newDepartment = {
//         id: docRef.id,
//         ...departmentData,
//         createdAt: new Date(),
//       };

//       setDepartments((prev) => [...prev, newDepartment]);
//       setAddingDept(false);
//       setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//     } catch (error) {
//       console.error("Error adding department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------------------
//   // Delete department
//   // ---------------------
//   const handleDelete = async (id, permanent) => {
//     if (permanent && !isSiteAdmin) return alert("Global departments cannot be deleted by company admins.");
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         setSaving(true);
//         await deleteDoc(doc(db, "departments", id));
//         setDepartments((prev) => prev.filter((d) => d.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ---------------------
//   // Edit department
//   // ---------------------
//   const handleEdit = (dept) => {
//     if (dept.permanent && !isSiteAdmin) return;
//     setEditingId(dept.id);
//     setEditedData({ name: dept.name, hod: dept.hod });
//   };

//   const handleSave = async (id) => {
//     try {
//       setSaving(true);
//       const deptRef = doc(db, "departments", id);
//       await updateDoc(deptRef, {
//         name: editedData.name,
//         hod: editedData.hod,
//         updatedAt: serverTimestamp(),
//       });
//       setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...editedData } : d)));
//       setEditingId(null);
//       setEditedData({});
//     } catch (error) {
//       console.error("Error updating department:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedData({});
//   };

//   const handleCancelAdd = () => {
//     setAddingDept(false);
//     setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
//   };

//   // ✅ Set company name automatically when adding starts (for Company Admin)
//   useEffect(() => {
//     if (addingDept && !isSiteAdmin) {
//       setNewDept(prev => ({
//         ...prev,
//         companyName: currentCompanyName,
//         cid: currentCompanyId
//       }));
//     }
//   }, [addingDept, isSiteAdmin, currentCompanyName, currentCompanyId]);

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     if (date.toDate) return date.toDate().toLocaleDateString();
//     if (date instanceof Date) return date.toLocaleDateString();
//     return "N/A";
//   };

//   const totalDepartments = departments.length;
//   const userAddedDepartments = departments.filter((d) => !d.permanent).length;
//   const globalDepartmentsCount = departments.filter((d) => d.permanent).length;

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       {/* Loader Overlay */}
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">{saving ? "Saving..." : "Loading..."}</p>
//         </div>
//       )}

//       <div className="flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               Departments
//               {isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
//                   <FaCrown size={12} /> Site Admin
//                 </span>
//               )}
//               {isCompanyAdmin && !isSiteAdmin && (
//                 <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
//                   <FaUserTie size={12} /> Company Admin
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               {isSiteAdmin
//                 ? `Viewing GLOBAL departments only (${globalDepartmentsCount} total)`
//                 : `Viewing departments (${userAddedDepartments} company + ${globalDepartmentsCount} global)`}
//             </p>
//             {/* ✅ Company info display */}
//             {!isSiteAdmin && (
//               <p className="text-gray-400 text-xs mt-1">
//                 Company: <strong className="text-white">{currentCompanyName}</strong> (ID: {currentCompanyId})
//               </p>
//             )}
//           </div>
//           <button onClick={() => setAddingDept(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//             <FaPlus size={16} /> Add Department
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">Department Name</th>
//                 {(isSiteAdmin || isCompanyAdmin) && <th className="px-6 py-4">Company Name</th>}
//                 <th className="px-6 py-4">HOD</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New */}
//               {addingDept && (
//                 <tr className="bg-gray-700">
//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Department Name" 
//                       value={newDept.name} 
//                       onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   {/* ✅ Company Name column */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3 border border-gray-700">
//                       {isSiteAdmin ? (
//                         <div className="flex gap-2">
//                           <select 
//                             value={newDept.cid} 
//                             onChange={handleCompanyChange} 
//                             className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                             required
//                           >
//                             <option value="">Select Company</option>
//                             {companies.length > 0 ? (
//                               companies.map((c) => (
//                                 <option key={c.id} value={c.id}>{c.name || c.companyName || "Unnamed Company"}</option>
//                               ))
//                             ) : (
//                               <option disabled>No companies available</option>
//                             )}
//                           </select>
//                           <label className="flex items-center gap-2 text-sm">
//                             <input 
//                               type="checkbox" 
//                               checked={newDept.permanent} 
//                               onChange={(e) => setNewDept({ ...newDept, permanent: e.target.checked })} 
//                             />
//                             <span>Mark as Global</span>
//                           </label>
//                         </div>
//                       ) : (
//                         // ✅ Company Admin: Auto-filled, non-editable company name
//                         <div className="flex flex-col gap-1">
//                           <div className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white cursor-not-allowed">
//                             <strong>{currentCompanyName}</strong>
//                           </div>
//                           <p className="text-xs text-gray-400">Your company name (auto-set)</p>
//                         </div>
//                       )}
//                     </td>
//                   )}

//                   <td className="px-6 py-3 border border-gray-700">
//                     <input 
//                       type="text" 
//                       placeholder="Head of Department" 
//                       value={newDept.hod} 
//                       onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })} 
//                       className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
//                     />
//                   </td>

//                   <td className="px-6 py-3 border border-gray-700 text-gray-400">Auto-generated</td>

//                   <td className="px-6 py-3 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button className="text-green-500 hover:text-green-700" onClick={handleAddDept}>
//                         <FaCheck size={18} />
//                       </button>
//                       <button className="text-gray-400 hover:text-gray-500" onClick={handleCancelAdd}>
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Department Rows */}
//               {!loading && departments.map((dept, idx) => (
//                 <tr 
//                   key={dept.id} 
//                   className={`${
//                     idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
//                   } hover:bg-gray-700 transition-colors cursor-pointer ${dept.permanent ? "border-l-2 border-green-500" : ""}`}
//                 >
//                   <td className="px-6 py-3 font-medium">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.name || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         {dept.permanent && <FaGlobe className="text-green-400" size={14} />}
//                         <span>{dept.name}</span>
//                       </div>
//                     )}
//                   </td>

//                   {/* ✅ Company Name column */}
//                   {(isSiteAdmin || isCompanyAdmin) && (
//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-blue-400" size={14} />
//                         <span>
//                           {dept.permanent 
//                             ? "Global Department" 
//                             : dept.companyName || "N/A"
//                           }
//                         </span>
//                       </div>
//                     </td>
//                   )}

//                   <td className="px-6 py-3">
//                     {editingId === dept.id ? (
//                       <input 
//                         type="text" 
//                         value={editedData.hod || ""} 
//                         onChange={(e) => setEditedData({ ...editedData, hod: e.target.value })} 
//                         className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaUserTie className="text-blue-400" size={14} />
//                         <span>{dept.hod || "N/A"}</span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-3 text-gray-300">{formatDate(dept.createdAt)}</td>

//                   <td className="px-6 py-3">
//                     <div className="flex gap-2">
//                       {editingId === dept.id ? (
//                         <>
//                           <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(dept.id)}>
//                             <FaCheck size={16} />
//                           </button>
//                           <button className="text-gray-400 hover:text-gray-600" onClick={handleCancel}>
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           {/* Edit button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-blue-500 hover:text-blue-700"}`} 
//                               onClick={() => handleEdit(dept)}
//                             >
//                               <FaEdit size={16} />
//                             </button>
//                           )}

//                           {/* Delete button */}
//                           {(!dept.permanent || isSiteAdmin) && (
//                             <button 
//                               className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"}`} 
//                               onClick={() => handleDelete(dept.id, dept.permanent)}
//                             >
//                               <FaTrash size={16} />
//                             </button>
//                           )}

//                           {dept.permanent && !isSiteAdmin && (
//                             <span className="text-gray-400 italic text-xs">Read Only</span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Departments;







import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import Sidebar from "../../components/Sidebar";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaUserTie,
  FaCrown,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingDept, setAddingDept] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    hod: "",
    companyName: "",
    cid: "",
    permanent: false,
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actualCompanyName, setActualCompanyName] = useState("");

  // Logout dropdown state
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const logoutDropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
  const companyId = loggedInUser?.cid;
  const userRole = loggedInUser?.role;

  const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
  const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutDropdownRef.current && !logoutDropdownRef.current.contains(event.target)) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Toggle logout dropdown
  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  // ✅ NEW: Firestore se directly company name fetch karein
  useEffect(() => {
    const fetchCompanyName = async () => {
      if (isSiteAdmin || !companyId) return;
      
      try {
        console.log("Fetching company data for ID:", companyId);
        const companyDoc = await getDoc(doc(db, "companies", companyId));
        
        if (companyDoc.exists()) {
          const companyData = companyDoc.data();
          console.log("Company data from Firestore:", companyData);
          
          // Different possible field names check karein
          const companyName = 
            companyData.name || 
            companyData.companyName || 
            companyData.businessName || 
            companyData.title ||
            "Our Company";
            
          setActualCompanyName(companyName);
          console.log("Final company name:", companyName);
        } else {
          console.log("Company document not found for ID:", companyId);
          // Fallback methods
          const fallbackName = getFallbackCompanyName();
          setActualCompanyName(fallbackName);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        const fallbackName = getFallbackCompanyName();
        setActualCompanyName(fallbackName);
      }
    };

    fetchCompanyName();
  }, [companyId, isSiteAdmin]);

  // ✅ Fallback company name function
  const getFallbackCompanyName = () => {
    // User object check
    if (loggedInUser?.companyName && loggedInUser.companyName !== "My Company") {
      return loggedInUser.companyName;
    }
    
    // LocalStorage company data check
    const companyData = JSON.parse(localStorage.getItem("company") || "{}");
    if (companyData?.name && companyData.name !== "My Company") {
      return companyData.name;
    }
    if (companyData?.companyName && companyData.companyName !== "My Company") {
      return companyData.companyName;
    }
    
    // Email se derive karein
    if (loggedInUser?.email) {
      const domain = loggedInUser.email.split('@')[1];
      const companyFromEmail = domain.split('.')[0];
      return companyFromEmail.charAt(0).toUpperCase() + companyFromEmail.slice(1) + " Company";
    }
    
    return "Our Company";
  };

  const currentCompanyName = isSiteAdmin ? "Site Admin" : actualCompanyName;
  const currentCompanyId = isSiteAdmin ? null : companyId;

  // ---------------------
  // Fetch companies for Site Admin
  // ---------------------
  useEffect(() => {
    const fetchCompanies = async () => {
      if (isSiteAdmin) {
        try {
          const companiesRef = collection(db, "companies");
          const snapshot = await getDocs(companiesRef);
          const companyList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCompanies(companyList);
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      }
    };
    fetchCompanies();
  }, [isSiteAdmin]);

  // ---------------------
  // Fetch departments 
  // ---------------------
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        let deptList = [];
        const deptRef = collection(db, "departments");

        if (isSiteAdmin) {
          const qGlobal = query(deptRef, where("permanent", "==", true));
          const snapGlobal = await getDocs(qGlobal);
          deptList = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));
        } else if (currentCompanyId) {
          const qCompany = query(deptRef, where("cid", "==", currentCompanyId));
          const qGlobal = query(deptRef, where("permanent", "==", true));

          const [snapCompany, snapGlobal] = await Promise.all([
            getDocs(qCompany),
            getDocs(qGlobal),
          ]);

          const companyDepts = snapCompany.docs.map((d) => ({ id: d.id, ...d.data() }));
          const globalDepts = snapGlobal.docs.map((d) => ({ id: d.id, ...d.data() }));

          const map = new Map();
          [...globalDepts, ...companyDepts].forEach((d) => map.set(d.id, d));
          deptList = Array.from(map.values());
        }

        setDepartments(deptList);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [currentCompanyId, isSiteAdmin]);

  // ---------------------
  // Handle company selection for Site Admin when adding
  // ---------------------
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
    setNewDept({
      ...newDept,
      cid: selectedCompanyId,
      companyName: selectedCompany ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company" : "",
    });
  };

  // ---------------------
  // Add new department - Auto-set company name for Company Admin
  // ---------------------
  const handleAddDept = async () => {
    if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
      alert("Please fill department name and HOD!");
      return;
    }

    let finalCompanyId, finalCompanyName, finalPermanent;

    if (isSiteAdmin) {
      finalPermanent = !!newDept.permanent;
      if (finalPermanent) {
        finalCompanyId = null;
        finalCompanyName = "Global";
      } else {
        if (!newDept.cid || !newDept.companyName) {
          alert("Please select a company (or mark as Global)!");
          return;
        }
        finalCompanyId = newDept.cid;
        finalCompanyName = newDept.companyName;
      }
    } else {
      // ✅ Company Admin: Actual company name use karein
      finalCompanyId = currentCompanyId;
      finalCompanyName = currentCompanyName;
      finalPermanent = false;
      
      console.log("Adding department with company:", {
        companyId: finalCompanyId,
        companyName: finalCompanyName
      });
    }

    try {
      setSaving(true);
      const departmentData = {
        name: newDept.name.trim(),
        hod: newDept.hod.trim(),
        companyName: finalCompanyName,
        cid: finalCompanyId,
        permanent: finalPermanent || false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "departments"), departmentData);
      const newDepartment = {
        id: docRef.id,
        ...departmentData,
        createdAt: new Date(),
      };

      setDepartments((prev) => [...prev, newDepartment]);
      setAddingDept(false);
      setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      setSaving(false);
    }
  };

  // ---------------------
  // Delete department
  // ---------------------
  const handleDelete = async (id, permanent) => {
    if (permanent && !isSiteAdmin) return alert("Global departments cannot be deleted by company admins.");
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        setSaving(true);
        await deleteDoc(doc(db, "departments", id));
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  // ---------------------
  // Edit department
  // ---------------------
  const handleEdit = (dept) => {
    if (dept.permanent && !isSiteAdmin) return;
    setEditingId(dept.id);
    setEditedData({ name: dept.name, hod: dept.hod });
  };

  const handleSave = async (id) => {
    try {
      setSaving(true);
      const deptRef = doc(db, "departments", id);
      await updateDoc(deptRef, {
        name: editedData.name,
        hod: editedData.hod,
        updatedAt: serverTimestamp(),
      });
      setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...editedData } : d)));
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleCancelAdd = () => {
    setAddingDept(false);
    setNewDept({ name: "", hod: "", companyName: "", cid: "", permanent: false });
  };

  // ✅ Set company name automatically when adding starts (for Company Admin)
  useEffect(() => {
    if (addingDept && !isSiteAdmin) {
      setNewDept(prev => ({
        ...prev,
        companyName: currentCompanyName,
        cid: currentCompanyId
      }));
    }
  }, [addingDept, isSiteAdmin, currentCompanyName, currentCompanyId]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.toDate) return date.toDate().toLocaleDateString();
    if (date instanceof Date) return date.toLocaleDateString();
    return "N/A";
  };

  const totalDepartments = departments.length;
  const userAddedDepartments = departments.filter((d) => !d.permanent).length;
  const globalDepartmentsCount = departments.filter((d) => d.permanent).length;

  return (
    <div className="min-h-screen bg-[#101828] flex relative">
      <Sidebar />

      {/* Loader Overlay */}
      {(loading || saving) && (
        <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
          </div>
          <p className="mt-4 text-gray-200 text-lg font-semibold">{saving ? "Saving..." : "Loading..."}</p>
        </div>
      )}

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              Departments
              {isSiteAdmin && (
                <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
                  <FaCrown size={12} /> Site Admin
                </span>
              )}
              {isCompanyAdmin && !isSiteAdmin && (
                <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
                  <FaUserTie size={12} /> Company Admin
                </span>
              )}
            </h1>
          </div>
          
          {/* User Info and Logout Dropdown */}
          {/* <div className="flex items-center gap-4" ref={logoutDropdownRef}>
            <div className="text-right">
              <p className="text-white font-semibold">{loggedInUser?.name || "User"}</p>
              <p className="text-gray-400 text-sm">{loggedInUser?.email || "user@example.com"}</p>
            </div>
            <div className="relative">
              <button
                onClick={toggleLogoutDropdown}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {loggedInUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>
              
              {showLogoutDropdown && (
                <div className="absolute right-0 top-12 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-white font-semibold truncate">{loggedInUser?.name || "User"}</p>
                    <p className="text-gray-400 text-sm truncate">{loggedInUser?.email || "user@example.com"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2 cursor-pointer rounded-b-lg"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div> */}

                      <div className="flex items-center gap-4" ref={logoutDropdownRef}>
  <div className="text-right">
    <p className="text-white font-semibold">{loggedInUser?.name || "User"}</p>
    <p className="text-gray-400 text-sm">{loggedInUser?.email || "user@example.com"}</p>
  </div>
  <div className="relative">
    <button
      onClick={toggleLogoutDropdown}
      className="flex items-center gap-2 px-3 py-2 rounded-full  text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
    >
      <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        {loggedInUser?.name?.charAt(0)?.toUpperCase() || "U"}
      </span>
      {/* Dropdown Icon */}
      <svg 
        className={`w-4 h-4 transition-transform duration-200 ${showLogoutDropdown ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {showLogoutDropdown && (
      <div className="absolute right-0 top-12 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
        <div className="p-3 border-b border-gray-700">
          <p className="text-white font-semibold truncate">{loggedInUser?.name || "User"}</p>
          <p className="text-gray-400 text-sm truncate">{loggedInUser?.email || "user@example.com"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2 cursor-pointer rounded-b-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    )}
  </div>
</div>

        </div>

        {/* Info Section */}
        <div className="mb-0">
          <p className="text-gray-400 text-sm">
            {isSiteAdmin
              ? `Viewing GLOBAL departments only (${globalDepartmentsCount} total)`
              : `Viewing departments (${userAddedDepartments} company + ${globalDepartmentsCount} global)`}
          </p>
          {/* ✅ Company info display */}
          {!isSiteAdmin && (
            <p className="text-gray-400 text-xs mt-1">
              Company: <strong className="text-white">{currentCompanyName}</strong> (ID: {currentCompanyId})
            </p>
          )}

               <div className="flex gap-3 justify-end mb-6">
          <button 
            onClick={() => setAddingDept(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            disabled={saving}
          >
            <FaPlus size={16} /> Add Department
          </button>
        </div>   

        </div>

        {/* Add Department Button - Moved below header */}
        

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-white bg-[#101828]">
            <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                {(isSiteAdmin || isCompanyAdmin) && <th className="px-6 py-4">Company Name</th>}
                <th className="px-6 py-4">HOD</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Add New */}
              {addingDept && (
                <tr className="bg-gray-700">
                  <td className="px-6 py-3 border border-gray-700">
                    <input 
                      type="text" 
                      placeholder="Department Name" 
                      value={newDept.name} 
                      onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} 
                      className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
                      disabled={saving}
                    />
                  </td>

                  {/* ✅ Company Name column */}
                  {(isSiteAdmin || isCompanyAdmin) && (
                    <td className="px-6 py-3 border border-gray-700">
                      {isSiteAdmin ? (
                        <div className="flex gap-2">
                          <select 
                            value={newDept.cid} 
                            onChange={handleCompanyChange} 
                            className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
                            required
                            disabled={saving}
                          >
                            <option value="">Select Company</option>
                            {companies.length > 0 ? (
                              companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name || c.companyName || "Unnamed Company"}</option>
                              ))
                            ) : (
                              <option disabled>No companies available</option>
                            )}
                          </select>
                          <label className="flex items-center gap-2 text-sm">
                            <input 
                              type="checkbox" 
                              checked={newDept.permanent} 
                              onChange={(e) => setNewDept({ ...newDept, permanent: e.target.checked })} 
                              disabled={saving}
                            />
                            <span>Mark as Global</span>
                          </label>
                        </div>
                      ) : (
                        // ✅ Company Admin: Auto-filled, non-editable company name
                        <div className="flex flex-col gap-1">
                          <div className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white cursor-not-allowed">
                            <strong>{currentCompanyName}</strong>
                          </div>
                          <p className="text-xs text-gray-400">Your company name (auto-set)</p>
                        </div>
                      )}
                    </td>
                  )}

                  <td className="px-6 py-3 border border-gray-700">
                    <input 
                      type="text" 
                      placeholder="Head of Department" 
                      value={newDept.hod} 
                      onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })} 
                      className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white" 
                      disabled={saving}
                    />
                  </td>

                  <td className="px-6 py-3 border border-gray-700 text-gray-400">Auto-generated</td>

                  <td className="px-6 py-3 border border-gray-700">
                    <div className="flex gap-2">
                      <button 
                        className="text-green-500 hover:text-green-700 disabled:opacity-50" 
                        onClick={handleAddDept}
                        disabled={saving}
                      >
                        <FaCheck size={18} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-500 disabled:opacity-50" 
                        onClick={handleCancelAdd}
                        disabled={saving}
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Department Rows */}
              {!loading && departments.map((dept, idx) => (
                <tr 
                  key={dept.id} 
                  className={`${
                    idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } hover:bg-gray-700 transition-colors cursor-pointer ${dept.permanent ? "border-l-2 border-green-500" : ""}`}
                >
                  <td className="px-6 py-3 font-medium">
                    {editingId === dept.id ? (
                      <input 
                        type="text" 
                        value={editedData.name || ""} 
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
                        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
                        disabled={saving}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {dept.permanent && <FaGlobe className="text-green-400" size={14} />}
                        <span>{dept.name}</span>
                      </div>
                    )}
                  </td>

                  {/* ✅ Company Name column */}
                  {(isSiteAdmin || isCompanyAdmin) && (
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-blue-400" size={14} />
                        <span>
                          {dept.permanent 
                            ? "Global Department" 
                            : dept.companyName || "N/A"
                          }
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-3">
                    {editingId === dept.id ? (
                      <input 
                        type="text" 
                        value={editedData.hod || ""} 
                        onChange={(e) => setEditedData({ ...editedData, hod: e.target.value })} 
                        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white" 
                        disabled={saving}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-blue-400" size={14} />
                        <span>{dept.hod || "N/A"}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-3 text-gray-300">{formatDate(dept.createdAt)}</td>

                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {editingId === dept.id ? (
                        <>
                          <button 
                            className="text-green-500 hover:text-green-700 disabled:opacity-50" 
                            onClick={() => handleSave(dept.id)}
                            disabled={saving}
                          >
                            <FaCheck size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50" 
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Edit button */}
                          {(!dept.permanent || isSiteAdmin) && (
                            <button 
                              className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-blue-500 hover:text-blue-700"} disabled:opacity-50`} 
                              onClick={() => handleEdit(dept)}
                              disabled={saving}
                            >
                              <FaEdit size={16} />
                            </button>
                          )}

                          {/* Delete button */}
                          {(!dept.permanent || isSiteAdmin) && (
                            <button 
                              className={`${dept.permanent ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"} disabled:opacity-50`} 
                              onClick={() => handleDelete(dept.id, dept.permanent)}
                              disabled={saving}
                            >
                              <FaTrash size={16} />
                            </button>
                          )}

                          {dept.permanent && !isSiteAdmin && (
                            <span className="text-gray-400 italic text-xs">Read Only</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Departments;