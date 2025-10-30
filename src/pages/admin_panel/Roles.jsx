// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../config/firebase.js";
// import { FaEdit, FaTrash, FaCheck, FaTimes, FaUser, FaBuilding, FaIdBadge, FaCircle } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "",
//     company: "",
//     department: "",
//     status: "inactive",
//     contact: ""
//   });

//   // Fetch users from Firestore
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData(user);
//   };

//   // Save update
//   const handleSave = async (id) => {
//     try {
//       const userRef = doc(db, "users", id);
//       await updateDoc(userRef, { 
//         ...editedData, 
//         updatedAt: serverTimestamp() 
//       });
//       setUsers(
//         users.map((u) => (u.id === id ? { ...u, ...editedData } : u))
//       );
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   // Add new user
//   const handleAddUser = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "users"), {
//         ...newUser,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//       setUsers([...users, { id: docRef.id, ...newUser }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         role: "",
//         company: "",
//         department: "",
//         status: "inactive",
//         contact: ""
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//     }
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active": return "text-green-500";
//       case "inactive": return "text-red-500";
//       case "pending": return "text-yellow-500";
//       default: return "text-gray-500";
//     }
//   };

//   // Get role color
//   const getRoleColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case "admin": return "bg-red-100 text-red-800";
//       case "manager": return "bg-blue-100 text-blue-800";
//       case "user": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       {/* Sidebar left */}
//       <Sidebar />

//       {/* Main content */}
//       <div className="flex-1 "> {/* Adjust based on your sidebar width */}
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm ">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white">Roles</h1>
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
//           >
//             <FaUser size={16} />
//             Add Role
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white  bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4 ">User</th>
//                 <th className="px-6 py-4 ">Role</th>
//                 <th className="px-6 py-4 ">Company</th>
//                 <th className="px-6 py-4 ">Department</th>
//                 <th className="px-6 py-4 ">Status</th>
//                 <th className="px-6 py-4 ">Created At</th>
//                 <th className="px-6 py-4 ">Actions</th>
//               </tr>
//             </thead>

//             <tbody className=" ">
//               {/* Add User Row */}
//               {addingUser && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-2 border border-gray-300">
//                     <div className="flex items-center gap-3">
//                       {/* <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
//                         <FaUser size={16} />
//                       </div> */}
//                       <img
//   src="https://firebasestorage.googleapis.com/v0/b/screenshots-73056.appspot.com/o/company-logos%2F1759340472638_IMG-20250506-WA0209.jpg?alt=media"
//   alt="Company Logo"
//   className="h-10 w-10 object-contain"
// />

//                       <input
//                         type="text"
//                         placeholder="Full Name"
//                         value={newUser.name}
//                         onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                         className="border rounded px-3 py-2 w-full"
//                       />
//                     </div>
//                   </td>
                  
//                   <td className="px-6 py-2 border border-gray-300">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option  className=" text-gray-800 bg-gray-200" value="">Select Role</option>
//                       <option className=" text-gray-800 bg-gray-200" value="admin">Admin</option>
//                       <option className=" text-gray-800 bg-gray-200" value="manager">Manager</option>
//                       <option className=" text-gray-800 bg-gray-200" value="user">User</option>
//                     </select>
//                   </td>
                  
//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Company"
//                       value={newUser.company}
//                       onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>
                  
//                   <td className="px-6 py-4 border border-gray-300">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option className="text-gray-800 bg-gray-200" value="active">Active</option>
//                       <option className="text-gray-800 bg-gray-200" value="inactive">Inactive</option>
//                       <option className="text-gray-800 bg-gray-200" value="pending">Pending</option>
//                     </select>
//                   </td>
                  
//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Contact"
//                       value={newUser.contact}
//                       onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>
                  
                  
                  
//                   <td className="px-6 py-4 border border-gray-300">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded"
//                         onClick={handleAddUser}
//                         title="Save"
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-800 hover:text-gray-900 cursor-pointer p-2 rounded"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* User Rows */}
//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-700 transition">
//                   {/* User Column */}
//                   <td className="px-6 py-2 ">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
//                         {user.name ? user.name.charAt(0).toUpperCase() : <FaUser size={16} />}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-200">
//                           {editingUser === user.id ? (
//                             <input
//                               type="text"
//                               value={editedData.name || ""}
//                               onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
//                               className="border rounded px-2 py-1 w-full"
//                             />
//                           ) : (
//                             user.name || "N/A"
//                           )}
//                         </div>
//                         <div className="text-sm text-gray-500">{user.email || "N/A"}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Role Column */}
//                   <td className="px-6 py-4 ">
//                     {editingUser === user.id ? (
//                       <select
//                         value={editedData.role || ""}
//                         onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
//                         className="border rounded px-2 py-1 w-full"
//                       >
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="admin">Admin</option>
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="manager">Manager</option>
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="user">User</option>
//                       </select>
//                     ) : (
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                         {user.role || "N/A"}
//                       </span>
//                     )}
//                   </td>

//                   {/* Company Column */}
//                   <td className="px-6 py-4 ">
//                     {editingUser === user.id ? (
//                       <input
//                         type="text"
//                         value={editedData.company || ""}
//                         onChange={(e) => setEditedData({ ...editedData, company: e.target.value })}
//                         className="border rounded px-2 py-1 w-full"
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaBuilding className="text-gray-200" size={14} />
//                         <span>{user.company || "N/A"}</span>
//                       </div>
//                     )}
//                   </td>

//                   {/* Department Column */}
//                   <td className="px-6 py-4 ">
//                     {editingUser === user.id ? (
//                       <input
//                         type="text"
//                         value={editedData.department || ""}
//                         onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
//                         className="border rounded px-2 py-1 w-full"
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaIdBadge className="text-gray-200" size={14} />
//                         <span>{user.department || "N/A"}</span>
//                       </div>
//                     )}
//                   </td>

//                   {/* Status Column */}
//                   <td className="px-6 py-4 ">
//                     {editingUser === user.id ? (
//                       <select
//                         value={editedData.status || ""}
//                         onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
//                         className="border rounded px-2 py-1 w-full"
//                       >
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="active">Active</option>
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="inactive">Inactive</option>
//                         <option className="text-gray-800 bg-gray-200 cursor-pointer" value="pending">Pending</option>
//                       </select>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FaCircle className={getStatusColor(user.status)} size={10} />
//                         <span className="capitalize">{user.status || "inactive"}</span>
//                       </div>
//                     )}
//                   </td>

                 

//                   {/* Created At Column */}
//                   <td className="px-6 py-4 ">
//                     {user.createdAt?.toDate
//                       ? user.createdAt.toDate().toLocaleDateString()
//                       : "N/A"}
//                   </td>

