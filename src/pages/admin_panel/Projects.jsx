





// import React, { useState, useMemo } from "react";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

// function Projects() {
//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       name: "E-commerce Website",
//       client: "ABC Ltd.",
//       startDate: "2025-09-01",
//       endDate: "2025-12-30",
//       users: [
//         { id: 101, name: "Hassan", startDate: "2025-09-05", endDate: "2025-12-01", role: "Developer" },
//         { id: 102, name: "Zara", startDate: "2025-09-10", endDate: "2025-12-10", role: "Designer" },
//       ],
//       groupLeader: "Ali",
//     },
//     {
//       id: 2,
//       name: "Mobile App Development",
//       client: "XYZ Pvt.",
//       startDate: "2025-08-15",
//       endDate: "2025-11-20",
//       users: [{ id: 201, name: "Sara", startDate: "2025-08-20", endDate: "2025-11-10", role: "Tester" }],
//       groupLeader: "Ahmed",
//     },
//   ]);

//   const [editingProject, setEditingProject] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [search, setSearch] = useState("");
//   const [clientFilter, setClientFilter] = useState("");
//   const [userFilter, setUserFilter] = useState("");
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     role: "",
//   });

//   // Unique values
//   const uniqueClients = useMemo(
//     () => [...new Set(projects.map((p) => p.client))],
//     [projects]
//   );
//   const uniqueUsersCount = useMemo(
//     () => [...new Set(projects.map((p) => p.users.length))],
//     [projects]
//   );

//   // Filtered projects
//   const filteredProjects = useMemo(() => {
//     const s = search.toLowerCase();
//     return projects.filter((p) => {
//       const matchesSearch =
//         !s || p.name.toLowerCase().includes(s) || p.client.toLowerCase().includes(s);
//       const matchesClient = clientFilter ? p.client === clientFilter : true;
//       const matchesUsers = userFilter ? p.users.length === parseInt(userFilter) : true;
//       return matchesSearch && matchesClient && matchesUsers;
//     });
//   }, [projects, search, clientFilter, userFilter]);

//   // Edit project
//   const handleEdit = (project) => {
//     setEditingProject(project.id);
//     setEditedData(project);
//   };
//   const handleSave = (id) => {
//     if (!editedData.name || !editedData.client || !editedData.startDate || !editedData.endDate || !editedData.groupLeader) {
//       alert("⚠️ Please fill all fields before saving.");
//       return;
//     }
//     setProjects(
//       projects.map((p) => (p.id === id ? { ...p, ...editedData, users: p.users } : p))
//     );
//     setEditingProject(null);
//     setEditedData({});
//   };
//   const handleCancel = () => {
//     setEditingProject(null);
//     setEditedData({});
//   };
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       setProjects(projects.filter((p) => p.id !== id));
//     }
//   };
//   const handleAddProject = () => {
//     const newProject = {
//       id: Date.now(),
//       name: "",
//       client: "",
//       startDate: "",
//       endDate: "",
//       users: [],
//       groupLeader: "",
//     };
//     setProjects([...projects, newProject]);
//     setEditingProject(newProject.id);
//     setEditedData(newProject);
//   };

//   // Add user in modal
//   const handleSaveUser = () => {
//     if (!newUser.name || !newUser.startDate || !newUser.endDate || !newUser.role) {
//       alert("⚠️ Please fill all fields before adding user.");
//       return;
//     }
//     if (new Date(newUser.endDate) < new Date(newUser.startDate)) {
//       alert("⚠️ Ending date cannot be earlier than starting date.");
//       return;
//     }
//     setProjects(
//       projects.map((p) =>
//         p.id === selectedProject.id
//           ? { ...p, users: [...p.users, { ...newUser, id: Date.now() }] }
//           : p
//       )
//     );
//     setNewUser({ name: "", startDate: "", endDate: "", role: "" });
//     setShowAddForm(false);
//   };

