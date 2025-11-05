

// import React, { useEffect, useState } from 'react'
// import { db } from "../config/firebase"
// import { collection, getDocs, query, where } from 'firebase/firestore'
// import { useParams } from 'react-router-dom'
// import { format, formatDistanceToNowStrict } from "date-fns"
// import ImageModal from '../components/ImageModal'
// import PhotoToVideo from '../components/PhotoToVideo'

// export default function Screenshots() {
//   const params = useParams()
//   const [userInfo, setUserInfo] = useState({})
//   const [userSS, setUserSS] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [openImg, setOpenImg] = useState()
//   const [showImage, setShowImage] = useState(false)
//   const [search, setSearch] = useState({
//     startingDate: "",
//     endingDate: "",
//     startingTime: "",
//     endingTime: ""
//   })

//   // 🔹 Fetch user data and screenshots
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const q = query(collection(db, "users"), where("uid", "==", params.id))
//         const querySnapshot = await getDocs(q)
//         if (!querySnapshot.empty) {
//           setUserInfo(querySnapshot.docs[0].data() || {})
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error)
//       }
//     }

//     const fetchScreenshots = async () => {
//       try {
//         const q = query(collection(db, "screenshots"), where("user_id", "==", params.id))
//         const querySnapshot = await getDocs(q)
//         const allScreenshots = querySnapshot.docs.map(doc => doc.data())
//         setUserSS(allScreenshots)
//       } catch (error) {
//         console.error("Error fetching screenshots:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//     fetchScreenshots()
//   }, [params.id])

//   // 🔹 Last active time
//   const validDate = userInfo?.lastActiveAt ? new Date(userInfo.lastActiveAt) : null
//   const result = validDate
//     ? formatDistanceToNowStrict(validDate, { addSuffix: true })
//     : "unknown time"

//   // 🔹 Handle image modal
//   const imageClicked = (imgUrl) => {
//     setOpenImg(imgUrl)
//     setShowImage(true)
//   }

//   // 🔹 Handle input changes
//   const handleInputs = (e) => {
//     setSearch(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }

//   // 🔹 Filter screenshots by date and time
//   const filteredScreenshots = userSS.filter((ss) => {
//     if (
//       !search.startingDate ||
//       !search.endingDate ||
//       !search.startingTime ||
//       !search.endingTime
//     ) {
//       return true // no filters applied, show all
//     }

//     const screenshotTime = new Date(ss.timestamp)
//     const start = new Date(`${search.startingDate}T${search.startingTime}`)
//     const end = new Date(`${search.endingDate}T${search.endingTime}`)

//     return screenshotTime >= start && screenshotTime <= end
//   })

//   // 🔹 Group filtered screenshots by date/hour
//   const ssTimeStamp = [
//     ...new Map(
//       filteredScreenshots.map((ss) => {
//         const date = new Date(ss.timestamp)
//         const formatDate = format(date, "dd,MM,yyyy")
//         const formatHrs = format(date, "HH")
//         return [`${formatDate}-${formatHrs}`, { date: formatDate, hrs: formatHrs }]
//       })
//     ).values()
//   ]

//   return (
//     <>
//       <div className='flex flex-col bg-gray-900 min-h-screen text-white p-6 relative'>
//         {/* 🔹 Your Custom Loader */}
//         {loading && (
//           <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//             <div className="relative w-16 h-16">
//               <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//               <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//             </div>
//             <p className="mt-4 text-gray-200 text-lg font-semibold">
//               Loading...
//             </p>
//           </div>
//         )}

//         {/* 🔹 Header */}
//         <header className="flex justify-between">
//           <span className='text-2xl font-bold'>{userInfo.name || 'Unknown User'}</span>
//           <span>
//             <span className='font-bold mx-1'>Last Active:</span>
//             <span>{result}</span>
//           </span>
//         </header>

//         {/* 🔹 Main Content */}
//         <main className='flex-1 flex gap-3'>
//           <div className="w-full flex-1 pr-3 border-r-2 border-gray-600">
//             <h1 className="text-2xl font-bold">Gallery</h1>

//             {/* 🔹 Filters */}
//             <div className='flex justify-between flex-wrap gap-3 mt-3'>
//               <label>
//                 Starting Date:
//                 <input
//                   name="startingDate"
//                   value={search.startingDate}
//                   onChange={handleInputs}
//                   type="date"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Ending Date:
//                 <input
//                   name="endingDate"
//                   value={search.endingDate}
//                   onChange={handleInputs}
//                   type="date"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Starting Time:
//                 <input
//                   name="startingTime"
//                   value={search.startingTime}
//                   onChange={handleInputs}
//                   type="time"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Ending Time:
//                 <input
//                   name="endingTime"
//                   value={search.endingTime}
//                   onChange={handleInputs}
//                   type="time"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <button
//                 onClick={() => setSearch({
//                   startingDate: "",
//                   endingDate: "",
//                   startingTime: "",
//                   endingTime: ""
//                 })}
//                 className="border px-3 py-1 rounded-lg hover:bg-gray-700"
//               >
//                 Clear Filters
//               </button>
//             </div>