//                   {/* Actions Column */}
//                   <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                       {editingUser === user.id ? (
//                         <>
//                           <button
//                             className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded hover:bg-gray-400"
//                             onClick={() => handleSave(user.id)}
//                             title="Save"
//                           >
//                             <FaCheck size={16} />
//                           </button>
//                           <button
//                             className="text-gray-500 hover:text-gray-800 cursor-pointer p-2 rounded hover:bg-gray-400"
//                             onClick={handleCancel}
//                             title="Cancel"
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded hover:bg-gray-400"
//                             onClick={() => handleEdit(user)}
//                             title="Edit"
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded hover:bg-gray-400"
//                             onClick={() => handleDelete(user.id)}
//                             title="Delete"
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {users.length === 0 && !addingUser && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//             <p className="text-gray-500 mb-4">Get started by adding your first user.</p>
//             <button
//               onClick={() => setAddingUser(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Add First User
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











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
//   where
// } from "firebase/firestore";
// import { db } from "../../config/firebase.js";
// import {
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaUser,
//   FaBuilding,
//   FaIdBadge,
//   FaCircle,
// } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "",
//     company: "",
//     department: "",
//     status: "inactive",
//     contact: "",
//   });

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
//   const companyCID = loggedInUser?.cid || null;

//   // ✅ Fetch users (filtered if company admin)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         let q;
//         const usersRef = collection(db, "users");

//         if (isSiteAdmin) {
//           // Site Admin → get all users
//           q = usersRef;
//         } else if (companyCID) {
//           // Company Admin → get only users from same company
//           q = query(usersRef, where("cid", "==", companyCID));
//         } else {
//           console.warn("No valid user context found in localStorage");
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [isSiteAdmin, companyCID]);

//   // ✅ Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData(user);
//   };

//   // ✅ Save update
//   const handleSave = async (id) => {
//     try {
//       const userRef = doc(db, "users", id);
//       await updateDoc(userRef, { ...editedData, updatedAt: serverTimestamp() });
//       setUsers(users.map((u) => (u.id === id ? { ...u, ...editedData } : u)));
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   // ✅ Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // ✅ Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   // ✅ Add new user
//   const handleAddUser = async () => {
//     try {
//       const userToAdd = {
//         ...newUser,
//         cid: isSiteAdmin ? newUser.cid || "" : companyCID, // Auto-attach company ID for company admins
//         company:
//           isSiteAdmin && newUser.company
//             ? newUser.company
//             : loggedInUser.companyName || "N/A",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "users"), userToAdd);
//       setUsers([...users, { id: docRef.id, ...userToAdd }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         role: "",
//         company: "",
//         department: "",
//         status: "inactive",
//         contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//     }
//   };

//   // ✅ Helpers
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-500";
//       case "inactive":
//         return "text-red-500";
//       case "pending":
//         return "text-yellow-500";
//       default:
//         return "text-gray-500";
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case "admin":
//         return "bg-red-100 text-red-800";
//       case "manager":
//         return "bg-blue-100 text-blue-800";
//       case "user":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex">
//       <Sidebar />

//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white">Roles</h1>
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
//           >
//             <FaUser size={16} />
//             Add Role
//           </button>
//         </div>

//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Company</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingUser && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-2 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>

//                   <td className="px-6 py-2 border border-gray-300">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="admin">Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="user">User</option>
//                     </select>
//                   </td>

//                   {/* Company Name (editable only for site admin) */}
//                   <td className="px-6 py-4 border border-gray-300">
//                     {isSiteAdmin ? (
//                       <input
//                         type="text"
//                         placeholder="Company Name"
//                         value={newUser.company}
//                         onChange={(e) =>
//                           setNewUser({ ...newUser, company: e.target.value })
//                         }
//                         className="border rounded px-3 py-2 w-full"
//                       />
//                     ) : (
//                       <input
//                         type="text"
//                         value={loggedInUser.companyName || ""}
//                         readOnly
//                         className="border rounded px-3 py-2 w-full bg-gray-200 text-gray-700"
//                       />
//                     )}
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, department: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">Now</td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded"
//                         onClick={handleAddUser}
//                         title="Save"
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-800 hover:text-gray-900 cursor-pointer p-2 rounded"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Show only filtered users */}
//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-700 transition">
//                   <td className="px-6 py-2">{user.name || "N/A"}</td>
//                   <td className="px-6 py-4">{user.role || "N/A"}</td>
//                   <td className="px-6 py-4">{user.company || "N/A"}</td>
//                   <td className="px-6 py-4">{user.department || "N/A"}</td>
//                   <td className="px-6 py-4 capitalize">{user.status}</td>
//                   <td className="px-6 py-4">
//                     {user.createdAt?.toDate
//                       ? user.createdAt.toDate().toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       className="text-blue-600 hover:text-blue-800 cursor-pointer p-2"
//                       onClick={() => handleEdit(user)}
//                     >
//                       <FaEdit size={16} />
//                     </button>
//                     <button
//                       className="text-red-600 hover:text-red-800 cursor-pointer p-2"
//                       onClick={() => handleDelete(user.id)}
//                     >
//                       <FaTrash size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && !addingUser && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-300 mb-2">
//               No users found
//             </h3>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











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
// import { db } from "../../config/firebase.js";
// import {
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaUser,
// } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "",
//     company: "",
//     department: "",
//     status: "inactive",
//     contact: "",
//   });

//   // ✅ Loader states
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
//   const companyCID = loggedInUser?.cid || null;

//   // ✅ Fetch users (filtered if company admin)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         let q;
//         const usersRef = collection(db, "users");

//         if (isSiteAdmin) {
//           q = usersRef;
//         } else if (companyCID) {
//           q = query(usersRef, where("cid", "==", companyCID));
//         } else {
//           console.warn("No valid user context found in localStorage");
//           setLoading(false);
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [isSiteAdmin, companyCID]);

//   // ✅ Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData(user);
//   };

//   // ✅ Save update
//   const handleSave = async (id) => {
//     setSaving(true);
//     try {
//       const userRef = doc(db, "users", id);
//       await updateDoc(userRef, { ...editedData, updatedAt: serverTimestamp() });
//       setUsers(users.map((u) => (u.id === id ? { ...u, ...editedData } : u)));
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // ✅ Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setSaving(true);
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Add new user
//   const handleAddUser = async () => {
//     setSaving(true);
//     try {
//       const userToAdd = {
//         ...newUser,
//         cid: isSiteAdmin ? newUser.cid || "" : companyCID,
//         company:
//           isSiteAdmin && newUser.company
//             ? newUser.company
//             : loggedInUser.companyName || "N/A",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "users"), userToAdd);
//       setUsers([...users, { id: docRef.id, ...userToAdd }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         role: "",
//         company: "",
//         department: "",
//         status: "inactive",
//         contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white">Roles</h1>
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
//           >
//             <FaUser size={16} />
//             Add Role
//           </button>
//         </div>