//   const isFormValid =
//     editedData.name &&
//     editedData.client &&
//     editedData.startDate &&
//     editedData.endDate &&
//     editedData.groupLeader;

//   return (
//     <div className="flex min-h-screen bg-[#101828]">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* Header */}
//         <header className="w-full p-4 shadow flex justify-between items-center">
//           <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Projects</h1>
//           <button
//             onClick={handleAddProject}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
//           >
//             <FaPlus /> Add Project
//           </button>
//         </header>

//         {/* Filters */}
//         <div className="p-6 flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Search by project or client..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
//           />
//           <select
//             value={clientFilter}
//             onChange={(e) => setClientFilter(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
//           >
//             <option value="">All Clients</option>
//             {uniqueClients.map((c) => (
//               <option key={c} value={c}>{c}</option>
//             ))}
//           </select>
          
//         </div>

//         {/* Table */}
//         <div className="p-6">
//           <div className="overflow-x-auto shadow rounded-lg">
//             <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//               <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//                 <tr>
//                   <th className="px-6 py-4">Project Name</th>
//                   <th className="px-6 py-4">Client Name</th>
//                   <th className="px-6 py-4">Starting Date</th>
//                   <th className="px-6 py-4">Expected End Date</th>
//                   <th className="px-6 py-4">Users</th>
//                   <th className="px-6 py-4">Group Leader</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr
//                     key={project.id}
//                     onClick={() => setSelectedProject(project)}
//                     className={`transition border-gray-600 cursor-pointer ${
//                       editingProject === project.id ? "bg-gray-700" : "hover:bg-gray-700"
//                     }`}
//                   >
//                     {/* Project Name */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Project Name"
//                           value={editedData.name || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.name
//                       )}
//                     </td>

//                     {/* Client */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Client Name"
//                           value={editedData.client || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, client: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.client
//                       )}
//                     </td>

//                     {/* Start Date */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.startDate || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, startDate: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         project.startDate
//                       )}
//                     </td>

//                     {/* End Date */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.endDate || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, endDate: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         project.endDate
//                       )}
//                     </td>

//                     {/* Users */}
//                     <td className="px-6 py-3">{project.users.length}</td>

//                     {/* Group Leader */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Group Leader"
//                           value={editedData.groupLeader || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, groupLeader: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.groupLeader
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td
//                       className="px-6 py-3 flex gap-3"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       {editingProject === project.id ? (
//                         <>
//                           <button
//                             onClick={() => handleSave(project.id)}
//                             disabled={!isFormValid}
//                             className={`${!isFormValid ? "text-gray-500 cursor-not-allowed" : "text-green-400 hover:text-green-200 cursor-pointer"}`}
//                           >
//                             <FaCheck />
//                           </button>
//                           <button
//                             onClick={() => handleCancel(project.id)}
//                             className="text-red-400 hover:text-red-200 cursor-pointer"
//                           >
//                             <FaTimes />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEdit(project)}
//                             className="text-yellow-400 hover:text-yellow-200 cursor-pointer"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(project.id)}
//                             className="text-red-500 hover:text-red-300 cursor-pointer"
//                           >
//                             <FaTrash />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredProjects.length === 0 && (
//               <p className="p-4 text-gray-300">No projects found.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedProject && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-[#1e293b] text-white p-8 rounded-lg shadow-lg w-[70%] max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6">
//               {selectedProject.name} - Users
//             </h2>

