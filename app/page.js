"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
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
import { grey } from "@mui/material/colors";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
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
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInvetory = inventory.filter((item) =>
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
                variant="outline"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
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
          onClick={() => {
            handleOpen();
          }}
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

        <Box display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          px={2} 
          >
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
            width="800px"
            height="300px"
            spacing={2}
            overflow="auto"
            sx={{ maxHeight: "300px" }}
          >
            {filteredInvetory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#DD5349"
                padding={2}
                borderRadius="4px"
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#ffcdd2",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
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
                  }}
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
