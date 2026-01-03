// import axios from "axios";

// const pinata = {
//   upload: {
//     file: async (formData: FormData) => {
//       console.log(process.env.PINATA_JWT);  
//       const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//       const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZWUyNWM2ZS03N2MwLTRjZTktYWRiNy02MDU1Mjk5NDYxOWIiLCJlbWFpbCI6ImRldi5kZWNlcHRvcjU1NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmE0NDU4MGRlZTU1YTM4YjUxMTAiLCJzY29wZWRLZXlTZWNyZXQiOiI2NDVmOTcwODA0NThlMWE3Y2IzYzA5MTMyZGFjZmEwOTQ5ZGQzNWJmZmZhN2NkMTczODAyMmRhMjU2YjZjOGI5IiwiZXhwIjoxNzk5MDAxNjczfQ.RKxY2IvzJjfOmDfysE0yT9_8XSaJcanDn1P1hslbtZk`
//       const jwtFromEnv = process.env.PINATA_JWT as string;
      
//     //   console.log(jwtFromEnv);
//     //   console.log(jwt);
//       if (!jwt) {
//         throw new Error("Pinata JWT is missing");
//       }
//       console.log(process.env.PINATA_JWT?.split(".").length);


//       const response = await axios.post(url, formData, {
//         maxContentLength: Infinity,
//         headers: {
//         //   "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${jwt}`,
//         //   pinata_api_key: `${process.env.PINATA_API_KEY}`,
//         //   pinata_secret_api_key: `${process.env.PINATA_SECRET_API_KEY}`,
//         },
//       });

//       return response.data;
//     },
//   },
// };

// export default pinata;

const pinata = {
  upload: {
    file: async (formData: FormData) => {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      //console.log("CID:", data.IpfsHash);

      
      return data;
    },
  },
};

export default pinata;