//             {/* User List */}
//             {/* <div className="space-y-2 mb-4 max-h-90 overflow-y-auto">
//               {selectedProject.users.length === 0 ? (
//                 <p className="text-gray-400">No users added yet.</p>
//               ) : (
//                 selectedProject.users.map((u) => (
//                   <div
//                     key={u.id}
//                     className="border border-gray-600 p-2 rounded flex flex-col"
//                   >
//                     <span><strong>Name:</strong> {u.name}</span>
//                     <span><strong>Start:</strong> {u.startDate}</span>
//                     <span><strong>End:</strong> {u.endDate}</span>
//                     <span><strong>Role:</strong> {u.role}</span>
//                   </div>
//                 ))
//               )}
//             </div> */}
//             <div className="space-y-2 mb-4 max-h-90 overflow-y-auto">
//   {selectedProject.users.length === 0 ? (
//     <p className="text-gray-400">No users added yet.</p>
//   ) : (
//     <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
//       <thead className="bg-gray-800 text-gray-200">
//         <tr>
//           <th className="px-4 py-2 text-left border-b border-gray-700">Name</th>
//           <th className="px-4 py-2 text-left border-b border-gray-700">Start</th>
//           <th className="px-4 py-2 text-left border-b border-gray-700">End</th>
//           <th className="px-4 py-2 text-left border-b border-gray-700">Role</th>
//         </tr>
//       </thead>
//       <tbody className="bg-gray-900 text-gray-300">
//         {selectedProject.users.map((u) => (
//           <tr key={u.id} className="hover:bg-gray-800 transition">
//             <td className="px-4 py-2 border-b border-gray-700">{u.name}</td>
//             <td className="px-4 py-2 border-b border-gray-700">{u.startDate}</td>
//             <td className="px-4 py-2 border-b border-gray-700">{u.endDate}</td>
//             <td className="px-4 py-2 border-b border-gray-700">{u.role}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>


//             {/* Add User Button */}
//             {!showAddForm && (
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full cursor-pointer mb-4"
//               >
//                 + Add User
//               </button>
//             )}

//             {/* Add User Form */}
//             {showAddForm && (
//               <div className="space-y-2 mb-4">
//                 <label className="block text-sm text-gray-300">User Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter user name"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600"
//                 />

//                 <label className="block text-sm text-gray-300">Starting Date</label>
//                 <input
//                   type="date"
//                   value={newUser.startDate}
//                   onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
//                 />

//                 <label className="block text-sm text-gray-300">Ending Date</label>
//                 <input
//                   type="date"
//                   value={newUser.endDate}
//                   min={newUser.startDate}
//                   onChange={(e) => setNewUser({ ...newUser, endDate: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
//                 />

//                 <label className="block text-sm text-gray-300">Role</label>
//                 <input
//                   type="text"
//                   placeholder="Enter role"
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600"
//                 />

//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleSaveUser}
//                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full cursor-pointer"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setShowAddForm(false)}
//                     className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded w-full cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={() => setSelectedProject(null)}
//               className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full cursor-pointer"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Projects;









// import React, { useState, useEffect, useMemo } from "react";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
// import { db } from "../../config/firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
// } from "firebase/firestore";

// export default function Projects() {
//   // UI state
//   const [projects, setProjects] = useState([]);
//   const [editingProject, setEditingProject] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [search, setSearch] = useState("");
//   const [clientFilter, setClientFilter] = useState("");
//   const [userFilter, setUserFilter] = useState("");
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newUser, setNewUser] = useState({ name: "", startDate: "", endDate: "", role: "" });

//   // Read logged-in user / company from localStorage
//   const localUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
//   const localCompany = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("company") || "null") : null;
//   // company id can be stored under different keys depending on your login code; we try a few
//   const companyId = localCompany?.id || localUser?.cid || localUser?.companyId || null;
//   const isSiteAdmin = localUser?.isSiteAdmin;

//   // Helper: robust field lookup with fallbacks
//   const getField = (obj, keys) => {
//     if (!obj) return null;
//     for (const k of keys) {
//       const v = obj[k];
//       if (v !== undefined && v !== null && String(v).trim() !== "") return v;
//     }
//     return null;
//   };