//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Company</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingUser && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-2 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>

//                   <td className="px-6 py-2 border border-gray-300">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="admin">Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="user">User</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     {isSiteAdmin ? (
//                       <input
//                         type="text"
//                         placeholder="Company Name"
//                         value={newUser.company}
//                         onChange={(e) =>
//                           setNewUser({ ...newUser, company: e.target.value })
//                         }
//                         className="border rounded px-3 py-2 w-full"
//                       />
//                     ) : (
//                       <input
//                         type="text"
//                         value={loggedInUser.companyName || ""}
//                         readOnly
//                         className="border rounded px-3 py-2 w-full bg-gray-200 text-gray-700"
//                       />
//                     )}
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, department: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     />
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">Now</td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded"
//                         onClick={handleAddUser}
//                         title="Save"
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-gray-800 hover:text-gray-900 cursor-pointer p-2 rounded"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-700 transition">
//                   <td className="px-6 py-2">{user.name || "N/A"}</td>
//                   <td className="px-6 py-4">{user.role || "N/A"}</td>
//                   <td className="px-6 py-4">{user.company || "N/A"}</td>
//                   <td className="px-6 py-4">{user.department || "N/A"}</td>
//                   <td className="px-6 py-4 capitalize">{user.status}</td>
//                   <td className="px-6 py-4">
//                     {user.createdAt?.toDate
//                       ? user.createdAt.toDate().toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       className="text-blue-600 hover:text-blue-800 cursor-pointer p-2"
//                       onClick={() => handleEdit(user)}
//                     >
//                       <FaEdit size={16} />
//                     </button>
//                     <button
//                       className="text-red-600 hover:text-red-800 cursor-pointer p-2"
//                       onClick={() => handleDelete(user.id)}
//                     >
//                       <FaTrash size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && !addingUser && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-300 mb-2">
//               No users found
//             </h3>
//           </div>
//         )}
//       </div>

//       {/* ✅ Loader */}
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
//     </div>
//   );
// }







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
// import { db } from "../../config/firebase.js";
// import {
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaUser,
//   FaCrown,
//   FaUserTie,
// } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "",
//     company: "",
//     department: "",
//     status: "inactive",
//     contact: "",
//   });

//   // ✅ Loader states
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
//   const isCompanyAdmin = loggedInUser?.role?.toLowerCase() === "admin" || 
//                         loggedInUser?.role?.toLowerCase() === "company admin";
//   const companyCID = loggedInUser?.cid || null;

//   // ✅ Fetch users (filtered if company admin)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         let q;
//         const usersRef = collection(db, "users");

//         if (isSiteAdmin) {
//           q = usersRef;
//         } else if (companyCID) {
//           q = query(usersRef, where("cid", "==", companyCID));
//         } else {
//           console.warn("No valid user context found in localStorage");
//           setLoading(false);
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [isSiteAdmin, companyCID]);

//   // ✅ Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData(user);
//   };

//   // ✅ Save update
//   const handleSave = async (id) => {
//     setSaving(true);
//     try {
//       const userRef = doc(db, "users", id);
//       await updateDoc(userRef, { ...editedData, updatedAt: serverTimestamp() });
//       setUsers(users.map((u) => (u.id === id ? { ...u, ...editedData } : u)));
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // ✅ Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setSaving(true);
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Add new user
//   const handleAddUser = async () => {
//     setSaving(true);
//     try {
//       const userToAdd = {
//         ...newUser,
//         cid: isSiteAdmin ? newUser.cid || "" : companyCID,
//         company:
//           isSiteAdmin && newUser.company
//             ? newUser.company
//             : loggedInUser.companyName || "N/A",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       const docRef = await addDoc(collection(db, "users"), userToAdd);
//       setUsers([...users, { id: docRef.id, ...userToAdd }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         role: "",
//         company: "",
//         department: "",
//         status: "inactive",
//         contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       <div className="flex-1">
//         {/* Updated Header with User Type Badge */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               Roles
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
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
//           >
//             <FaUser size={16} />
//             Add Role
//           </button>
//         </div>

//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Company</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingUser && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-2 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     />
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       value={newUser.email}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, email: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full mt-2 bg-gray-800 text-white"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Contact"
//                       value={newUser.contact}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, contact: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full mt-2 bg-gray-800 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-2 border border-gray-300">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     >
//                       <option value="">Select Role</option>
//                       <option value="admin">Admin</option>
//                       <option value="company admin">Company Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="user">User</option>
//                       <option value="Super Admin">Super Admin</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     {isSiteAdmin ? (
//                       <input
//                         type="text"
//                         placeholder="Company Name"
//                         value={newUser.company}
//                         onChange={(e) =>
//                           setNewUser({ ...newUser, company: e.target.value })
//                         }
//                         className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                       />
//                     ) : (
//                       <input
//                         type="text"
//                         value={loggedInUser.companyName || ""}
//                         readOnly
//                         className="border rounded px-3 py-2 w-full bg-gray-600 text-gray-300 cursor-not-allowed"
//                       />
//                     )}
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, department: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300 text-gray-400">
//                     Now
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={handleAddUser}
//                         title="Save"
//                         disabled={saving}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                         disabled={saving}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-700 transition">
//                   {editingUser === user.id ? (
//                     <>
//                       {/* Edit Mode */}
//                       <td className="px-6 py-2">
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, name: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         />
//                         <input
//                           type="email"
//                           value={editedData.email || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, email: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full mt-1 bg-gray-800 text-white"
//                         />
//                         <input
//                           type="text"
//                           value={editedData.contact || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, contact: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full mt-1 bg-gray-800 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.role || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, role: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         >
//                           <option value="">Select Role</option>
//                           <option value="admin">Admin</option>
//                           <option value="company admin">Company Admin</option>
//                           <option value="manager">Manager</option>
//                           <option value="user">User</option>
//                           <option value="Super Admin">Super Admin</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4">
//                         {isSiteAdmin ? (
//                           <input
//                             type="text"
//                             value={editedData.company || ""}
//                             onChange={(e) =>
//                               setEditedData({ ...editedData, company: e.target.value })
//                             }
//                             className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                           />
//                         ) : (
//                           <span className="px-3 py-1 bg-gray-600 rounded">
//                             {user.company || "N/A"}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           value={editedData.department || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, department: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.status || "inactive"}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, status: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         >
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                           <option value="pending">Pending</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 text-gray-400">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={() => handleSave(user.id)}
//                             title="Save"
//                             disabled={saving}
//                           >
//                             <FaCheck size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={handleCancel}
//                             title="Cancel"
//                             disabled={saving}
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       {/* View Mode */}
//                       <td className="px-6 py-2">
//                         <div>
//                           <div className="font-medium">{user.name || "N/A"}</div>
//                           <div className="text-sm text-gray-400">{user.email || "N/A"}</div>
//                           {user.contact && (
//                             <div className="text-sm text-gray-400">{user.contact}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           user.role === "admin" || user.role === "company admin" 
//                             ? "bg-purple-600 text-white" 
//                             : user.role === "Super Admin"
//                             ? "bg-red-600 text-white"
//                             : "bg-blue-600 text-white"
//                         }`}>
//                           {user.role || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">{user.company || "N/A"}</td>
//                       <td className="px-6 py-4">{user.department || "N/A"}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs capitalize ${
//                           user.status === "active" 
//                             ? "bg-green-600 text-white" 
//                             : user.status === "pending"
//                             ? "bg-yellow-600 text-white"
//                             : "bg-gray-600 text-white"
//                         }`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleEdit(user)}
//                             title="Edit"
//                             disabled={saving}
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleDelete(user.id)}
//                             title="Delete"
//                             disabled={saving}
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && !addingUser && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-300 mb-2">
//               No users found
//             </h3>
//           </div>
//         )}
//       </div>