//             {/* 🔹 Screenshot Display */}
//             <div className="mt-5">
//               {filteredScreenshots.length === 0 ? (
//                 <p className="text-gray-400 text-center mt-10">
//                   {userSS.length === 0 ? "No screenshots found." : "No screenshots found for selected range."}
//                 </p>
//               ) : (
//                 ssTimeStamp.map((num, i) => (
//                   <div key={`${num.date}-${num.hrs}-${i}`} className="mb-6">
//                     <h2 className="text-2xl font-bold text-gray-200">
//                       Date: {num.date}
//                     </h2>
//                     <h2 className="text-lg font-semibold text-gray-200 mb-3">
//                       Hours: {num.hrs}:00 - {Number(num.hrs) + 1}:00
//                     </h2>

//                     {/* 🔹 Image Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                       {filteredScreenshots.map((ss, j) => {
//                         const ssDate = new Date(ss.timestamp)
//                         const hours = Number(format(ssDate, "HH"))
//                         const dateFormatted = format(ssDate, "dd,MM,yyyy")
                        
//                         const blockStart = Number(num.hrs)
//                         const blockEnd = blockStart + 1

//                         if (dateFormatted === num.date && hours >= blockStart && hours < blockEnd) {
//                           return (
//                             <div
//                               onClick={() => imageClicked(ss.url)}
//                               key={ss.timestamp + j}
//                               className="cursor-pointer bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-200"
//                             >
//                               <img
//                                 src={ss.url}
//                                 alt={`Screenshot from ${format(ssDate, "d MMM, yyyy 'at' h:mm a")}`}
//                                 className="w-full h-auto object-cover p-1 rounded-lg"
//                                 loading="lazy"
//                               />
//                               <div className="my-2 text-sm text-gray-300 flex flex-col items-start px-3">
//                                 <span>{format(ssDate, "d MMM, yyyy")}</span>
//                                 <span>{format(ssDate, "h:mm a")}</span>
//                               </div>
//                             </div>
//                           )
//                         }
//                         return null
//                       })}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* 🔹 Side Section */}
//           <aside>
//             <PhotoToVideo images={filteredScreenshots} />
//           </aside>
//         </main>
//       </div>

//       {/* 🔹 Image Modal */}
//       {showImage && (
//         <ImageModal currImg={openImg} setShowImage={setShowImage} />
//       )}
//     </>
//   )
// }








// import React, { useEffect, useState } from 'react'
// import { db } from "../config/firebase"
// import { collection, getDocs, query, where } from 'firebase/firestore'
// import { useParams, useNavigate } from 'react-router-dom'
// import { format, formatDistanceToNowStrict } from "date-fns"
// import ImageModal from '../components/ImageModal'
// import PhotoToVideo from '../components/PhotoToVideo'

// export default function Screenshots() {
//   const params = useParams()
//   const navigate = useNavigate()
//   const [userInfo, setUserInfo] = useState({})
//   const [userSS, setUserSS] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [openImg, setOpenImg] = useState()
//   const [showImage, setShowImage] = useState(false)
//   const [search, setSearch] = useState({
//     startingDate: "",
//     endingDate: "",
//     startingTime: "",
//     endingTime: ""
//   })

//   // 🔹 Fetch user data and screenshots
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const q = query(collection(db, "users"), where("uid", "==", params.id))
//         const querySnapshot = await getDocs(q)
//         if (!querySnapshot.empty) {
//           setUserInfo(querySnapshot.docs[0].data() || {})
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error)
//       }
//     }

//     const fetchScreenshots = async () => {
//       try {
//         const q = query(collection(db, "screenshots"), where("user_id", "==", params.id))
//         const querySnapshot = await getDocs(q)
//         const allScreenshots = querySnapshot.docs.map(doc => doc.data())
//         setUserSS(allScreenshots)
//       } catch (error) {
//         console.error("Error fetching screenshots:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//     fetchScreenshots()
//   }, [params.id])

//   // 🔹 Last active time
//   const validDate = userInfo?.lastActiveAt ? new Date(userInfo.lastActiveAt) : null
//   const result = validDate
//     ? formatDistanceToNowStrict(validDate, { addSuffix: true })
//     : "unknown time"

