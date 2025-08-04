import { useState, useEffect, useMemo } from "react";
import { appService } from "../../Api/services/appService";
import { useFetch } from "../../hooks/useFetch";
import { LoadingSpinner } from "../../components/Windows/LoadingSpinner";

export const useAppData = () => {
  const [state, setState] = useState({
    colores: [],
    fuentesAplicar: [],
    temaActivo: null,
    diseñoActivo: null,
  });

  const [cargando, setCargando] = useState(true);
  const [temaAplicado, setTemaAplicado] = useState(false);

  const { data: fuentesData, loading: fuentesLoading } = useFetch(
    appService.getFuentesAplicar,
    "fuentes",
    [],
    { immediate: true }
  );
  const { data: homeDataInitial, loading: homeInitialLoading } = useFetch(
    appService.getHomeData,
    "home",
    [],
    { immediate: true }
  );

  const applyTheme = useMemo(
    () => (tema) => {
      if (!tema || !state.colores.length || !state.fuentesAplicar.length) {
        console.warn("No se pudo aplicar el tema: faltan datos");
        return false;
      }

      Object.entries(tema).forEach(([key, value]) => {
        if (
          key.endsWith("_id") &&
          !key.startsWith("fuente_") &&
          !["id", "titulo", "activo"].includes(key)
        ) {
          const color =
            state.colores.find((c) => c.id === value)?.codigo_hex || "#000000";
          document.documentElement.style.setProperty(
            `--${key.replace("_id", "")}`,
            color
          );
        }
      });

      const fuentesConfig = [
        {
          id: "fuente_primaria_id",
          varFuente: "fuentePrimaria",
          varColor: "colorFuentePrimaria",
        },
        {
          id: "fuente_secundaria_id",
          varFuente: "fuenteSecundaria",
          varColor: "colorFuenteSecundaria",
        },
        {
          id: "fuente_terciaria_id",
          varFuente: "fuenteTerciaria",
          varColor: "colorFuenteTerciaria",
        },
      ];

      fuentesConfig.forEach(({ id, varFuente, varColor }) => {
        const fuenteData = state.fuentesAplicar.find((f) => f.id === tema[id]);
        document.documentElement.style.setProperty(
          `--${varFuente}`,
          `"${fuenteData?.fuente?.nombre || "Arial"}"`
        );
        document.documentElement.style.setProperty(
          `--${varColor}`,
          fuenteData?.color?.codigo_hex || "#000000"
        );
      });

      console.log("Tema aplicado al DOM:", tema);
      return true;
    },
    [state.colores, state.fuentesAplicar]
  );

  useEffect(() => {
    if (fuentesLoading || homeInitialLoading) {
      console.log("Esperando datos:", { fuentesLoading, homeInitialLoading });
      return;
    }

    if (fuentesData && homeDataInitial) {
      console.log("Datos iniciales recibidos:", {
        fuentesData,
        homeDataInitial,
      });

      const newState = {
        fuentesAplicar: fuentesData || [],
        colores: homeDataInitial.colores || [],
        diseñoActivo: homeDataInitial.diseño_activo || null,
        temaActivo: homeDataInitial.tema_activo || null,
      };
      setState(newState);

      if (
        newState.temaActivo &&
        newState.colores.length &&
        newState.fuentesAplicar.length
      ) {
        const temaAplicadoExitoso = applyTheme(newState.temaActivo);
        if (temaAplicadoExitoso) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              setTemaAplicado(true);
              setCargando(false);
              console.log("Tema aplicado y DOM listo:", {
                cargando: false,
                temaAplicado: true,
              });
            }, 10);
          });
        } else {
          setCargando(false); // Resuelve cargando incluso si el tema falla
          console.warn("Tema no aplicado correctamente");
        }
      } else {
        setCargando(false); // Resuelve cargando si no hay tema
      }
    } else {
      setCargando(false); // Resuelve si no hay datos
    }
  }, [
    fuentesData,
    homeDataInitial,
    fuentesLoading,
    homeInitialLoading,
    applyTheme,
  ]);

  return { state, cargando, temaAplicado };
};