//       {/* ✅ Loader */}
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
//     </div>
//   );
// }







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
// import { db } from "../../config/firebase.js";
// import {
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaUser,
//   FaCrown,
//   FaUserTie,
//   FaBuilding,
// } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     cid: "",
//     department: "",
//     status: "inactive",
//     contact: "",
//   });

//   // ✅ Loader states
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
//   const isCompanyAdmin = loggedInUser?.role?.toLowerCase() === "admin" || 
//                         loggedInUser?.role?.toLowerCase() === "company admin";
//   const currentCid = loggedInUser?.cid || null;

//   // ✅ Fetch companies for site admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const companiesSnapshot = await getDocs(collection(db, "companies"));
//         const companiesList = companiesSnapshot.docs.map(doc => ({
//           cid: doc.id,
//           id: doc.id,
//           ...doc.data()
//         }));
//         console.log("Companies loaded:", companiesList); // Debug
//         setCompanies(companiesList);
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // ✅ Fetch users (filtered if company admin)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         let q;
//         const usersRef = collection(db, "users");

//         if (isSiteAdmin) {
//           q = usersRef;
//         } else if (currentCid) {
//           q = query(usersRef, where("cid", "==", currentCid));
//         } else {
//           console.warn("No valid user context found in localStorage");
//           setLoading(false);
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
        
//         console.log("Users loaded:", userList); // Debug users data
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [isSiteAdmin, currentCid]);

//   // ✅ Get company name from CID - IMPROVED FUNCTION
//   const getCompanyName = (cid) => {
//     if (!cid) {
//       console.log("No CID provided");
//       return "N/A";
//     }
    
//     // First check if user already has company name in their data
//     const user = users.find(u => u.cid === cid);
//     if (user && user.company) {
//       return user.company;
//     }
    
//     // Then check companies list
//     const company = companies.find((c) => c.cid === cid || c.id === cid);
    
//     if (company) {
//       console.log(`Found company: ${company.companyName} for CID: ${cid}`);
//       return company.companyName || company.name || "N/A";
//     }
    
//     console.log(`Company not found for CID: ${cid}`);
//     return "N/A";
//   };

//   // ✅ Get current user's company name
//   const getCurrentCompanyName = () => {
//     if (!currentCid) return "N/A";
//     return getCompanyName(currentCid);
//   };

//   // ✅ Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData({
//       ...user,
//       // Ensure we have the company name for display
//       company: user.company || getCompanyName(user.cid)
//     });
//   };

//   // ✅ Save update
//   const handleSave = async (id) => {
//     setSaving(true);
//     try {
//       const userRef = doc(db, "users", id);
      
//       // Prepare data for update - include company name if CID changed
//       const updateData = { ...editedData };
      
//       // If CID is changed and we're site admin, update company name too
//       if (isSiteAdmin && editedData.cid) {
//         updateData.company = getCompanyName(editedData.cid);
//       }
      
//       await updateDoc(userRef, { 
//         ...updateData, 
//         updatedAt: serverTimestamp() 
//       });
      
//       setUsers(users.map((u) => (u.id === id ? { ...u, ...updateData } : u)));
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // ✅ Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setSaving(true);
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Add new user
//   const handleAddUser = async () => {
//     if (!newUser.name || !newUser.email || !newUser.role) {
//       alert("Please fill in all required fields: Name, Email, and Role");
//       return;
//     }

//     setSaving(true);
//     try {
//       // Determine company ID and name
//       const cidToUse = isSiteAdmin ? newUser.cid : currentCid;
//       const companyNameToUse = getCompanyName(cidToUse);

//       const userToAdd = {
//         name: newUser.name,
//         email: newUser.email,
//         password: newUser.password || "default123",
//         role: newUser.role,
//         cid: cidToUse,
//         company: companyNameToUse, // Save company name explicitly
//         department: newUser.department || "",
//         status: newUser.status,
//         contact: newUser.contact || "",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       console.log("Adding user:", userToAdd); // Debug

//       const docRef = await addDoc(collection(db, "users"), userToAdd);
//       setUsers([...users, { id: docRef.id, ...userToAdd }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         password: "",
//         role: "",
//         cid: "",
//         department: "",
//         status: "inactive",
//         contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Error adding user: " + error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       <div className="flex-1">
//         {/* Updated Header with User Type Badge */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaUser className="text-blue-500" />
//               Roles & Users
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
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             disabled={saving}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
//           >
//             <FaUser size={16} />
//             Add User
//           </button>
//         </div>

//         {/* Debug Info - Remove in production */}
//         {isSiteAdmin && (
//           <div className="mx-6 mb-4 p-3 bg-gray-800 rounded text-sm">
//             <div className="text-gray-400">
//               <strong>Debug Info:</strong> {companies.length} companies loaded, {users.length} users loaded
//             </div>
//           </div>
//         )}