//   // Helper: format Firestore timestamps and strings to YYYY-MM-DD for display
//   const formatDateVal = (val) => {
//     if (!val && val !== 0) return "-";
//     try {
//       if (typeof val === "string") {
//         // if already ISO-like or yyyy-mm-dd
//         if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
//         if (val.includes("T")) return val.slice(0, 10);
//         return val;
//       }
//       // Firestore Timestamp
//       if (val?.toDate) return val.toDate().toISOString().slice(0, 10);
//       if (val?.seconds) return new Date(val.seconds * 1000).toISOString().slice(0, 10);
//       // fallback
//       return String(val);
//     } catch (e) {
//       return String(val);
//     }
//   };

//   // Subscribe to projects collection and filter by company (client-side) if needed.
//   useEffect(() => {
//     // If Firestore is configured, subscribe to all projects and filter locally.
//     try {
//       const colRef = collection(db, "projects");
//       const unsub = onSnapshot(
//         colRef,
//         (snapshot) => {
//           const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//           // If current user is NOT site admin, only show projects that belong to their company
//           if (!isSiteAdmin && companyId) {
//             const filtered = all.filter((p) =>
//               ["cid", "companyId", "company_id", "company", "clientCid"].some((k) => p[k] === companyId)
//             );
//             setProjects(filtered);
//           } else {
//             setProjects(all);
//           }
//         },
//         (err) => {
//           console.error("Projects subscription error:", err);
//         }
//       );
//       return () => unsub();
//     } catch (err) {
//       console.warn("Firestore not available or subscription failed, falling back to demo data.", err);
//       // fallback demo data when firestore not available (keeps original UX)
//       setProjects([
//         {
//           id: 1,
//           name: "E-commerce Website",
//           client: "ABC Ltd.",
//           startDate: "2025-09-01",
//           endDate: "2025-12-30",
//           users: [
//             { id: 101, name: "Hassan", startDate: "2025-09-05", endDate: "2025-12-01", role: "Developer" },
//             { id: 102, name: "Zara", startDate: "2025-09-10", endDate: "2025-12-10", role: "Designer" },
//           ],
//           groupLeader: "Ali",
//           cid: "demo-company-1",
//         },
//       ]);
//     }
//   }, [companyId, isSiteAdmin]);

//   // Unique clients for the filter dropdown (use getField to support different keys)
//   const uniqueClients = useMemo(() => {
//     const arr = projects
//       .map((p) => getField(p, ["client", "clientName", "client_name", "companyName", "company_name"]))
//       .filter((x) => x && String(x).trim() !== "");
//     return [...new Set(arr)];
//   }, [projects]);

//   // filteredProjects applies search + client + user-count filters on top of already-company-filtered projects
//   const filteredProjects = useMemo(() => {
//     const s = (search || "").toLowerCase();
//     return projects.filter((p) => {
//       const name = String(getField(p, ["name", "projectName", "project_name", "title"]) || "").toLowerCase();
//       const client = String(getField(p, ["client", "clientName", "companyName", "company_name"]) || "").toLowerCase();
//       const matchesSearch = !s || name.includes(s) || client.includes(s);
//       const matchesClient = clientFilter ? client === clientFilter.toLowerCase() : true;
//       const matchesUsers = userFilter ? (p.users?.length || 0) === parseInt(userFilter) : true;
//       return matchesSearch && matchesClient && matchesUsers;
//     });
//   }, [projects, search, clientFilter, userFilter]);

//   // Edit project
//   const handleEdit = (project) => {
//     setEditingProject(project.id);
//     setEditedData({ ...project });
//   };

//   const handleSave = async (id) => {
//     if (!editedData.name || !editedData.client || !editedData.startDate || !editedData.endDate || !editedData.groupLeader) {
//       alert("⚠️ Please fill all fields before saving.");
//       return;
//     }

//     try {
//       // If project is stored in Firestore (id is string from firestore), update there
//       if (db && typeof id === "string") {
//         const docRef = doc(db, "projects", id);
//         // remove id from editedData to avoid duplicate field
//         const { id: _unused, ...rest } = editedData;
//         await updateDoc(docRef, rest);
//       } else {
//         // local fallback: update in-memory
//         setProjects(projects.map((p) => (p.id === id ? { ...p, ...editedData, users: p.users } : p)));
//       }

