import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { componentsService } from "../../Api/services/componentsService";
import { useFetch } from "../../hooks/useFetch";

export const useComponents = () => {
  const location = useLocation();
  
  const { data: componentes, loading: componentesLoading, error: componentesError } = useFetch(
    componentsService.getComponents,
    "componentes",
    [location]
  );
  const { data: puntosClub, loading: puntosClubLoading, error: puntosClubError } = useFetch(
    componentsService.getPuntosClub,
    "puntosClub",
    [location]
  );


  return {
    componentes: componentes || {},
    puntosClub: puntosClub || {},
    loading: componentesLoading || puntosClubLoading,
    error: componentesError || puntosClubError,
  };
};