//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Company</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {addingUser && (
//                 <tr className="bg-gray-600">
//                   <td className="px-6 py-2 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Full Name *"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
//                       required
//                     />
//                     <input
//                       type="email"
//                       placeholder="Email *"
//                       value={newUser.email}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, email: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Contact"
//                       value={newUser.contact}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, contact: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-2 border border-gray-300">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                       required
//                     >
//                       <option value="">Select Role *</option>
//                       <option value="admin">Admin</option>
//                       <option value="company admin">Company Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="user">User</option>
//                       <option value="Super Admin">Super Admin</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     {isSiteAdmin ? (
//                       <select
//                         value={newUser.cid}
//                         onChange={(e) =>
//                           setNewUser({ ...newUser, cid: e.target.value })
//                         }
//                         className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                       >
//                         <option value="">Select Company</option>
//                         {companies.map((company) => (
//                           <option key={company.cid} value={company.cid}>
//                             {company.companyName || company.name || company.cid}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded">
//                         <FaBuilding className="text-blue-400" />
//                         <span>{getCurrentCompanyName()}</span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, department: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                       className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300 text-gray-400">
//                     Now
//                   </td>

//                   <td className="px-6 py-4 border border-gray-300">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={handleAddUser}
//                         title="Save"
//                         disabled={saving}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                         disabled={saving}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-700 transition">
//                   {editingUser === user.id ? (
//                     <>
//                       {/* Edit Mode */}
//                       <td className="px-6 py-2">
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, name: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white mb-2"
//                         />
//                         <input
//                           type="email"
//                           value={editedData.email || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, email: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.role || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, role: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         >
//                           <option value="">Select Role</option>
//                           <option value="admin">Admin</option>
//                           <option value="company admin">Company Admin</option>
//                           <option value="manager">Manager</option>
//                           <option value="user">User</option>
//                           <option value="Super Admin">Super Admin</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4">
//                         {isSiteAdmin ? (
//                           <select
//                             value={editedData.cid || ""}
//                             onChange={(e) =>
//                               setEditedData({ ...editedData, cid: e.target.value })
//                             }
//                             className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                           >
//                             <option value="">Select Company</option>
//                             {companies.map((company) => (
//                               <option key={company.cid} value={company.cid}>
//                                 {company.companyName || company.name || company.cid}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded">
//                             <FaBuilding className="text-blue-400" />
//                             <span>{getCompanyName(user.cid)}</span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           value={editedData.department || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, department: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.status || "inactive"}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, status: e.target.value })
//                           }
//                           className="border rounded px-3 py-1 w-full bg-gray-800 text-white"
//                         >
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                           <option value="pending">Pending</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 text-gray-400">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={() => handleSave(user.id)}
//                             title="Save"
//                             disabled={saving}
//                           >
//                             <FaCheck size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={handleCancel}
//                             title="Cancel"
//                             disabled={saving}
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       {/* View Mode */}
//                       <td className="px-6 py-2">
//                         <div>
//                           <div className="font-medium">{user.name || "N/A"}</div>
//                           <div className="text-sm text-gray-400">{user.email || "N/A"}</div>
//                           {user.contact && (
//                             <div className="text-sm text-gray-400">{user.contact}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           user.role === "admin" || user.role === "company admin" 
//                             ? "bg-purple-600 text-white" 
//                             : user.role === "Super Admin"
//                             ? "bg-red-600 text-white"
//                             : "bg-blue-600 text-white"
//                         }`}>
//                           {user.role || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" />
//                           <span className="font-medium">
//                             {user.company || getCompanyName(user.cid)}
//                           </span>
//                           {isSiteAdmin && user.cid && (
//                             <span className="text-xs text-gray-400">({user.cid})</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">{user.department || "N/A"}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs capitalize ${
//                           user.status === "active" 
//                             ? "bg-green-600 text-white" 
//                             : user.status === "pending"
//                             ? "bg-yellow-600 text-white"
//                             : "bg-gray-600 text-white"
//                         }`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleEdit(user)}
//                             title="Edit"
//                             disabled={saving}
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleDelete(user.id)}
//                             title="Delete"
//                             disabled={saving}
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && !addingUser && !loading && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-300 mb-2">
//               No users found
//             </h3>
//             <p className="text-gray-400">Click "Add User" to create a new user</p>
//           </div>
//         )}
//       </div>

//       {/* ✅ Loader */}
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
//     </div>
//   );
// }








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
// import { db } from "../../config/firebase.js";
// import {
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaUser,
//   FaCrown,
//   FaUserTie,
//   FaBuilding,
// } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";

// export default function RolesPage() {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [addingUser, setAddingUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     cid: "",
//     department: "",
//     status: "inactive",
//     contact: "",
//   });

//   // ✅ Loader states
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
//   const isCompanyAdmin = loggedInUser?.role?.toLowerCase() === "admin" || 
//                         loggedInUser?.role?.toLowerCase() === "company admin";
//   const currentCid = loggedInUser?.cid || null;

//   // ✅ Fetch companies for site admin
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const companiesSnapshot = await getDocs(collection(db, "companies"));
//         const companiesList = companiesSnapshot.docs.map(doc => ({
//           cid: doc.id,
//           id: doc.id,
//           ...doc.data()
//         }));
//         console.log("Companies loaded:", companiesList); // Debug
//         setCompanies(companiesList);
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // ✅ Fetch users (filtered if company admin)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         let q;
//         const usersRef = collection(db, "users");

//         if (isSiteAdmin) {
//           q = usersRef;
//         } else if (currentCid) {
//           q = query(usersRef, where("cid", "==", currentCid));
//         } else {
//           console.warn("No valid user context found in localStorage");
//           setLoading(false);
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
        
//         console.log("Users loaded:", userList); // Debug users data
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [isSiteAdmin, currentCid]);

//   // ✅ Get company name from CID - IMPROVED FUNCTION
//   const getCompanyName = (cid) => {
//     if (!cid) {
//       console.log("No CID provided");
//       return "N/A";
//     }
    
//     // First check if user already has company name in their data
//     const user = users.find(u => u.cid === cid);
//     if (user && user.company) {
//       return user.company;
//     }
    
//     // Then check companies list
//     const company = companies.find((c) => c.cid === cid || c.id === cid);
    
//     if (company) {
//       console.log(`Found company: ${company.companyName} for CID: ${cid}`);
//       return company.companyName || company.name || "N/A";
//     }
    
//     console.log(`Company not found for CID: ${cid}`);
//     return "N/A";
//   };

//   // ✅ Get current user's company name
//   const getCurrentCompanyName = () => {
//     if (!currentCid) return "N/A";
//     return getCompanyName(currentCid);
//   };

//   // ✅ Start editing
//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setEditedData({
//       ...user,
//       // Ensure we have the company name for display
//       company: user.company || getCompanyName(user.cid)
//     });
//   };

//   // ✅ Save update
//   const handleSave = async (id) => {
//     setSaving(true);
//     try {
//       const userRef = doc(db, "users", id);
      