//       setEditingProject(null);
//       setEditedData({});
//     } catch (err) {
//       console.error("Error saving project:", err);
//       alert("Error saving project. See console for details.");
//     }
//   };

//   const handleCancel = () => {
//     setEditingProject(null);
//     setEditedData({});
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this project?")) return;
//     try {
//       if (db && typeof id === "string") {
//         await deleteDoc(doc(db, "projects", id));
//       } else {
//         setProjects(projects.filter((p) => p.id !== id));
//       }
//     } catch (err) {
//       console.error("Error deleting project:", err);
//       alert("Error deleting project.");
//     }
//   };

//   // Add project (persists to Firestore when available)
//   const handleAddProject = async () => {
//     const base = {
//       name: "",
//       client: "",
//       startDate: "",
//       endDate: "",
//       users: [],
//       groupLeader: "",
//       cid: isSiteAdmin ? "" : companyId,
//       companyName: localCompany?.name || "",
//     };

//     try {
//       if (db) {
//         const ref = await addDoc(collection(db, "projects"), base);
//         // set editing on the newly created doc so user can fill details
//         setEditingProject(ref.id);
//         setEditedData(base);
//       } else {
//         const tmp = { ...base, id: Date.now() };
//         setProjects([...projects, tmp]);
//         setEditingProject(tmp.id);
//         setEditedData(tmp);
//       }
//     } catch (err) {
//       console.error("Error adding project:", err);
//       alert("Error adding project.");
//     }
//   };

//   // Add user to project (saved to Firestore when available)
//   const handleSaveUser = async () => {
//     if (!newUser.name || !newUser.startDate || !newUser.endDate || !newUser.role) {
//       alert("⚠️ Please fill all fields before adding user.");
//       return;
//     }
//     if (new Date(newUser.endDate) < new Date(newUser.startDate)) {
//       alert("⚠️ Ending date cannot be earlier than starting date.");
//       return;
//     }

//     try {
//       const updatedUsers = [...(selectedProject.users || []), { ...newUser, id: Date.now() }];
//       if (db && typeof selectedProject.id === "string") {
//         const projectRef = doc(db, "projects", selectedProject.id);
//         await updateDoc(projectRef, { users: updatedUsers });
//         // optimistic UI update
//         setSelectedProject({ ...selectedProject, users: updatedUsers });
//       } else {
//         setProjects(
//           projects.map((p) => (p.id === selectedProject.id ? { ...p, users: updatedUsers } : p))
//         );
//         setSelectedProject({ ...selectedProject, users: updatedUsers });
//       }

//       setNewUser({ name: "", startDate: "", endDate: "", role: "" });
//       setShowAddForm(false);
//     } catch (err) {
//       console.error("Error adding user to project:", err);
//       alert("Error adding user to project.");
//     }
//   };

//   const isFormValid =
//     editedData.name && editedData.client && editedData.startDate && editedData.endDate && editedData.groupLeader;

//   return (
//     <div className="flex min-h-screen bg-[#101828]">
//       <Sidebar />
//       <div className="flex-1">
//         <header className="w-full p-4 shadow flex justify-between items-center">
//           <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Projects</h1>
//           <button
//             onClick={handleAddProject}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
//           >
//             <FaPlus /> Add Project
//           </button>
//         </header>

//         <div className="p-6 flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Search by project or client..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
//           />