//   // 🔹 Handle image modal
//   const imageClicked = (imgUrl) => {
//     setOpenImg(imgUrl)
//     setShowImage(true)
//   }

//   // 🔹 Handle input changes
//   const handleInputs = (e) => {
//     setSearch(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }

//   // 🔹 Go back to previous page
//   const handleGoBack = () => {
//     navigate(-1) // This will take user back to the previous page in history
//   }

//   // 🔹 Filter screenshots by date and time
//   const filteredScreenshots = userSS.filter((ss) => {
//     if (
//       !search.startingDate ||
//       !search.endingDate ||
//       !search.startingTime ||
//       !search.endingTime
//     ) {
//       return true // no filters applied, show all
//     }

//     const screenshotTime = new Date(ss.timestamp)
//     const start = new Date(`${search.startingDate}T${search.startingTime}`)
//     const end = new Date(`${search.endingDate}T${search.endingTime}`)

//     return screenshotTime >= start && screenshotTime <= end
//   })

//   // 🔹 Group filtered screenshots by date/hour
//   const ssTimeStamp = [
//     ...new Map(
//       filteredScreenshots.map((ss) => {
//         const date = new Date(ss.timestamp)
//         const formatDate = format(date, "dd,MM,yyyy")
//         const formatHrs = format(date, "HH")
//         return [`${formatDate}-${formatHrs}`, { date: formatDate, hrs: formatHrs }]
//       })
//     ).values()
//   ]

//   return (
//     <>
//       <div className='flex flex-col bg-gray-900 min-h-screen text-white p-6 relative'>
//         {/* 🔹 Your Custom Loader */}
//         {loading && (
//           <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//             <div className="relative w-16 h-16">
//               <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//               <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//             </div>
//             <p className="mt-4 text-gray-200 text-lg font-semibold">
//               Loading...
//             </p>
//           </div>
//         )}

//         {/* 🔹 Header */}
//         <header className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-4">
//             {/* 🔹 Back Button */}
//             <button
//               onClick={handleGoBack}
//               className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//             >
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-5 w-5" 
//                 viewBox="0 0 20 20" 
//                 fill="currentColor"
//               >
//                 <path 
//                   fillRule="evenodd" 
//                   d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
//                   clipRule="evenodd" 
//                 />
//               </svg>
//               Back
//             </button>
//             <span className='text-2xl font-bold'>{userInfo.name || 'Unknown User'}</span>
//           </div>
//           <span>
//             <span className='font-bold mx-1'>Last Active:</span>
//             <span>{result}</span>
//           </span>
//         </header>

//         {/* 🔹 Main Content */}
//         <main className='flex-1 flex gap-3'>
//           <div className="w-full flex-1 pr-3 border-r-2 border-gray-600">
//             <h1 className="text-2xl font-bold">Gallery</h1>

//             {/* 🔹 Filters */}
//             <div className='flex justify-between flex-wrap gap-3 mt-3'>
//               <label>
//                 Starting Date:
//                 <input
//                   name="startingDate"
//                   value={search.startingDate}
//                   onChange={handleInputs}
//                   type="date"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Ending Date:
//                 <input
//                   name="endingDate"
//                   value={search.endingDate}
//                   onChange={handleInputs}
//                   type="date"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Starting Time:
//                 <input
//                   name="startingTime"
//                   value={search.startingTime}
//                   onChange={handleInputs}
//                   type="time"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <label>
//                 Ending Time:
//                 <input
//                   name="endingTime"
//                   value={search.endingTime}
//                   onChange={handleInputs}
//                   type="time"
//                   className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
//                 />
//               </label>
//               <button
//                 onClick={() => setSearch({
//                   startingDate: "",
//                   endingDate: "",
//                   startingTime: "",
//                   endingTime: ""
//                 })}
//                 className="border px-3 py-1 rounded-lg hover:bg-gray-700"
//               >
//                 Clear Filters
//               </button>
//             </div>

//             {/* 🔹 Screenshot Display */}
//             <div className="mt-5">
//               {filteredScreenshots.length === 0 ? (
//                 <p className="text-gray-400 text-center mt-10">
//                   {userSS.length === 0 ? "No screenshots found." : "No screenshots found for selected range."}
//                 </p>
//               ) : (
//                 ssTimeStamp.map((num, i) => (
//                   <div key={`${num.date}-${num.hrs}-${i}`} className="mb-6">
//                     <h2 className="text-2xl font-bold text-gray-200">
//                       Date: {num.date}
//                     </h2>
//                     <h2 className="text-lg font-semibold text-gray-200 mb-3">
//                       Hours: {num.hrs}:00 - {Number(num.hrs) + 1}:00
//                     </h2>