//       // Prepare data for update - include company name if CID changed
//       const updateData = { ...editedData };
      
//       // If CID is changed and we're site admin, update company name too
//       if (isSiteAdmin && editedData.cid) {
//         updateData.company = getCompanyName(editedData.cid);
//       }
      
//       await updateDoc(userRef, { 
//         ...updateData, 
//         updatedAt: serverTimestamp() 
//       });
      
//       setUsers(users.map((u) => (u.id === id ? { ...u, ...updateData } : u)));
//       setEditingUser(null);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Cancel editing
//   const handleCancel = () => {
//     setEditingUser(null);
//     setEditedData({});
//   };

//   // ✅ Delete user
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setSaving(true);
//       try {
//         await deleteDoc(doc(db, "users", id));
//         setUsers(users.filter((u) => u.id !== id));
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   // ✅ Add new user
//   const handleAddUser = async () => {
//     if (!newUser.name || !newUser.email || !newUser.role) {
//       alert("Please fill in all required fields: Name, Email, and Role");
//       return;
//     }

//     setSaving(true);
//     try {
//       // Determine company ID and name
//       const cidToUse = isSiteAdmin ? newUser.cid : currentCid;
//       const companyNameToUse = getCompanyName(cidToUse);

//       const userToAdd = {
//         name: newUser.name,
//         email: newUser.email,
//         password: newUser.password || "default123",
//         role: newUser.role,
//         cid: cidToUse,
//         company: companyNameToUse, // Save company name explicitly
//         department: newUser.department || "",
//         status: newUser.status,
//         contact: newUser.contact || "",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       console.log("Adding user:", userToAdd); // Debug

//       const docRef = await addDoc(collection(db, "users"), userToAdd);
//       setUsers([...users, { id: docRef.id, ...userToAdd }]);
//       setAddingUser(false);
//       setNewUser({
//         name: "",
//         email: "",
//         password: "",
//         role: "",
//         cid: "",
//         department: "",
//         status: "inactive",
//         contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Error adding user: " + error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#101828] flex relative">
//       <Sidebar />

//       <div className="flex-1">
//         {/* Updated Header with User Type Badge */}
//         <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//               <FaUser className="text-blue-500" />
//               Roles & Users
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
//           </div>
//           <button
//             onClick={() => setAddingUser(true)}
//             disabled={saving}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
//           >
//             <FaUser size={16} />
//             Add User
//           </button>
//         </div>

//         {/* Debug Info - Remove in production */}
//         {isSiteAdmin && (
//           <div className="mx-6 mb-4 p-3 bg-gray-800 rounded text-sm">
//             <div className="text-gray-400">
//               <strong>Debug Info:</strong> {companies.length} companies loaded, {users.length} users loaded
//             </div>
//           </div>
//         )}

//         <div className="overflow-x-auto shadow rounded-lg mx-6">
//           <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//             <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Company</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Created At</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* Add New User Row */}
//               {addingUser && (
//                 <tr className="bg-gray-700">
//                   <td className="px-6 py-2 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Full Name *"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
//                       required
//                     />
//                     <input
//                       type="email"
//                       placeholder="Email *"
//                       value={newUser.email}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, email: e.target.value })
//                       }
//                       className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
//                       required
//                     />
                    
                    
//                   </td>

//                   <td className="px-6 py-2 border border-gray-700">
//                     <select
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white cursor-pointer"
//                       required
//                     >
//                       <option value="">Select Role *</option>
//                       <option  value="admin">Admin</option>
//                       <option value="company admin">Company Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="user">User</option>
//                       <option value="Super Admin">Super Admin</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-700">
//                     {isSiteAdmin ? (
//                       <select
//                         value={newUser.cid}
//                         onChange={(e) =>
//                           setNewUser({ ...newUser, cid: e.target.value })
//                         }
//                         className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white"
//                       >
//                         <option value="">Select Company</option>
//                         {companies.map((company) => (
//                           <option key={company.cid} value={company.cid}>
//                             {company.companyName || company.name || company.cid}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded">
//                         <FaBuilding className="text-blue-400" />
//                         <span>{getCurrentCompanyName()}</span>
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 border border-gray-700">
//                     <input
//                       type="text"
//                       placeholder="Department"
//                       value={newUser.department}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, department: e.target.value })
//                       }
//                       className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white"
//                     />
//                   </td>

//                   <td className="px-6 py-4 border border-gray-700">
//                     <select
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                       className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white cursor-pointer"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   </td>

//                   <td className="px-6 py-4 border border-gray-700 text-gray-400">
//                     Now
//                   </td>