//           <select
//             value={clientFilter}
//             onChange={(e) => setClientFilter(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
//           >
//             <option value="">All Clients</option>
//             {uniqueClients.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="p-6">
//           <div className="overflow-x-auto shadow rounded-lg">
//             <table className="min-w-full text-sm text-left text-gray-100 bg-[#101828]">
//               <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//                 <tr>
//                   <th className="px-6 py-4">Project Name</th>
//                   <th className="px-6 py-4">Client Name</th>
//                   <th className="px-6 py-4">Starting Date</th>
//                   <th className="px-6 py-4">Expected End Date</th>
//                   <th className="px-6 py-4">Users</th>
//                   <th className="px-6 py-4">Group Leader</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr
//                     key={project.id}
//                     onClick={() => setSelectedProject(project)}
//                     className={`transition border-gray-600 cursor-pointer ${
//                       editingProject === project.id ? "bg-gray-700" : "hover:bg-gray-700"
//                     }`}
//                   >
//                     <td className="px-6 py-3 text-gray-100">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Project Name"
//                           value={editedData.name || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         String(getField(project, ["name", "projectName", "project_name", "title"]) || "-")
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-100">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Client Name"
//                           value={editedData.client || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, client: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         String(getField(project, ["client", "clientName", "client_name", "companyName", "company_name"]) || "-")
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-100">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.startDate || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, startDate: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         formatDateVal(getField(project, ["startDate", "start_date", "start"]))
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-100">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.endDate || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, endDate: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         formatDateVal(getField(project, ["endDate", "end_date", "end"]))
//                       )}
//                     </td>

//                     <td className="px-6 py-3 text-gray-100">{project.users?.length || 0}</td>

//                     <td className="px-6 py-3 text-gray-100">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Group Leader"
//                           value={editedData.groupLeader || ""}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => setEditedData({ ...editedData, groupLeader: e.target.value })}
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         String(getField(project, ["groupLeader", "leader", "group_leader"]) || "-")
//                       )}
//                     </td>

//                     <td className="px-6 py-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
//                       {editingProject === project.id ? (
//                         <>
//                           <button
//                             onClick={() => handleSave(project.id)}
//                             disabled={!isFormValid}
//                             className={`${!isFormValid ? "text-gray-500 cursor-not-allowed" : "text-green-400 hover:text-green-200 cursor-pointer"}`}
//                           >
//                             <FaCheck />
//                           </button>
//                           <button onClick={() => handleCancel(project.id)} className="text-red-400 hover:text-red-200 cursor-pointer">
//                             <FaTimes />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button onClick={() => handleEdit(project)} className="text-yellow-400 hover:text-yellow-200 cursor-pointer">
//                             <FaEdit />
//                           </button>
//                           <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-300 cursor-pointer">
//                             <FaTrash />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredProjects.length === 0 && <p className="p-4 text-gray-300">No projects found.</p>}
//           </div>
//         </div>
//       </div>

//       {/* Modal for users */}
//       {selectedProject && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-[#1e293b] text-white p-8 rounded-lg shadow-lg w-[70%] max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6">{String(getField(selectedProject, ["name", "projectName", "project_name", "title"]) || "-")} - Users</h2>

//             <div className="space-y-2 mb-4 max-h-90 overflow-y-auto">
//               {selectedProject.users?.length === 0 ? (
//                 <p className="text-gray-400">No users added yet.</p>
//               ) : (
//                 <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
//                   <thead className="bg-gray-800 text-gray-200">
//                     <tr>
//                       <th className="px-4 py-2 text-left border-b border-gray-700">Name</th>
//                       <th className="px-4 py-2 text-left border-b border-gray-700">Start</th>
//                       <th className="px-4 py-2 text-left border-b border-gray-700">End</th>
//                       <th className="px-4 py-2 text-left border-b border-gray-700">Role</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-gray-900 text-gray-300">
//                     {selectedProject.users?.map((u) => (
//                       <tr key={u.id} className="hover:bg-gray-800 transition">
//                         <td className="px-4 py-2 border-b border-gray-700">{u.name}</td>
//                         <td className="px-4 py-2 border-b border-gray-700">{u.startDate}</td>
//                         <td className="px-4 py-2 border-b border-gray-700">{u.endDate}</td>
//                         <td className="px-4 py-2 border-b border-gray-700">{u.role}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {!showAddForm && (
//               <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full cursor-pointer mb-4">
//                 + Add User
//               </button>
//             )}

