import axios from "axios";

const countryAPI = "https://restcountries.com/v3.1";

const getAllCountryNames = async() => {
    try {
        const res = await axios.get(`${countryAPI}/all?fields=name`);
        const countries = res.data;
        const countryNames = countries.map((country: any) => country.name.common);

        return countryNames;
    } catch(e) {
        console.log("Error al obtener todos los productos:", e);
        return [];
    }
}

const getCountryUbi = async(name: string) => {
    try {
        const res = await axios.get(`${countryAPI}/name/${name}?fields=latlng`);
        const country = res.data[0];
        
        if (country && country.latlng && country.latlng.length === 2) {
            return {
                lat: country.latlng[0],
                lng: country.latlng[1]
            };
        }
        
        return null;
    } catch(e) {
        console.log("Error al obtener las coordenadas:", e);
        return null;
    }
}

export { getAllCountryNames, getCountryUbi };