//                   <td className="px-6 py-4 border border-gray-700">
//                     <div className="flex gap-2">
//                       <button
//                         className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={handleAddUser}
//                         title="Save"
//                         disabled={saving}
//                       >
//                         <FaCheck size={18} />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                         onClick={() => setAddingUser(false)}
//                         title="Cancel"
//                         disabled={saving}
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* User Rows with Alternating Colors */}
//               {users.map((user, idx) => (
//                 <tr 
//                   key={user.id} 
//                   className={`${
//                     idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
//                   } hover:bg-gray-700 transition-colors `}
//                 >
//                   {editingUser === user.id ? (
//                     <>
//                       {/* Edit Mode */}
//                       <td className="px-6 py-2">
//                         <input
//                           type="text"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, name: e.target.value })
//                           }
//                           className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white mb-2"
//                         />
//                         <input
//                           type="email"
//                           value={editedData.email || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, email: e.target.value })
//                           }
//                           className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.role || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, role: e.target.value })
//                           }
//                           className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white"
//                         >
//                           <option value="">Select Role</option>
//                           <option value="admin">Admin</option>
//                           <option value="company admin">Company Admin</option>
//                           <option value="manager">Manager</option>
//                           <option value="user">User</option>
//                           <option value="Super Admin">Super Admin</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4">
//                         {isSiteAdmin ? (
//                           <select
//                             value={editedData.cid || ""}
//                             onChange={(e) =>
//                               setEditedData({ ...editedData, cid: e.target.value })
//                             }
//                             className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white"
//                           >
//                             <option value="">Select Company</option>
//                             {companies.map((company) => (
//                               <option key={company.cid} value={company.cid}>
//                                 {company.companyName || company.name || company.cid}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded">
//                             <FaBuilding className="text-blue-400" />
//                             <span>{getCompanyName(user.cid)}</span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           value={editedData.department || ""}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, department: e.target.value })
//                           }
//                           className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <select
//                           value={editedData.status || "inactive"}
//                           onChange={(e) =>
//                             setEditedData({ ...editedData, status: e.target.value })
//                           }
//                           className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white"
//                         >
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                           <option value="pending">Pending</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 text-gray-400">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={() => handleSave(user.id)}
//                             title="Save"
//                             disabled={saving}
//                           >
//                             <FaCheck size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
//                             onClick={handleCancel}
//                             title="Cancel"
//                             disabled={saving}
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       {/* View Mode */}
//                       <td className="px-6 py-2">
//                         <div>
//                           <div className="font-medium">{user.name || "N/A"}</div>
//                           <div className="text-sm text-gray-400">{user.email || "N/A"}</div>
//                           {/* {user.contact && (
//                             <div className="text-sm text-gray-400">{user.contact}</div>
//                           )} */}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           user.role === "admin" || user.role === "company admin" 
//                             ? "bg-purple-600 text-white" 
//                             : user.role === "Super Admin"
//                             ? "bg-red-600 text-white"
//                             : "bg-blue-600 text-white"
//                         }`}>
//                           {user.role || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <FaBuilding className="text-blue-400" />
//                           <span className="font-medium">
//                             {user.company || getCompanyName(user.cid)}
//                           </span>
//                           {isSiteAdmin && user.cid && (
//                             <span className="text-xs text-gray-400">({user.cid})</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">{user.department || "N/A"}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 rounded text-xs capitalize ${
//                           user.status === "active" 
//                             ? "bg-green-600 text-white" 
//                             : user.status === "pending"
//                             ? "bg-yellow-600 text-white"
//                             : "bg-gray-600 text-white"
//                         }`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {user.createdAt?.toDate
//                           ? user.createdAt.toDate().toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleEdit(user)}
//                             title="Edit"
//                             disabled={saving}
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-400 cursor-pointer p-2 disabled:opacity-50"
//                             onClick={() => handleDelete(user.id)}
//                             title="Delete"
//                             disabled={saving}
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && !addingUser && !loading && (
//           <div className="text-center py-12">
//             <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-300 mb-2">
//               No users found
//             </h3>
//             <p className="text-gray-400">Click "Add User" to create a new user</p>
//           </div>
//         )}
//       </div>

//       {/* ✅ Loader */}
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
//     </div>
//   );
// }









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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase.js";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser,
  FaCrown,
  FaUserTie,
  FaBuilding,
  FaSearch,
  FaSignOutAlt,
  FaFilter,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

export default function RolesPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    cid: "",
    department: "",
    status: "inactive",
    contact: "",
  });

  // ✅ Loader states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // ✅ Logout dropdown state
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const logoutDropdownRef = useRef(null);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isSiteAdmin = loggedInUser?.isSiteAdmin || false;
  const isCompanyAdmin = loggedInUser?.role?.toLowerCase() === "admin" || 
                        loggedInUser?.role?.toLowerCase() === "company admin";
  const currentCid = loggedInUser?.cid || null;

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

  // ✅ Fetch companies for site admin
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesSnapshot = await getDocs(collection(db, "companies"));
        const companiesList = companiesSnapshot.docs.map(doc => ({
          cid: doc.id,
          id: doc.id,
          ...doc.data()
        }));
        console.log("Companies loaded:", companiesList); // Debug
        setCompanies(companiesList);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Fetch users (filtered if company admin)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let q;
        const usersRef = collection(db, "users");

        if (isSiteAdmin) {
          q = usersRef;
        } else if (currentCid) {
          q = query(usersRef, where("cid", "==", currentCid));
        } else {
          console.warn("No valid user context found in localStorage");
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        console.log("Users loaded:", userList); // Debug users data
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isSiteAdmin, currentCid]);

  // ✅ Get company name from CID - IMPROVED FUNCTION
  const getCompanyName = (cid) => {
    if (!cid) {
      console.log("No CID provided");
      return "N/A";
    }
    
    // First check if user already has company name in their data
    const user = users.find(u => u.cid === cid);
    if (user && user.company) {
      return user.company;
    }
    
    // Then check companies list
    const company = companies.find((c) => c.cid === cid || c.id === cid);
    
    if (company) {
      console.log(`Found company: ${company.companyName} for CID: ${cid}`);
      return company.companyName || company.name || "N/A";
    }
    
    console.log(`Company not found for CID: ${cid}`);
    return "N/A";
  };

  // ✅ Get current user's company name
  const getCurrentCompanyName = () => {
    if (!currentCid) return "N/A";
    return getCompanyName(currentCid);
  };

  // ✅ Start editing
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedData({
      ...user,
      // Ensure we have the company name for display
      company: user.company || getCompanyName(user.cid)
    });
  };

  // ✅ Save update
  const handleSave = async (id) => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", id);
      
      // Prepare data for update - include company name if CID changed
      const updateData = { ...editedData };
      
      // If CID is changed and we're site admin, update company name too
      if (isSiteAdmin && editedData.cid) {
        updateData.company = getCompanyName(editedData.cid);
      }
      
      await updateDoc(userRef, { 
        ...updateData, 
        updatedAt: serverTimestamp() 
      });
      
      setUsers(users.map((u) => (u.id === id ? { ...u, ...updateData } : u)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Cancel editing
  const handleCancel = () => {
    setEditingUser(null);
    setEditedData({});
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setSaving(true);
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  // ✅ Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Please fill in all required fields: Name, Email, and Role");
      return;
    }

    setSaving(true);
    try {
      // Determine company ID and name
      const cidToUse = isSiteAdmin ? newUser.cid : currentCid;
      const companyNameToUse = getCompanyName(cidToUse);

      const userToAdd = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || "default123",
        role: newUser.role,
        cid: cidToUse,
        company: companyNameToUse, // Save company name explicitly
        department: newUser.department || "",
        status: newUser.status,
        contact: newUser.contact || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("Adding user:", userToAdd); // Debug

      const docRef = await addDoc(collection(db, "users"), userToAdd);
      setUsers([...users, { id: docRef.id, ...userToAdd }]);
      setAddingUser(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "",
        cid: "",
        department: "",
        status: "inactive",
        contact: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "" || user.role === roleFilter;
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "" || 
      user.department?.toLowerCase().includes(departmentFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // ✅ Get unique values for filters
  const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];
  const uniqueStatuses = [...new Set(users.map(user => user.status).filter(Boolean))];
  const uniqueDepartments = [...new Set(users.map(user => user.department).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#101828] flex relative">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Updated Header with User Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Roles & Users
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
      {/* Dropdown Icon - Chevron Down */}
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

        {/* Add User Button - Moved below header */}
        

        {/* Filters Section */}
        <div className=" rounded-lg p-0 mb-6 ">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* <div className="flex items-center gap-2 text-white">
              <FaFilter className="text-blue-400" />
              <span className="font-semibold">Filters:</span>
            </div> */}
            
            {/* Search Input */}
            <div className="relative ">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(searchTerm || roleFilter || statusFilter || departmentFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("");
                  setStatusFilter("");
                  setDepartmentFilter("");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <div className="flex gap-3 ml-auto mb-2">
          <button
            onClick={() => setAddingUser(true)}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <FaUser size={16} />
            Add User
          </button>
        </div>
          </div>

          

          {/* Results Count */}
          {/* <div className="mt-3 text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
            {(searchTerm || roleFilter || statusFilter || departmentFilter) && (
              <span className="ml-2">
                (filtered)
              </span>
            )}
          </div> */}
        </div>

        {/* Debug Info - Remove in production */}
        {isSiteAdmin && (
          <div className="mb-4 p-3 bg-gray-800 rounded text-sm">
            <div className="text-gray-400">
              <strong>Debug Info:</strong> {companies.length} companies loaded, {users.length} users loaded
            </div>
          </div>
        )}

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-white bg-[#101828]">
            <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Add New User Row */}
              {addingUser && (
                <tr className="bg-gray-700">
                  <td className="px-6 py-2 border border-gray-700">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
                      required
                      disabled={saving}
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white mb-2"
                      required
                      disabled={saving}
                    />
                  </td>

                  <td className="px-6 py-2 border border-gray-700">
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white cursor-pointer disabled:opacity-50"
                      required
                      disabled={saving}
                    >
                      <option value="">Select Role *</option>
                      <option value="admin">Admin</option>
                      <option value="company admin">Company Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 border border-gray-700">
                    {isSiteAdmin ? (
                      <select
                        value={newUser.cid}
                        onChange={(e) =>
                          setNewUser({ ...newUser, cid: e.target.value })
                        }
                        className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white disabled:opacity-50"
                        disabled={saving}
                      >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                          <option key={company.cid} value={company.cid}>
                            {company.companyName || company.name || company.cid}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded">
                        <FaBuilding className="text-blue-400" />
                        <span>{getCurrentCompanyName()}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 border border-gray-700">
                    <input
                      type="text"
                      placeholder="Department"
                      value={newUser.department}
                      onChange={(e) =>
                        setNewUser({ ...newUser, department: e.target.value })
                      }
                      className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white disabled:opacity-50"
                      disabled={saving}
                    />
                  </td>

                  <td className="px-6 py-4 border border-gray-700">
                    <select
                      value={newUser.status}
                      onChange={(e) =>
                        setNewUser({ ...newUser, status: e.target.value })
                      }
                      className="border border-gray-600 rounded px-3 py-2 w-full bg-gray-800 text-white cursor-pointer disabled:opacity-50"
                      disabled={saving}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 border border-gray-700 text-gray-400">
                    Now
                  </td>

                  <td className="px-6 py-4 border border-gray-700">
                    <div className="flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
                        onClick={handleAddUser}
                        title="Save"
                        disabled={saving}
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
                        onClick={() => setAddingUser(false)}
                        title="Cancel"
                        disabled={saving}
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* User Rows with Alternating Colors */}
              {filteredUsers.map((user, idx) => (
                <tr 
                  key={user.id} 
                  className={`${
                    idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } hover:bg-gray-700 transition-colors `}
                >
                  {editingUser === user.id ? (
                    <>
                      {/* Edit Mode */}
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          value={editedData.name || ""}
                          onChange={(e) =>
                            setEditedData({ ...editedData, name: e.target.value })
                          }
                          className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white mb-2 disabled:opacity-50"
                          disabled={saving}
                        />
                        <input
                          type="email"
                          value={editedData.email || ""}
                          onChange={(e) =>
                            setEditedData({ ...editedData, email: e.target.value })
                          }
                          className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white disabled:opacity-50"
                          disabled={saving}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editedData.role || ""}
                          onChange={(e) =>
                            setEditedData({ ...editedData, role: e.target.value })
                          }
                          className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white disabled:opacity-50"
                          disabled={saving}
                        >
                          <option value="">Select Role</option>
                          <option value="admin">Admin</option>
                          <option value="company admin">Company Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {isSiteAdmin ? (
                          <select
                            value={editedData.cid || ""}
                            onChange={(e) =>
                              setEditedData({ ...editedData, cid: e.target.value })
                            }
                            className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white disabled:opacity-50"
                            disabled={saving}
                          >
                            <option value="">Select Company</option>
                            {companies.map((company) => (
                              <option key={company.cid} value={company.cid}>
                                {company.companyName || company.name || company.cid}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded">
                            <FaBuilding className="text-blue-400" />
                            <span>{getCompanyName(user.cid)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editedData.department || ""}
                          onChange={(e) =>
                            setEditedData({ ...editedData, department: e.target.value })
                          }
                          className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white disabled:opacity-50"
                          disabled={saving}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editedData.status || "inactive"}
                          onChange={(e) =>
                            setEditedData({ ...editedData, status: e.target.value })
                          }
                          className="border border-gray-600 rounded px-3 py-1 w-full bg-gray-700 text-white disabled:opacity-50"
                          disabled={saving}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {user.createdAt?.toDate
                          ? user.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="text-green-600 hover:text-green-400 cursor-pointer p-2 rounded disabled:opacity-50"
                            onClick={() => handleSave(user.id)}
                            title="Save"
                            disabled={saving}
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-400 cursor-pointer p-2 rounded disabled:opacity-50"
                            onClick={handleCancel}
                            title="Cancel"
                            disabled={saving}
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      <td className="px-6 py-2">
                        <div>
                          <div className="font-medium">{user.name || "N/A"}</div>
                          <div className="text-sm text-gray-400">{user.email || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === "admin" || user.role === "company admin" 
                            ? "bg-purple-600 text-white" 
                            : user.role === "Super Admin"
                            ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}>
                          {user.role || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-blue-400" />
                          <span className="font-medium">
                            {user.company || getCompanyName(user.cid)}
                          </span>
                          {isSiteAdmin && user.cid && (
                            <span className="text-xs text-gray-400">({user.cid})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.department || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          user.status === "active" 
                            ? "bg-green-600 text-white" 
                            : user.status === "pending"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.createdAt?.toDate
                          ? user.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-400 cursor-pointer p-2 disabled:opacity-50"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                            disabled={saving}
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-400 cursor-pointer p-2 disabled:opacity-50"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                            disabled={saving}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !addingUser && !loading && (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No users found
            </h3>
            <p className="text-gray-400">
              {searchTerm || roleFilter || statusFilter || departmentFilter 
                ? "No users match your filters. Try adjusting your search criteria."
                : 'Click "Add User" to create a new user'}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Loader */}
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