//             {showAddForm && (
//               <div className="space-y-2 mb-4">
//                 <label className="block text-sm text-gray-300">User Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter user name"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600"
//                 />

//                 <label className="block text-sm text-gray-300">Starting Date</label>
//                 <input
//                   type="date"
//                   value={newUser.startDate}
//                   onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
//                 />

//                 <label className="block text-sm text-gray-300">Ending Date</label>
//                 <input
//                   type="date"
//                   value={newUser.endDate}
//                   min={newUser.startDate}
//                   onChange={(e) => setNewUser({ ...newUser, endDate: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
//                 />

//                 <label className="block text-sm text-gray-300">Role</label>
//                 <input
//                   type="text"
//                   placeholder="Enter role"
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//                   className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600"
//                 />

//                 <div className="flex gap-2">
//                   <button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full cursor-pointer">
//                     Save
//                   </button>
//                   <button onClick={() => setShowAddForm(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded w-full cursor-pointer">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             <button onClick={() => setSelectedProject(null)} className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full cursor-pointer">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { db } from "../../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", startDate: "", endDate: "", role: "" });

  // ✅ New states for loader
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const localUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  const localCompany =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("company") || "null")
      : null;

  const companyId =
    localCompany?.id || localUser?.cid || localUser?.companyId || null;
  const isSiteAdmin = localUser?.isSiteAdmin;

  const getField = (obj, keys) => {
    if (!obj) return null;
    for (const k of keys) {
      const v = obj[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return null;
  };

  const formatDateVal = (val) => {
    if (!val && val !== 0) return "-";
    try {
      if (typeof val === "string") {
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
        if (val.includes("T")) return val.slice(0, 10);
        return val;
      }
      if (val?.toDate) return val.toDate().toISOString().slice(0, 10);
      if (val?.seconds)
        return new Date(val.seconds * 1000).toISOString().slice(0, 10);
      return String(val);
    } catch {
      return String(val);
    }
  };

  // ✅ Load projects with loader
  useEffect(() => {
    setLoading(true);
    try {
      const colRef = collection(db, "projects");
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!isSiteAdmin && companyId) {
            const filtered = all.filter((p) =>
              ["cid", "companyId", "company_id", "company", "clientCid"].some(
                (k) => p[k] === companyId
              )
            );
            setProjects(filtered);
          } else {
            setProjects(all);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Projects subscription error:", err);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn("Firestore not available:", err);
      setProjects([
        {
          id: 1,
          name: "E-commerce Website",
          client: "ABC Ltd.",
          startDate: "2025-09-01",
          endDate: "2025-12-30",
          users: [
            {
              id: 101,
              name: "Hassan",
              startDate: "2025-09-05",
              endDate: "2025-12-01",
              role: "Developer",
            },
          ],
          groupLeader: "Ali",
          cid: "demo-company-1",
        },
      ]);
      setLoading(false);
    }
  }, [companyId, isSiteAdmin]);

  const uniqueClients = useMemo(() => {
    const arr = projects
      .map((p) =>
        getField(p, [
          "client",
          "clientName",
          "client_name",
          "companyName",
          "company_name",
        ])
      )
      .filter((x) => x && String(x).trim() !== "");
    return [...new Set(arr)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const s = (search || "").toLowerCase();
    return projects.filter((p) => {
      const name = String(
        getField(p, ["name", "projectName", "project_name", "title"]) || ""
      ).toLowerCase();
      const client = String(
        getField(p, [
          "client",
          "clientName",
          "companyName",
          "company_name",
        ]) || ""
      ).toLowerCase();
      const matchesSearch = !s || name.includes(s) || client.includes(s);
      const matchesClient = clientFilter
        ? client === clientFilter.toLowerCase()
        : true;
      return matchesSearch && matchesClient;
    });
  }, [projects, search, clientFilter]);

  const handleEdit = (project) => {
    setEditingProject(project.id);
    setEditedData({ ...project });
  };

  const handleSave = async (id) => {
    if (
      !editedData.name ||
      !editedData.client ||
      !editedData.startDate ||
      !editedData.endDate ||
      !editedData.groupLeader
    ) {
      alert("⚠️ Please fill all fields before saving.");
      return;
    }

    setSaving(true);
    try {
      if (db && typeof id === "string") {
        const docRef = doc(db, "projects", id);
        const { id: _unused, ...rest } = editedData;
        await updateDoc(docRef, rest);
      } else {
        setProjects(
          projects.map((p) =>
            p.id === id ? { ...p, ...editedData, users: p.users } : p
          )
        );
      }
      setEditingProject(null);
      setEditedData({});
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Error saving project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setSaving(true);
    try {
      if (db && typeof id === "string") {
        await deleteDoc(doc(db, "projects", id));
      } else {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async () => {
    setSaving(true);
    const base = {
      name: "",
      client: "",
      startDate: "",
      endDate: "",
      users: [],
      groupLeader: "",
      cid: isSiteAdmin ? "" : companyId,
      companyName: localCompany?.name || "",
    };

    try {
      if (db) {
        const ref = await addDoc(collection(db, "projects"), base);
        setEditingProject(ref.id);
        setEditedData(base);
      } else {
        const tmp = { ...base, id: Date.now() };
        setProjects([...projects, tmp]);
        setEditingProject(tmp.id);
        setEditedData(tmp);
      }
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Error adding project.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid =
    editedData.name &&
    editedData.client &&
    editedData.startDate &&
    editedData.endDate &&
    editedData.groupLeader;

  return (
    <div className="flex min-h-screen bg-[#101828] relative">
      <Sidebar />
      <div className="flex-1">
        <header className="w-full p-4 shadow flex justify-between items-center">
          <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Projects</h1>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
          >
            <FaPlus /> Add Project
          </button>
        </header>

        <div className="p-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by project or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
          />

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
          >
            <option value="">All Clients</option>
            {uniqueClients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-100 bg-[#101828]">
              <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">End</th>
                  <th className="px-6 py-4">Users</th>
                  <th className="px-6 py-4">Group Leader</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`border-gray-600 cursor-pointer ${
                      editingProject === project.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={editedData.name || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              name: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-white"
                        />
                      ) : (
                        project.name
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={editedData.client || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              client: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-white"
                        />
                      ) : (
                        project.client
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="date"
                          value={editedData.startDate || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              startDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-gray-300"
                        />
                      ) : (
                        formatDateVal(project.startDate)
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="date"
                          value={editedData.endDate || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              endDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-gray-300"
                        />
                      ) : (
                        formatDateVal(project.endDate)
                      )}
                    </td>

                    <td className="px-6 py-3">{project.users?.length || 0}</td>
                    <td className="px-6 py-3">{project.groupLeader}</td>

                    <td className="px-6 py-3 flex gap-3">
                      {editingProject === project.id ? (
                        <>
                          <button
                            onClick={() => handleSave(project.id)}
                            disabled={!isFormValid}
                            className={`${
                              !isFormValid
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-green-400 hover:text-green-200"
                            }`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(null);
                              setEditedData({});
                            }}
                            className="text-red-400 hover:text-red-200"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-yellow-400 hover:text-yellow-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-500 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjects.length === 0 && (
              <p className="p-4 text-gray-300">No projects found.</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Global Loader */}
      {(loading || saving) && (
        <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
          </div>
          <p className="mt-4 text-gray-200 text-lg font-semibold">
            {saving ? "Saving..." : "Loading..."}
          </p>
        </div>
      )}
    </div>
  );
}