//                     {/* 🔹 Image Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                       {filteredScreenshots.map((ss, j) => {
//                         const ssDate = new Date(ss.timestamp)
//                         const hours = Number(format(ssDate, "HH"))
//                         const dateFormatted = format(ssDate, "dd,MM,yyyy")
                        
//                         const blockStart = Number(num.hrs)
//                         const blockEnd = blockStart + 1

//                         if (dateFormatted === num.date && hours >= blockStart && hours < blockEnd) {
//                           return (
//                             <div
//                               onClick={() => imageClicked(ss.url)}
//                               key={ss.timestamp + j}
//                               className="cursor-pointer bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-200"
//                             >
//                               <img
//                                 src={ss.url}
//                                 alt={`Screenshot from ${format(ssDate, "d MMM, yyyy 'at' h:mm a")}`}
//                                 className="w-full h-auto object-cover p-1 rounded-lg"
//                                 loading="lazy"
//                               />
//                               <div className="my-2 text-sm text-gray-300 flex flex-col items-start px-3">
//                                 <span>{format(ssDate, "d MMM, yyyy")}</span>
//                                 <span>{format(ssDate, "h:mm a")}</span>
//                               </div>
//                             </div>
//                           )
//                         }
//                         return null
//                       })}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* 🔹 Side Section */}
//           <aside>
//             <PhotoToVideo images={filteredScreenshots} />
//           </aside>
//         </main>
//       </div>

//       {/* 🔹 Image Modal */}
//       {showImage && (
//         <ImageModal currImg={openImg} setShowImage={setShowImage} />
//       )}
//     </>
//   )
// }






import React, { useEffect, useState } from 'react'
import { db } from "../config/firebase"
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { useParams, useNavigate } from 'react-router-dom'
import { format, formatDistanceToNowStrict } from "date-fns"
import ImageModal from '../components/ImageModal'
import PhotoToVideo from '../components/PhotoToVideo'

