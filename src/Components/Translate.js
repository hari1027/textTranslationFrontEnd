import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { VolumeUp, CopyAll, SwapHoriz } from "@mui/icons-material";
import countries from "./data.js";

const Translate = () => {

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("hi-IN");

  const [isFromVolumeActive, setIsFromVolumeActive] = useState(false);
  const [isFromCopyActive, setIsFromCopyActive] = useState(false);
  const [isToVolumeActive, setIsToVolumeActive] = useState(false);
  const [isToCopyActive, setIsToCopyActive] = useState(false);

  const handleTranslate = async () => {
    if (!fromText.trim()) return;
    setToText("Translating...");

    try {
      const response = await fetch(
        `https://texttranslationbackend-production.up.railway.app/?text=${fromText.trim()}&source=${fromLang}&target=${toLang}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const translatedText = await response.text();
      setToText(translatedText);
    } catch (error) {
      console.error("Fetch error:", error);
      setToText("Error in translation");
    }
  };

  const clearAll = () =>{
    setFromText("");
    setToText("");
    setFromLang("en-GB");
    setToLang("hi-IN");
    setIsFromVolumeActive(false);
    setIsFromCopyActive(false);
    setIsToVolumeActive(false);
    setIsToCopyActive(false);
  }

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const toggleIcon = (iconState, setIconState, type, id) => {
    setIconState(!iconState);
    if(type === "volume"){
      setIsFromCopyActive(false)
      setIsToCopyActive(false)
      if(id === "from"){
        setIsToVolumeActive(false)
      }else{
        setIsFromVolumeActive(false)
      }
    }
    if(type === "copy"){
      setIsFromVolumeActive(false)
      setIsToVolumeActive(false)
      if(id === "from"){
        setIsToCopyActive(false)
      }else{
        setIsFromCopyActive(false)
      }
    }
    if (!iconState) {
      if (type === "copy") {
        navigator.clipboard.writeText(id === "from" ? fromText : toText);
      } else if (type === "volume") {
        let utterance = new SpeechSynthesisUtterance(id === "from" ? fromText : toText);
        utterance.lang = id === "from" ? fromLang : toLang;
        speechSynthesis.speak(utterance);
      }
    } else {
      if (type === "volume") {
        speechSynthesis.cancel();
      }
    }
  };

  useEffect(()=>{
    setIsFromVolumeActive(false);
    setIsFromCopyActive(false);
    setIsToVolumeActive(false);
    setIsToCopyActive(false);
  },[fromText,toText ,fromLang,toLang])

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4">Translate</Typography>
      </Box>

      <Box my={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              placeholder="Enter text"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              value={toText}
              placeholder="Translation"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <Select
              fullWidth
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
            >
              {Object.entries(countries).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2} textAlign="center">
            <IconButton className="exchange" onClick={handleExchange}>
              <SwapHoriz />
            </IconButton>
          </Grid>
          <Grid item xs={5}>
            <Select
              fullWidth
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
            >
              {Object.entries(countries).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} textAlign="left">
            <IconButton
              onClick={() =>
                toggleIcon(isFromVolumeActive, setIsFromVolumeActive, "volume" , "from")
              }
              style={{ color: isFromVolumeActive ? "green" : "red" }}
            >
              <VolumeUp />
            </IconButton>
            <IconButton
              onClick={() =>
                toggleIcon(isFromCopyActive, setIsFromCopyActive, "copy" , "from")
              }
              style={{ color: isFromCopyActive ? "green" : "red" }}
            >
              <CopyAll />
            </IconButton>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <IconButton
              onClick={() =>
                toggleIcon(isToVolumeActive, setIsToVolumeActive, "volume" , "to")
              }
              style={{ color: isToVolumeActive ? "green" : "red" }}
            >
              <VolumeUp />
            </IconButton>
            <IconButton
              onClick={() =>
                toggleIcon(isToCopyActive, setIsToCopyActive, "copy" , "to")
              }
              style={{ color: isToCopyActive ? "green" : "red" }}
            >
              <CopyAll />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleTranslate}>
              Translate Text
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={clearAll} color={"error"}>
               Clear All
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Translate;
