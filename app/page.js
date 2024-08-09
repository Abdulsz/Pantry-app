"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { firestore, storage } from "@/firebase";

import {
  Box,
  Typography,
  Modal,
  Stack,
  TextField,
  Button,
  Container,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Webcam from "react-webcam";

// Initialize Firebase storage
//const storage = getStorage();

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);




  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImgSrc(url);
      console.log("File Uploaded Successfully");
      setUploadOpen(false); // Close the modal after upload
    } catch (error) {
      console.log("Error uploading:", error);
      
    }finally{
      setUploading(false);
    }
      
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1});
    } else {
      await setDoc(docRef, { quantity: 1, imgSrc });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setCaptureOpen(false);
  }, [webcamRef]);

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCaptureOpen = () => {
    setImgSrc(null);
    setCaptureOpen(true);
  };
  const handleCaptureClose = () => setCaptureOpen(false);
  const handleUploadOpen = () => {
    setImgSrc(null);
    setFile(null);
    setUploadOpen(true);

  };
  const handleUploadClose = () => setUploadOpen(false);

  const handleAddItem = async () => {
    
    await addItem(itemName);
    setItemName("");
    setOpen(false);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Container width="100%" height="350px" position="relative">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/fooddelivery-6176f.appspot.com/o/inventory%2Fnew%20tomatos.jpg?alt=media&token=df7c6654-3ae9-42df-8278-fd87f9765c4a"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Container>

      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={4}
      >
        <Typography
          variant="h1"
          color="#DD5349"
          fontFamily="'Roboto', sans-serif"
          fontWeight="bold"
        >
          Manage Your Pantry
        </Typography>
      </Box>

      <Box
        width="100vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        py={4}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={600}
            bgcolor="white"
            border="2px solid #0000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Button
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                  fontFamily: "'Roboto', sans-serif",
                  textTransform: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
                variant="contained"
                onClick={handleCaptureOpen}
              >
                Capture
              </Button>
              <Button
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                  fontFamily: "'Roboto', sans-serif",
                  textTransform: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
                variant="contained"
                onClick={handleUploadOpen}
              >
                Upload Image
              </Button>
            </Stack>
            <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333333",
                },
                fontFamily: "'Roboto', sans-serif",
                textTransform: "none",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              variant="contained"
              onClick={handleAddItem}
            >
              Add
            </Button>
          </Box>
        </Modal>

        <Modal open={captureOpen} onClose={handleCaptureClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={600}
            bgcolor="white"
            border="2px solid #0000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            {imgSrc ? (
              <img src={imgSrc} alt="webcam" />
            ) : (
              <Webcam height={400} width={400} ref={webcamRef} />
            )}
            <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333333",
                },
                fontFamily: "'Roboto', sans-serif",
                textTransform: "none",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              variant="contained"
              onClick={capture}
            >
              Capture Photo
            </Button>
          </Box>
        </Modal>

        <Modal open={uploadOpen} onClose={handleUploadClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #0000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6">Upload Image</Typography>
            <input type="file" onChange={handleFileChange} />
            <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333333",
                },
                fontFamily: "'Roboto', sans-serif",
                textTransform: "none",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: 500,
              }}
              variant="contained"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            {imgSrc && (
              <Box>
                <Typography variant="body1">Uploaded Image:</Typography>
                <img src={imgSrc} alt="Uploaded" style={{ width: "100%" }} />
              </Box>
            )}
          </Box>
        </Modal>

        <Button
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333333",
            },
            fontFamily: "'Roboto', sans-serif",
            textTransform: "none",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: 500,
          }}
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>

        <Box width="800px">
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <Box>
          <Box
            width="100%"
            height="100px"
            display="flex"
            alignItems="center"
            justifyContent="left"
          >
            <Typography variant="h3" color="#000">
              Inventory Items
            </Typography>
          </Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            width="100%"
          >
            {filteredInventory.map(({ name, quantity, imgSrc }) => (
              <Box
                key={name}
                width="200px"
                bgcolor="#DD5349"
                borderRadius="8px"
                overflow="hidden"
                boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                transition="all 0.3s ease"
                sx={{
                  "&:hover": {
                    bgcolor: "#ffcdd2",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <img
                  src={imgSrc}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <Box p={2}>
                  <Typography variant="h5" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>

                  <Typography variant="h5" color="#333" textAlign="center">
                    {quantity}
                  </Typography>

                  <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      fontFamily: "'Roboto', sans-serif",
                      textTransform: "none",
                      padding: "10px 20px",
                      fontSize: "16px",
                      fontWeight: 500,
                      display: "block",
                      margin: "10px auto 0",
                    }}
                    variant="contained"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
