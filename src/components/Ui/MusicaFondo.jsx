import React, { useState, useEffect } from "react";
import { useActionsContext } from "../../features/Actions/ActionsContext";
import { useDatosPublicComponentes } from "../../features/ControlComponents/ControladorComponentesContext";

const BackgroundMusic = () => {
  const { isMuted } = useActionsContext();
  const { componentes } = useDatosPublicComponentes();
  const [audio, setAudio] = useState(null);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(false);

  useEffect(() => {
    if (componentes) {
      setSonidoHabilitado(componentes.componente_sonido === true);
    }
  }, [componentes]);

  useEffect(() => {
    const newAudio = new Audio("/static/music.mp3");
    newAudio.loop = true;
    newAudio.preload = "auto";
    newAudio.volume = 0.009;
    setAudio(newAudio);

    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
        setAudio(null);
      }
    };
  }, []);


  useEffect(() => {
    if (!audio || !sonidoHabilitado) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      return;
    }

    const playAudio = async () => {
      try {
        if (!isMuted) {
          await audio.play();
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (error) {
        console.error("Error al reproducir/pausar el audio:", error);
      }
    };

    playAudio();
  }, [isMuted, audio, sonidoHabilitado]);

  return null;
};

export default BackgroundMusic;