<template>
  <div class="h-screen relative">
    <GeoErrorModal @closeGeoError="closeGeoError" v-if="geoError" :geoErrorMsg="geoErrorMsg"/>
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
import leaflet from 'leaflet';
import {onMounted, ref} from "vue";
import GeoErrorModal from "@/components/GeoErrorModal";

export default {
  name: 'HomeView',
  components: {GeoErrorModal},
  setup() {
    let map;
    onMounted(() => {
      // init map
      map = leaflet.map('map');

      // add tile layer
      leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);

      getGeolocation();
    })

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);

    const getGeolocation = () => {
      // Checando se tem coordenadas armazenada
      if (sessionStorage.getItem("coords")) {
        coords.value = JSON.parse(sessionStorage.getItem("coords"));
        plotGeolocation(coords.value);
        return;
      }
      fetchCoords.value = true;
      navigator.geolocation.getCurrentPosition(setCoords, getLocError);
    }

    const setCoords = (pos) => {
      // Pare de pegar coordenadas
      fetchCoords.value = null;
      // Coloque as coordenadas na sessão
      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      coords.value = setSessionCoords;
    }

    const getLocError = (err) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = err.message;
    }
    const closeGeoError = () => {
      geoError.value = null;
      geoErrorMsg.value = null;
    }

    const plotGeolocation = (coords) => {
      // Criar marcação
      const customMarker = leaflet.icon({
        iconUrl: require('../assets/mapMaker-red.png'),
        iconSize: [30, 35],
      })

      // Criar marcação com a coordenada
      geoMarker.value = leaflet.marker(
          [coords.lat, coords.lng],
          {icon: customMarker},
      ).addTo(map);

      // Ver minha localização atual
      map.setView([coords.lat, coords.lng], 17);
    }

    return {coords, geoMarker, closeGeoError, geoError, geoErrorMsg}

  }
}
</script>