export default function Screenshots() {
  const params = useParams()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [userSS, setUserSS] = useState([])
  const [loading, setLoading] = useState(true)
  const [openImg, setOpenImg] = useState()
  const [showImage, setShowImage] = useState(false)
  const [search, setSearch] = useState({
    startingDate: "",
    endingDate: "",
    startingTime: "",
    endingTime: ""
  })

  // 🔹 Fetch user data and screenshots
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", params.id))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setUserInfo(querySnapshot.docs[0].data() || {})
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    const fetchScreenshots = async () => {
      try {
        const q = query(
          collection(db, "screenshots"), 
          where("user_id", "==", params.id),
          orderBy("timestamp", "desc")
        )
        const querySnapshot = await getDocs(q)
        const allScreenshots = querySnapshot.docs.map(doc => doc.data())
        setUserSS(allScreenshots)
      } catch (error) {
        console.error("Error fetching screenshots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    fetchScreenshots()
  }, [params.id])

  // 🔹 Last active time
  const validDate = userInfo?.lastActiveAt ? new Date(userInfo.lastActiveAt) : null
  const result = validDate
    ? formatDistanceToNowStrict(validDate, { addSuffix: true })
    : "unknown time"

  // 🔹 Handle image modal
  const imageClicked = (imgUrl) => {
    setOpenImg(imgUrl)
    setShowImage(true)
  }

  // 🔹 Handle input changes
  const handleInputs = (e) => {
    setSearch(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 🔹 Go back to previous page
  const handleGoBack = () => {
    navigate(-1)
  }

  // 🔹 Clear all filters
  const clearFilters = () => {
    setSearch({
      startingDate: "",
      endingDate: "",
      startingTime: "",
      endingTime: ""
    })
  }

  // 🔹 Filter screenshots by date and time
  const filteredScreenshots = userSS.filter((ss) => {
    if (
      !search.startingDate ||
      !search.endingDate ||
      !search.startingTime ||
      !search.endingTime
    ) {
      return true // no filters applied, show all
    }

    const screenshotTime = new Date(ss.timestamp)
    const start = new Date(`${search.startingDate}T${search.startingTime}`)
    const end = new Date(`${search.endingDate}T${search.endingTime}`)

    return screenshotTime >= start && screenshotTime <= end
  })

  // 🔹 Group filtered screenshots by date/hour
  const ssTimeStamp = [
    ...new Map(
      filteredScreenshots.map((ss) => {
        const date = new Date(ss.timestamp)
        const formatDate = format(date, "dd,MM,yyyy")
        const formatHrs = format(date, "HH")
        return [`${formatDate}-${formatHrs}`, { date: formatDate, hrs: formatHrs }]
      })
    ).values()
  ]

  return (
    <>
      <div className='flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white p-6 relative'>
        {/* 🔹 Professional Loader */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-transparent border-t-blue-300 rounded-full animate-spin animation-delay-[-0.3s]"></div>
            </div>
            <p className="mt-6 text-gray-200 text-lg font-semibold tracking-wide">
              Loading Screenshots...
            </p>
          </div>
        )}

        {/* 🔹 Professional Header */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-6">
            {/* 🔹 Professional Back Button */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-600 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex flex-col">
              <span className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                {userInfo.name || 'Unknown User'}
              </span>
              <span className="text-gray-400 text-sm mt-1">User Screenshots Gallery</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Last Active:</span>
              <span className="text-blue-300">{result}</span>
            </div>
            <span className="text-gray-500 text-sm mt-1">
              {userSS.length} total screenshots
            </span>
          </div>
        </header>

        {/* 🔹 Main Content */}
        <main className='flex-1 flex gap-8'>
          {/* 🔹 Gallery Section */}
          <div className="flex-1">
            {/* 🔹 Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Screenshot Gallery</h1>
                <p className="text-gray-400">Browse and manage user activity screenshots</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
                <span className="text-blue-300 font-semibold">
                  {filteredScreenshots.length} screenshots
                </span>
              </div>
            </div>

            {/* 🔹 Professional Filters */}
            <div className='bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50 backdrop-blur-sm'>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filter Screenshots
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    name="startingDate"
                    value={search.startingDate}
                    onChange={handleInputs}
                    type="date"
                    className='w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    name="endingDate"
                    value={search.endingDate}
                    onChange={handleInputs}
                    type="date"
                    className='w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    name="startingTime"
                    value={search.startingTime}
                    onChange={handleInputs}
                    type="time"
                    className='w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    name="endingTime"
                    value={search.endingTime}
                    onChange={handleInputs}
                    type="time"
                    className='w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg border border-gray-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>

            {/* 🔹 Screenshot Display */}
            <div className="mt-8">
              {filteredScreenshots.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-xl mb-2">
                    {userSS.length === 0 ? "No screenshots available" : "No screenshots match your filters"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {userSS.length === 0 
                      ? "This user hasn't taken any screenshots yet." 
                      : "Try adjusting your date and time filters."}
                  </p>
                  {userSS.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                    >
                      Show All Screenshots
                    </button>
                  )}
                </div>
              ) : (
                ssTimeStamp.map((num, i) => (
                  <div key={`${num.date}-${num.hrs}-${i}`} className="mb-12">
                    {/* 🔹 Time Group Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 mb-6 border border-gray-600/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            {num.date.replace(/,/g, '/')}
                          </h2>
                          <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {num.hrs}:00 - {Number(num.hrs) + 1}:00
                          </p>
                        </div>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          {filteredScreenshots.filter(ss => {
                            const ssDate = new Date(ss.timestamp)
                            const hours = Number(format(ssDate, "HH"))
                            const dateFormatted = format(ssDate, "dd,MM,yyyy")
                            return dateFormatted === num.date && hours >= Number(num.hrs) && hours < Number(num.hrs) + 1
                          }).length} screenshots
                        </span>
                      </div>
                    </div>

                    {/* 🔹 Professional Image Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {filteredScreenshots.map((ss, j) => {
                        const ssDate = new Date(ss.timestamp)
                        const hours = Number(format(ssDate, "HH"))
                        const dateFormatted = format(ssDate, "dd,MM,yyyy")
                        
                        const blockStart = Number(num.hrs)
                        const blockEnd = blockStart + 1

                        if (dateFormatted === num.date && hours >= blockStart && hours < blockEnd) {
                          return (
                            <div
                              onClick={() => imageClicked(ss.url)}
                              key={ss.timestamp + j}
                              className="group cursor-pointer bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-sm"
                            >
                              <div className="relative overflow-hidden">
                                <img
                                  src={ss.url}
                                  alt={`Screenshot from ${format(ssDate, "d MMM, yyyy 'at' h:mm a")}`}
                                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                  <span className="text-white text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                                    View Fullscreen
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="text-sm text-gray-300 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{format(ssDate, "d MMM, yyyy")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{format(ssDate, "h:mm a")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🔹 Side Section */}
          <aside className="w-96 flex-shrink-0">
            <PhotoToVideo images={filteredScreenshots} />
          </aside>
        </main>
      </div>

      {/* 🔹 Image Modal */}
      {showImage && (
        <ImageModal currImg={openImg} setShowImage={setShowImage} />
      )}
    </>
  )
}